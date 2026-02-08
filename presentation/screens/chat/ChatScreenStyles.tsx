import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    
    // Ride Info Styles
    rideInfoContainer: {
        backgroundColor: '#f0f2f5',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    rideInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    rideInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rideInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    rideInfoStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
    rideInfoDetails: {
        gap: 8,
    },
    rideInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rideInfoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    headerStatus: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAction: {
        padding: 8,
        marginLeft: 4,
    },

    // Messages Container
    messagesContainer: {
        flex: 1,
    },
    messagesList: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        flexGrow: 1,
    },

    // Message Styles
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 8,
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
        paddingRight: 4,
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 8,
        marginBottom: 4,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacer: {
        width: 40,
    },
    messageBubble: {
        maxWidth: screenWidth * 0.75,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        marginVertical: 1,
    },
    myMessageBubble: {
        backgroundColor: '#4CAF50',
        borderBottomRightRadius: 4,
        alignSelf: 'flex-end',
    },
    otherMessageBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 4,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    messageTime: {
        fontSize: 12,
        marginLeft: 8,
    },
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherMessageTime: {
        color: '#999',
    },
    messageStatus: {
        marginLeft: 4,
    },

    // Typing Indicator
    typingContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 8,
        justifyContent: 'flex-start',
    },
    typingBubble: {
        backgroundColor: '#fff',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#999',
        marginHorizontal: 2,
    },
    typingText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },

    // Input Area
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 4,
        paddingVertical: 4,
        marginRight: 8,
        maxHeight: 120,
    },
    attachButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxHeight: 100,
        color: '#333',
    },
    emojiButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    recordingButton: {
        backgroundColor: '#f44336',
        shadowColor: '#f44336',
    },

    // Quick Actions (could be added later)
    quickActionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    quickAction: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        marginRight: 8,
    },
    quickActionText: {
        fontSize: 14,
        color: '#666',
    },

    // Message Types (for future features)
    imageMessage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginVertical: 4,
    },
    audioMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    audioButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    audioDuration: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },

    // System Messages
    systemMessage: {
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginVertical: 8,
    },
    systemMessageText: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
    },

    // Date Separator
    dateSeparator: {
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginVertical: 8,
    },
    dateSeparatorText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },

    // Loading States
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },

    // Error States
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#f44336',
        textAlign: 'center',
        marginTop: 8,
    },
    retryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginTop: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
