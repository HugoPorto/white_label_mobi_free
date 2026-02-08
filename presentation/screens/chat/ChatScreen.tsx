import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Platform,
    Alert,
    Keyboard,
    BackHandler
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ChatScreenStyles';
import { DateSeparator } from './ChatComponents';
import { useFocusEffect } from '@react-navigation/native';
import { ChatViewModel } from './ChatViewModel';
import { container } from '../../../di/container';
import { useAuth } from '../../hooks/useAuth';
import { useUserRole } from '../../context/UserRoleContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigator/MainStackNavigator';

interface Props extends StackScreenProps<RootStackParamList, 'ChatScreen'> { };

interface Message {
    id: string;
    text: string;
    timestamp: Date;
    isMe: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'audio';
    is_driver?: boolean;
}

export default function ChatScreen({ navigation, route }: Props) {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const socketInitialized = useRef(false);
    const viewModel: ChatViewModel = container.resolve('chatViewModel');
    const { authResponse } = useAuth();
    const { userRole } = useUserRole();
    const comeFrom = route.params?.comeFrom;
    const id_receiver = route.params?.id_receiver;
    const id_client_request = route.params?.id_client_request;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (comeFrom === 'DriverSchedulesScreen') {
                    navigation.navigate('DriverSchedulesScreen');
                } else if (comeFrom === 'DriverClientRequestTripScheduleScreen') {
                    navigation.navigate('DriverClientRequestTripScheduleScreen');
                } else if (comeFrom === 'DriverTripHistoryScreen') {
                    navigation.navigate('DriverTripHistoryScreen');
                } else if (comeFrom === 'ClientTripHistoryScreen') {
                    navigation.navigate('ClientTripHistoryScreen');
                } else if (comeFrom === 'ClientTripDeliveryHistoryScreen') {
                    navigation.navigate('ClientTripDeliveryHistoryScreen');
                } else {
                    navigation.goBack();
                }
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [userRole, comeFrom])
    );

    const handleGetMessagesByClientRequest = React.useCallback(async () => {
        console.log('🔄 Carregando mensagens antigas para o chat...');
        setMessages([]); // Limpa mensagens antigas antes de carregar novas
        if (authResponse !== null) {
            try {
                const response = await viewModel.getMessagesByClientRequest(id_client_request!);
                console.log('Mensagens recebidas do backend:', response);

                if (Array.isArray(response) && response.length > 0) {
                    console.log('📦 Carregando mensagens antigas:', response.length);

                    // Converter as mensagens do backend para o formato da interface Message
                    const oldMessages: Message[] = response.reverse().map((msg: any) => ({
                        id: msg.id.toString(),
                        text: msg.text,
                        timestamp: new Date(msg.timestamp),
                        isMe: msg.id_sender === authResponse?.user.id,
                        status: msg.status || 'delivered',
                        type: msg.type || 'text',
                        is_driver: msg.is_driver
                    }));

                    console.log('✅ Mensagens antigas formatadas:', oldMessages.length);
                    setMessages(oldMessages);

                    // Rola para o fim após carregar as mensagens antigas
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: false });
                    }, 300);
                } else {
                    console.log('ℹ️ Nenhuma mensagem antiga encontrada');
                }
            } catch (e) {
                console.error('❌ Erro ao obter mensagens:', e);
            }
        }
    }, [authResponse, id_client_request, viewModel]);

    useFocusEffect(
        React.useCallback(() => {
            console.log('📱 ChatScreen focused - carregando mensagens...');
            handleGetMessagesByClientRequest();
            return () => { };
        }, [handleGetMessagesByClientRequest])
    );

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        try {
            await viewModel.sendMessage({
                text: inputText.trim(),
                timestamp: new Date(),
                isMe: true,
                status: 'read',
                type: 'text',
                id_user: authResponse?.user.id || 0,
                id_sender: authResponse?.user.id || 0,
                id_receiver: id_receiver,
                id_client_request: id_client_request,
                is_driver: userRole === 'DRIVER' ? true : false
            });

            setMessages(prevMessages => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    text: inputText.trim(),
                    timestamp: new Date(),
                    isMe: true,
                    status: 'sent',
                    type: 'text',
                    is_driver: userRole === 'DRIVER' ? true : false
                };

                return [...prevMessages, newMessage];
            });

            setInputText('');
        } catch (error) {
            Alert.alert('❌ Erro', 'Não foi possível enviar a mensagem. Tente novamente mais tarde.');
        }
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        console.log('Renderizando mensagem:', item);
        const isMe = item.isMe;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const isDriver = item.is_driver;
        const showDate = !prevMessage ||
            new Date(item.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();

        return (
            <>
                {showDate && <DateSeparator date={item.timestamp} />}
                <View style={[
                    styles.messageContainer,
                    isMe ? styles.myMessageContainer : styles.otherMessageContainer
                ]}>
                    {!isMe && isDriver && (
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="car-sport" size={16} color="#fff" />
                            </View>
                        </View>
                    )}

                    {!isMe && !isDriver && (
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={16} color="#fff" />
                            </View>
                        </View>
                    )}
                    <View style={[
                        styles.messageBubble,
                        isMe ? styles.myMessageBubble : styles.otherMessageBubble
                    ]}>
                        <Text style={[
                            styles.messageText,
                            isMe ? styles.myMessageText : styles.otherMessageText
                        ]}>
                            {item.text}
                        </Text>

                        <View style={styles.messageFooter}>
                            <Text style={[
                                styles.messageTime,
                                isMe ? styles.myMessageTime : styles.otherMessageTime
                            ]}>
                                {formatTime(item.timestamp)}
                            </Text>

                            {isMe && (
                                <View style={styles.messageStatus}>
                                    {item.status === 'sending' && (
                                        <Ionicons name="time" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'sent' && (
                                        <Ionicons name="checkmark" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'delivered' && (
                                        <Ionicons name="checkmark-done" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'read' && (
                                        <Ionicons name="checkmark-done" size={14} color="#4CAF50" />
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {isMe && isDriver && (
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="car-sport" size={16} color="#fff" />
                            </View>
                        </View>
                    )}

                    {isMe && !isDriver && (
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={16} color="#fff" />
                            </View>
                        </View>
                    )}
                </View>
            </>
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            console.log('Auth Response Id:', authResponse!.user.id);
            console.log('🎭 Role atual do usuário:', userRole || 'Nenhuma role definida');
            console.log('ChatScreen focused');

            // Inicializar socket apenas se ainda não foi inicializado
            if (!socketInitialized.current) {
                console.log('🔌 Iniciando socket...');
                viewModel.initSocket();
                socketInitialized.current = true;
                console.log('✅ Socket inicializado com sucesso');
            } else {
                console.log('ℹ️ Socket já está inicializado, pulando inicialização');
            }

            if (userRole === 'CLIENT') {
                viewModel.listenerChatMessageDriver((data: any) => {
                    if (userRole === 'CLIENT') {
                        // CLIENTE RECEBE MENSAGEM DO MOTORISTA
                        if (authResponse?.user?.id === data.id_receiver) {
                            // VERIFICAR SE A MENSAGEM JÁ EXISTE
                            setMessages((prevMessages) => {
                                const messageExists = prevMessages.find(msg => msg.id === data.id.toString());

                                if (messageExists) {
                                    console.log('⚠️ MENSAGEM DUPLICADA DETECTADA, IGNORANDO...');
                                    return prevMessages;
                                }

                                console.log('➕ ADICIONANDO NOVA MENSAGEM À LISTA DO CLIENTE.');

                                const newMessage: Message = {
                                    id: data.id.toString(),
                                    text: data.text.trim(),
                                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                                    isMe: false,
                                    status: 'delivered',
                                    type: 'text',
                                    is_driver: data.is_driver
                                };

                                return [...prevMessages, newMessage];
                            });

                            // SCROLL PARA BAIXO AO RECEBER NOVA MENSAGEM
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                        } else {
                            console.error('❌ CLIENTE NÃO DEVE RECEBER ESTA MENSAGEM.');
                        }
                    }
                });
            }

            if (userRole === 'DRIVER') {
                viewModel.listenerChatMessageClient((data: any) => {
                    if (userRole === 'DRIVER') {
                        if (authResponse?.user?.id === data.id_receiver) {

                            // VERIFICAR SE A MENSAGEM JÁ EXISTE
                            setMessages((prevMessages) => {
                                const messageExists = prevMessages.find(msg => msg.id === data.id.toString());
                                if (messageExists) {
                                    return prevMessages;
                                }

                                const newMessage: Message = {
                                    id: data.id.toString(),
                                    text: data.text.trim(),
                                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                                    isMe: false,
                                    status: 'delivered',
                                    type: 'text',
                                    is_driver: data.is_driver
                                };

                                return [...prevMessages, newMessage];
                            });

                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                        }
                    }
                });
            }


            return () => {
                console.log('🧹 Limpando listeners do socket...');
                viewModel.disconnectSocket();
                socketInitialized.current = false;
                console.log('🔌 Socket desconectado e flag resetada');
            };
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flex: 1,
                backgroundColor: '#E8EAF6',
                marginBottom: keyboardHeight > 0 ? 15 : 0
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    marginBottom: keyboardHeight > 0 ? Math.max(keyboardHeight - insets.bottom + 150, 150) : 115,
                    paddingBottom: 15
                }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={[
                            styles.messagesList,
                            {
                                paddingBottom: keyboardHeight > 0 ? 15 : 0,
                                flexGrow: 1
                            }
                        ]}
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => {
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                        }}
                        onLayout={() => {
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: false });
                            }, 500);
                        }}
                        ListEmptyComponent={
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 40,
                                opacity: 0.5
                            }}>
                                <Ionicons name="chatbubbles-outline" size={64} color="#B0BEC5" style={{ marginBottom: 16 }} />
                                <Text style={{
                                    fontSize: 16,
                                    color: '#78909C',
                                    textAlign: 'center',
                                    fontWeight: '500'
                                }}>
                                    Nenhuma mensagem ainda
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#B0BEC5',
                                    textAlign: 'center',
                                    marginTop: 8
                                }}>
                                    Inicie a conversa enviando uma mensagem
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
            <View style={[
                styles.inputContainer,
                {
                    paddingBottom: insets.bottom + 10,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e8eaed',
                    position: 'absolute',
                    bottom: keyboardHeight > 0 ? keyboardHeight - insets.bottom + 50 : 0,
                    left: 0,
                    right: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    zIndex: 1000,
                }
            ]}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Mensagem..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={1000}
                        onFocus={() => {
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 300);
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        {
                            opacity: inputText.trim() ? 1 : 0.4,
                            transform: [{ scale: inputText.trim() ? 1 : 0.9 }]
                        }
                    ]}
                    onPress={sendMessage}
                    disabled={!inputText.trim()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.bottomBar} />
            </View>
        </SafeAreaView>
    );
}
