import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Container Principal
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header
    header: {
        // backgroundColor: '#075E54',
        backgroundColor: '#4CAF50',
        paddingTop: Platform.OS === 'ios' ? 0 : 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },

    // Barra de Pesquisa
    searchContainer: {
        overflow: 'hidden',
        paddingHorizontal: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        marginBottom: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        padding: 0,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },

    // Contador de não lidas
    unreadCountContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    unreadCountText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },

    // Bottom Bar
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    
    // Lista
    listContainer: {
        flexGrow: 1,
        paddingBottom: 60, // Espaço para a barra de navegação inferior
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 88,
    },

    // Item do Chat
    chatItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },

    // Avatar
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E0E0E0',
    },
    avatarPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#075E54',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    pinnedBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFC107',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
    },

    // Conteúdo do Chat
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '400',
    },
    timeTextUnread: {
        color: '#25D366',
        fontWeight: '600',
    },

    // Footer do Chat
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    readIndicator: {
        marginRight: 4,
    },
    messageTypeIcon: {
        marginRight: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: '#8E8E93',
        flex: 1,
    },
    lastMessageUnread: {
        color: '#000000',
        fontWeight: '500',
    },

    // Digitando
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    typingText: {
        fontSize: 14,
        color: '#25D366',
        fontWeight: '500',
        marginRight: 4,
    },
    typingDots: {
        flexDirection: 'row',
        gap: 2,
    },
    typingDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#25D366',
    },

    // Badge de não lidas
    unreadBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#25D366',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    unreadCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Botão Flutuante (FAB)
    fabButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#25D366',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});

export default styles;
