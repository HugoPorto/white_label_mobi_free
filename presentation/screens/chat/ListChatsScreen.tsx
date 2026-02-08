import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StatusBar,
    RefreshControl,
    SafeAreaView,
    Animated,
    Image,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';

// Interface para os chats
interface Chat {
    id: number;
    userId: number;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    isOnline: boolean;
    isTyping: boolean;
    isPinned: boolean;
    messageType: 'text' | 'image' | 'audio' | 'location';
    isLastMessageFromMe: boolean;
    isLastMessageRead: boolean;
}

export default function ListChatsScreen({ navigation }: any) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const searchAnimation = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            handleGetChats();
        }, [])
    );

    const handleGetChats = async () => {
        try {
            // TODO: Substituir por chamada real à API
            // const response = await chatViewModel.getChatsByUserId(userId);
            
            // Dados mockados para demonstração
            const mockChats: Chat[] = [
                {
                    id: 1,
                    userId: 101,
                    userName: 'Carlos Silva',
                    userAvatar: 'https://i.pravatar.cc/150?img=12',
                    lastMessage: 'Ótimo! Nos vemos às 14h então 👍',
                    lastMessageTime: new Date(Date.now() - 5 * 60000), // 5 minutos atrás
                    unreadCount: 2,
                    isOnline: true,
                    isTyping: false,
                    isPinned: true,
                    messageType: 'text',
                    isLastMessageFromMe: false,
                    isLastMessageRead: false
                },
                {
                    id: 2,
                    userId: 102,
                    userName: 'Ana Paula Santos',
                    userAvatar: 'https://i.pravatar.cc/150?img=5',
                    lastMessage: 'Obrigada pela carona! Foi ótimo conversar com você',
                    lastMessageTime: new Date(Date.now() - 30 * 60000), // 30 minutos
                    unreadCount: 0,
                    isOnline: false,
                    isTyping: false,
                    isPinned: true,
                    messageType: 'text',
                    isLastMessageFromMe: true,
                    isLastMessageRead: true
                },
                {
                    id: 3,
                    userId: 103,
                    userName: 'Roberto Lima',
                    userAvatar: 'https://i.pravatar.cc/150?img=33',
                    lastMessage: 'Já estou a caminho!',
                    lastMessageTime: new Date(Date.now() - 2 * 3600000), // 2 horas
                    unreadCount: 5,
                    isOnline: true,
                    isTyping: false,
                    isPinned: false,
                    messageType: 'text',
                    isLastMessageFromMe: false,
                    isLastMessageRead: false
                },
                {
                    id: 4,
                    userId: 104,
                    userName: 'Juliana Costa',
                    userAvatar: 'https://i.pravatar.cc/150?img=9',
                    lastMessage: '',
                    lastMessageTime: new Date(Date.now() - 3 * 3600000), // 3 horas
                    unreadCount: 0,
                    isOnline: true,
                    isTyping: true,
                    isPinned: false,
                    messageType: 'text',
                    isLastMessageFromMe: false,
                    isLastMessageRead: false
                },
                {
                    id: 5,
                    userId: 105,
                    userName: 'Fernando Oliveira',
                    userAvatar: 'https://i.pravatar.cc/150?img=15',
                    lastMessage: 'Foto',
                    lastMessageTime: new Date(Date.now() - 5 * 3600000), // 5 horas
                    unreadCount: 1,
                    isOnline: false,
                    isTyping: false,
                    isPinned: false,
                    messageType: 'image',
                    isLastMessageFromMe: false,
                    isLastMessageRead: false
                },
                {
                    id: 6,
                    userId: 106,
                    userName: 'Marina Alves',
                    userAvatar: 'https://i.pravatar.cc/150?img=20',
                    lastMessage: 'Áudio 0:45',
                    lastMessageTime: new Date(Date.now() - 24 * 3600000), // 1 dia
                    unreadCount: 0,
                    isOnline: false,
                    isTyping: false,
                    isPinned: false,
                    messageType: 'audio',
                    isLastMessageFromMe: true,
                    isLastMessageRead: false
                },
                {
                    id: 7,
                    userId: 107,
                    userName: 'Lucas Rodrigues',
                    userAvatar: 'https://i.pravatar.cc/150?img=51',
                    lastMessage: 'Localização compartilhada',
                    lastMessageTime: new Date(Date.now() - 2 * 24 * 3600000), // 2 dias
                    unreadCount: 0,
                    isOnline: false,
                    isTyping: false,
                    isPinned: false,
                    messageType: 'location',
                    isLastMessageFromMe: false,
                    isLastMessageRead: true
                },
                {
                    id: 8,
                    userId: 108,
                    userName: 'Patricia Mendes',
                    userAvatar: 'https://i.pravatar.cc/150?img=47',
                    lastMessage: 'Perfeito! Até amanhã então',
                    lastMessageTime: new Date(Date.now() - 3 * 24 * 3600000), // 3 dias
                    unreadCount: 0,
                    isOnline: false,
                    isTyping: false,
                    isPinned: false,
                    messageType: 'text',
                    isLastMessageFromMe: true,
                    isLastMessageRead: true
                }
            ];

            // Ordenar: fixados primeiro, depois por data
            const sortedChats = mockChats.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
            });

            setChats(sortedChats);
            setFilteredChats(sortedChats);
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
        }
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        
        if (text.trim() === '') {
            setFilteredChats(chats);
        } else {
            const filtered = chats.filter(chat =>
                chat.userName.toLowerCase().includes(text.toLowerCase()) ||
                chat.lastMessage.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredChats(filtered);
        }
    };

    const toggleSearch = () => {
        const toValue = isSearchVisible ? 0 : 1;
        
        Animated.spring(searchAnimation, {
            toValue,
            useNativeDriver: false,
            tension: 50,
            friction: 7
        }).start();

        setIsSearchVisible(!isSearchVisible);
        
        if (isSearchVisible) {
            setSearchText('');
            setFilteredChats(chats);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await handleGetChats();
        setRefreshing(false);
    };

    const handleChatPress = (chat: Chat) => {
        // TODO: Navegar para tela de chat individual
        // navigation.navigate('ChatScreen', { chatId: chat.id, userId: chat.userId, userName: chat.userName });
        console.log('Chat pressionado:', chat.userName);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) {
            return 'Agora';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}min`;
        } else if (diffHours < 24) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Ontem';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
    };

    const getMessageTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return 'image' as const;
            case 'audio': return 'mic' as const;
            case 'location': return 'location' as const;
            default: return null;
        }
    };

    const renderChatItem = ({ item }: { item: Chat }) => {
        const messageIcon = getMessageTypeIcon(item.messageType);

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item)}
                activeOpacity={0.7}
            >
                {/* Avatar com status online */}
                <View style={styles.avatarContainer}>
                    {item.userAvatar ? (
                        <Image
                            source={{ uri: item.userAvatar }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>
                                {item.userName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {item.isOnline && <View style={styles.onlineIndicator} />}
                    {item.isPinned && (
                        <View style={styles.pinnedBadge}>
                            <Ionicons name="pin" size={10} color="#FFFFFF" />
                        </View>
                    )}
                </View>

                {/* Conteúdo do chat */}
                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {item.userName}
                        </Text>
                        <Text style={[
                            styles.timeText,
                            item.unreadCount > 0 && styles.timeTextUnread
                        ]}>
                            {formatTime(item.lastMessageTime)}
                        </Text>
                    </View>

                    <View style={styles.chatFooter}>
                        <View style={styles.lastMessageContainer}>
                            {/* Indicador de lido/não lido para mensagens enviadas */}
                            {item.isLastMessageFromMe && (
                                <Ionicons
                                    name={item.isLastMessageRead ? 'checkmark-done' : 'checkmark'}
                                    size={16}
                                    color={item.isLastMessageRead ? '#34B7F1' : '#8E8E93'}
                                    style={styles.readIndicator}
                                />
                            )}
                            
                            {/* Ícone do tipo de mensagem */}
                            {messageIcon && !item.isTyping && (
                                <Ionicons
                                    name={messageIcon}
                                    size={14}
                                    color="#8E8E93"
                                    style={styles.messageTypeIcon}
                                />
                            )}
                            
                            {/* Texto da última mensagem ou indicador de digitação */}
                            {item.isTyping ? (
                                <View style={styles.typingContainer}>
                                    <Text style={styles.typingText}>digitando</Text>
                                    <View style={styles.typingDots}>
                                        <Animated.View style={[styles.typingDot, { opacity: searchAnimation }]} />
                                        <Animated.View style={[styles.typingDot, { opacity: searchAnimation }]} />
                                        <Animated.View style={[styles.typingDot, { opacity: searchAnimation }]} />
                                    </View>
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.lastMessage,
                                        item.unreadCount > 0 && styles.lastMessageUnread
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.lastMessage}
                                </Text>
                            )}
                        </View>

                        {/* Badge de mensagens não lidas */}
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCount}>
                                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="chatbubbles-outline" size={80} color="#C7C7CC" />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text>
            <Text style={styles.emptySubtitle}>
                Inicie uma conversa com outros usuários{'\n'}para ver suas mensagens aqui
            </Text>
        </View>
    );

    const searchHeight = searchAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60]
    });

    const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#075E54" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Conversas</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={toggleSearch}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isSearchVisible ? 'close' : 'search'}
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => console.log('Menu pressionado')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Barra de pesquisa animada */}
                <Animated.View style={[styles.searchContainer, { height: searchHeight }]}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="#dfdfdfff" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar conversas..."
                            value={searchText}
                            onChangeText={handleSearch}
                            placeholderTextColor="#dfdfdfff"
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity
                                onPress={() => handleSearch('')}
                                style={styles.clearButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close-circle" size={18} color="#8E8E93" />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>

                {/* Contador de não lidas */}
                {totalUnread > 0 && !isSearchVisible && (
                    <View style={styles.unreadCountContainer}>
                        <Text style={styles.unreadCountText}>
                            {totalUnread} mensagem{totalUnread > 1 ? 's' : ''} não lida{totalUnread > 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* Lista de chats */}
            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderChatItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#25D366']}
                        tintColor="#25D366"
                    />
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Botão flutuante para nova conversa */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => console.log('Nova conversa')}
                activeOpacity={0.9}
            >
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.bottomBar} />
        </SafeAreaView>
    );
}
