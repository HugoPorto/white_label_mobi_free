import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
        marginRight: -38
    },
    placeAutocomplete: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        zIndex: 1
    },
    mapChatButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginTop: 8,
    },
    placeDestinationAutocomplete: {
        position: 'absolute',
        top: 100,
        left: 10,
        right: 10,
        zIndex: 1
    },
    pinImage: {
        height: 50,
        width: 50,
        position: 'absolute'
    },
    timeAndDistanceView: {
        width: '100%',
        height: 70,
        backgroundColor: '#EA4C4C',
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: 20
    },
    timeAndDistanceText: {
        color: 'white',
        fontSize: 15
    },
    viewDecoration: {
        backgroundColor: 'black',
        width: '100%',
        height: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        paddingLeft: 20
    },
    textDecoration: {
        color: 'white',
        fontSize: 18
    },
    infoContainer: {
        backgroundColor: 'rgb(240, 240, 240)',
        height: 40,
        justifyContent: 'center',
        paddingLeft: 20,
        marginBottom: 10,
        borderRadius: 10
    },
    textTitle: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },
    rowContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        marginBottom: 10
    },
    dataContainer: {
        flex: 1
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    tripContainer: {
        marginLeft: 10
    },
    textPrice: {
        color: 'green',
        fontSize: 20,
        fontWeight: 'bold'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 15
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAction: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 10
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    modalHeaderSubtitle: {
        fontSize: 14,
        color: '#666'
    },
    modalCloseButton: {
        padding: 5
    },
    modalHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    // Chat Modal específico
    chatMessageArea: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    chatMessageBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        marginBottom: 16,
        maxWidth: '80%'
    },
    chatMessageText: {
        color: '#333',
        fontSize: 16
    },
    chatMessageTime: {
        color: '#999',
        fontSize: 12,
        marginTop: 4
    },
    chatFlexFiller: {
        flex: 1
    },
    chatInfoMessage: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center'
    },
    chatInfoMessageIcon: {
        marginBottom: 4
    },
    chatInfoMessageText: {
        color: '#856404',
        textAlign: 'center',
        fontSize: 14
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f8f8f8'
    },
    chatTextInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        marginRight: 12,
        color: '#0f0f0fff'
    },
    chatSendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    // BARRA DE AVISO - SEM INTERNET
    offlineBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    offlineBarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    // INDICADOR DE STATUS DO SOCKET (CANTO SUPERIOR DIREITO)
    socketStatusIndicator: {
        position: 'absolute',
        top: 50,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9998,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    socketStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    socketStatusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    // 🚦 SEMÁFORO PROFISSIONAL DE STATUS
    trafficLight: {
        position: 'absolute',
        top: 180,
        left: 26,
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
        zIndex: 9998,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    trafficLightBulb: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    trafficLightGreenActive: {
        backgroundColor: '#00E676',
        borderColor: '#00C853',
        shadowColor: '#00E676',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
    },
    trafficLightYellowActive: {
        backgroundColor: '#FFD600',
        borderColor: '#FFC400',
        shadowColor: '#FFD600',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
    },
    trafficLightInactive: {
        backgroundColor: 'rgba(60, 60, 60, 0.5)',
        borderColor: 'rgba(80, 80, 80, 0.3)',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
});

export default styles;