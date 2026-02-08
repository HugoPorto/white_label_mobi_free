import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    StatusBar,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ChatScreenStyles';
import { QuickActions, DateSeparator } from './ChatComponents';

// Interface para mensagens (mesmo tipo do ChatScreen principal)
interface Message {
    id: string;
    text: string;
    timestamp: Date;
    isMe: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'audio';
}

// Componente alternativo com abordagem diferente para o teclado
export default function ChatScreenAlternative() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const typingOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            timestamp: new Date(),
            isMe: true,
            status: 'sending',
            type: 'text',
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleQuickAction = (action: string) => {
        setShowQuickActions(false);
        // Implementar ações conforme necessário
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isMe = item.isMe;

        return (
            <View style={[
                styles.messageContainer,
                isMe ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                {!isMe && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="headset" size={16} color="#fff" />
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
                                <Ionicons name="checkmark-done" size={14} color="#4CAF50" />
                            </View>
                        )}
                    </View>
                </View>

                {isMe && <View style={styles.spacer} />}
            </View>
        );
    };

    // Calcular a altura do container considerando o teclado
    const containerStyle = {
        flex: 1,
        marginBottom: keyboardHeight > 0 ? keyboardHeight - insets.bottom : 0,
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FC7700" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <View style={styles.headerAvatar}>
                        <Ionicons name="headset" size={20} color="#fff" />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Suporte Partiu</Text>
                        <Text style={styles.headerStatus}>Online • Responde rapidamente</Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="call" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerAction}
                        onPress={() => setShowQuickActions(!showQuickActions)}
                    >
                        <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Actions */}
            <QuickActions
                visible={showQuickActions}
                onActionPress={handleQuickAction}
            />

            {/* Container principal que se ajusta ao teclado */}
            <View style={containerStyle}>
                {/* Lista de mensagens */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.messagesList, { paddingBottom: 10 }]}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input sempre visível na parte inferior */}
                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: '#fff',
                        borderTopWidth: 1,
                        borderTopColor: '#e0e0e0',
                        paddingBottom: insets.bottom + 10,
                    }
                ]}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity
                            style={styles.attachButton}
                            onPress={() => setShowQuickActions(!showQuickActions)}
                        >
                            <Ionicons name="add" size={24} color="#666" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={1000}
                            onFocus={() => {
                                // Scroll para o final quando focar no input
                                setTimeout(() => {
                                    flatListRef.current?.scrollToEnd({ animated: true });
                                }, 300);
                            }}
                        />

                        <TouchableOpacity style={styles.emojiButton}>
                            <Ionicons name="happy-outline" size={22} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// Instruções de uso:
/*
Para testar esta versão alternativa:

1. Temporariamente substitua a importação no MainStackNavigator:
   import ChatScreen from "../screens/chat/ChatScreenAlternative";

2. Esta versão usa uma abordagem diferente:
   - Não usa KeyboardAvoidingView
   - Controla manualmente a posição baseada na altura do teclado
   - Container se ajusta dinamicamente quando o teclado aparece/some

3. Se funcionar melhor, podemos aplicar as correções no ChatScreen principal
*/
