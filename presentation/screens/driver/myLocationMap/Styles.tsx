import { StyleSheet } from "react-native";

// Estilo de tema escuro para MapView (Google Maps Style JSON)
export const darkMapStyle = [
    // Labels (locais, ruas, POIs) visíveis e com cor clara
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#f5f5f5" }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            { "color": "#232323" }
        ]
    },
    // Landscape
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            { "color": "#2c2c2c" }
        ]
    },
    // Pontos de interesse
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            { "color": "#383838" }
        ]
    },
    // Ruas
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            { "color": "#444444" }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            { "color": "#222222" }
        ]
    },
    // Água
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            { "color": "#1a1a1a" }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#b5b5b5" }
        ]
    }
];

const styles = StyleSheet.create({
    header_modal_settings: {
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
    header_modal_vehicles: {
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
    modal_cpf_view_1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modal_cpf_view_2: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
    },
    container: {
        flex: 1,
    },
    toggleContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#ecececff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#e3ffe2ff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    toggleWrapper: {
        flex: 1,
        alignItems: 'flex-start',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Container principal dos saldos
    balanceHeaderContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        gap: 12,
    },
    // Container do Saldo Ganho
    earnedBalanceContainer: {
        flex: 0.7, // 20% menor que creditBalanceContainer
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
    },
    // Container do Saldo de Créditos
    creditBalanceContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: '#FC7700',
    },
    // Container do ícone
    balanceIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    // Container das informações de saldo
    balanceInfo: {
        flex: 1,
    },
    // Label do tipo de saldo
    balanceLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        marginBottom: 2,
    },
    // Valor do saldo ganho
    earnedBalanceValue: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '700',
    },
    // Valor do saldo de créditos
    creditBalanceValue: {
        fontSize: 10,
        color: '#FC7700',
        fontWeight: '700',
    },
    // Botão para adicionar créditos
    addCreditButton: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'rgba(252, 119, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FC7700',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    balanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    balanceText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    addBalanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FC7700',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    addBalanceText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    // Estilos do Modal de Ajuda
    helpModalScrollView: {
        flex: 1,
    },
    helpModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    helpModalContainer: {
        width: '94%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 0,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        overflow: 'hidden',
    },
    helpModalHeader: {
        backgroundColor: '#4CAF50',
        paddingTop: 40,
        paddingHorizontal: 32,
        paddingBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    helpModalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    helpModalIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    helpModalTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    helpModalSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    helpModalContent: {
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    helpModalWelcomeContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    helpModalWelcomeText: {
        fontSize: 17,
        color: '#495057',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 20,
    },
    helpModalOptionsContainer: {
        marginBottom: 24,
    },
    helpModalOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    helpModalOptionButtonGreen: {
        borderLeftColor: '#4CAF50',
        shadowColor: '#4CAF50',
    },
    helpModalOptionButtonBlue: {
        borderLeftColor: '#2196F3',
        shadowColor: '#2196F3',
    },
    helpModalOptionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    helpModalOptionIconGreen: {
        backgroundColor: '#4CAF50',
    },
    helpModalOptionIconBlue: {
        backgroundColor: '#2196F3',
    },
    helpModalOptionContent: {
        flex: 1,
    },
    helpModalOptionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    helpModalOptionDescription: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
    helpModalContactContainer: {
        backgroundColor: '#e8f5e8',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    helpModalContactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    helpModalContactHeaderIcon: {
        marginRight: 8,
    },
    helpModalContactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2e7d32',
    },
    helpModalContactText: {
        fontSize: 14,
        color: '#388e3c',
        lineHeight: 20,
        marginBottom: 12,
    },
    helpModalContactEmail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpModalContactEmailIcon: {
        marginRight: 6,
    },
    helpModalContactEmailText: {
        fontSize: 13,
        color: '#2e7d32',
        fontWeight: '600',
    },
    helpModalCopyright: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    helpModalCopyrightTitle: {
        fontSize: 13,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },
    helpModalCopyrightSubtitle: {
        fontSize: 12,
        color: '#adb5bd',
        textAlign: 'center',
        marginTop: 4,
    },
    helpModalCloseButtonBottom: {
        backgroundColor: '#4CAF50',
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    helpModalCloseButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    // Estilos do Modal CPF
    cpfModalIcon: {
        marginBottom: 20,
    },
    cpfModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    cpfModalDescription: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
    },
    cpfModalInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    cpfModalButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    cpfModalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos do Header
    settingsButtonActive: {
        backgroundColor: '#FC7700',
    },
    settingsButtonInactive: {
        backgroundColor: '#4CAF50',
    },
    viewModeButton: {
        marginLeft: 8,
    },
    // Estilos do Modal de Créditos
    creditsModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    creditsModalContainer: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        elevation: 5,
    },
    creditsModalCloseButton: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    creditsModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    creditsModalBalance: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FC7700',
        textAlign: 'center',
        marginBottom: 24,
    },
    creditsModalLabel: {
        color: '#333',
        fontSize: 16,
        marginBottom: 8,
    },
    creditsModalValueButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    creditsModalValueText: {
        fontSize: 16,
    },
    creditsModalValueTextActive: {
        color: 'black',
        fontSize: 16,
    },
    creditsModalValueTextInactive: {
        color: 'gray',
        fontSize: 16,
    },
    creditsModalValuesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    creditsModalValueItem: {
        padding: 12,
    },
    creditsModalValueItemText: {
        color: 'black',
        fontSize: 16,
    },
    creditsModalHelpText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    creditsModalGenerateButton: {
        backgroundColor: '#FC7700',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    creditsModalGenerateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos do QR Code no modal de créditos
    creditsModalQrCodeContainer: {
        alignItems: 'center',
    },
    creditsModalQrCodeTitle: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FC7700',
    },
    creditsModalQrCodeImage: {
        width: 200,
        height: 200,
        marginBottom: 16,
        borderRadius: 8,
    },
    creditsModalQrCodeDescription: {
        marginBottom: 8,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    creditsModalQrCodeString: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        maxWidth: '100%',
    },
    creditsModalQrCodeText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'monospace',
    },
    creditsModalCopyButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 8,
    },
    creditsModalCopyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    creditsModalAmountText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    creditsModalCodeContainer: {
        marginBottom: 12,
        fontSize: 16,
        color: '#333',
    },
    creditsModalCodeText: {
        fontWeight: 'bold',
    },
    creditsModalSimpleCopyButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    creditsModalSimpleCopyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // Estilo da barra inferior
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    // Estilo do mapa
    mapContainer: {
        flex: 1,
    },
    
    // Estilos dos Modais de Chat, Corridas, Veículos, Configurações
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
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
    modalHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    modalHeaderIconOrange: {
        backgroundColor: '#FC7700',
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
        marginRight: 12
    },
    chatSendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5
    },
    
    // Rides Modal específico
    ridesStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20
    },
    ridesStatItem: {
        alignItems: 'center'
    },
    ridesStatNumberOrange: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FC7700'
    },
    ridesStatNumberGreen: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50'
    },
    ridesStatNumberBlue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3'
    },
    ridesStatLabel: {
        fontSize: 12,
        color: '#666'
    },
    ridesEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ridesEmptyIcon: {
        marginBottom: 16
    },
    ridesEmptyTitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8
    },
    ridesEmptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center'
    },
    ridesFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f8f8f8'
    },
    ridesFooterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        opacity: 0.5
    },
    ridesFooterButtonOrange: {
        backgroundColor: '#FC7700',
    },
    ridesFooterButtonGreen: {
        backgroundColor: '#4CAF50',
    },
    ridesFooterButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    
    // Available Rides Modal específico
    availableRidesHeader: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    availableRidesSearchStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20
    },
    availableRidesSearchStatusText: {
        fontSize: 16,
        color: '#2e7d2e',
        fontWeight: '500'
    },
    availableRidesEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    availableRidesEmptyIcon: {
        marginBottom: 16
    },
    availableRidesRefreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3
    },
    availableRidesRefreshIcon: {
        marginRight: 8
    },
    availableRidesRefreshText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    
    // Vehicles Modal específico
    vehiclesAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 3
    },
    vehiclesAddIcon: {
        marginRight: 12
    },
    vehiclesAddText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    },
    vehiclesEmptyIcon: {
        marginBottom: 16
    },
    vehicleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    vehicleItemIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FC7700',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
    },
    vehicleItemInfo: {
        flex: 1
    },
    vehicleItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    vehicleItemSubtitle: {
        fontSize: 14,
        color: '#666'
    },
    vehicleItemStatus: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2
    },
    vehicleItemButton: {
        padding: 8
    },
    
    // Estilos dos botões de filtro no modal de corridas disponíveis
    availableRidesFilterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        opacity: 0.5
    },
    availableRidesFilterButtonBlue: {
        backgroundColor: '#2196F3',
    },
    availableRidesFilterButtonOrange: {
        backgroundColor: '#FF9800',
    },
    
    // Status de busca específico
    availableRidesStatusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        marginRight: 12
    },
    
    // Botão de atualizar no modal de corridas disponíveis (estilo alternativo)
    availableRidesUpdateButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    
    // Estilos específicos para modal de veículos
    modalHeaderIconPurple: {
        backgroundColor: '#9C27B0',
    },
    
    // Estilos dos modais com estilo genérico
    genericModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    
    // Map View inline
    mapView: {
        width: '100%',
        height: '100%'
    },
    
    // Container de zoom do mapa
    mapZoomContainer: {
        position: 'absolute',
        right: 16,
        bottom: 80,
        flexDirection: 'column',
        gap: 12
    },
    
    // Botão de zoom
    mapZoomButton: {
        backgroundColor: '#FC7700',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginBottom: 8
    },
    
    // Botões do canto superior direito do mapa
    mapTopRightContainer: {
        position: 'absolute',
        right: 16,
        top: 16,
        flexDirection: 'column',
        gap: 12
    },
    
    // Container quando tracking está desligado
    trackingOffContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    trackingOffIcon: {
        marginRight: 10,
    },
    trackingOffText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    
    // Estilos para modal de configurações e outros modais
    settingsScrollView: {
        flex: 1,
    },
    settingsContentContainer: {
        paddingVertical: 10,
        paddingBottom: 20,
    },
    settingsSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    settingsSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingsItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingsItemContent: {
        flex: 1,
    },
    settingsItemTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingsItemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    
    // Comentário exemplo de veículo (para referência futura)
    vehicleExampleContainer: {
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    vehicleExampleIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#9C27B0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
    },
    vehicleExampleInfo: {
        flex: 1
    },
    vehicleExampleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    vehicleExampleSubtitle: {
        fontSize: 14,
        color: '#666'
    },
    vehicleExampleStatus: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2
    },
    vehicleExampleButton: {
        padding: 8
    },
    
    // Estilos do Modal de Documentos
    documentsModalCloseButton: {
        backgroundColor: '#2196F3',
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    documentsModalCloseButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    documentsModalProfileCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1.5,
        borderColor: '#e8f5e8',
    },
    documentsModalProfileCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    documentsModalProfileCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    documentsModalProfileCardContent: {
        flex: 1,
    },
    documentsModalProfileCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    documentsModalProfileCardSubtitle: {
        fontSize: 13,
        color: '#4caf50',
        fontWeight: '500',
    },
    documentsModalProfileCardBadge: {
        backgroundColor: '#e8f5e8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4caf50',
        marginTop: 6,
    },
    documentsModalProfileCardBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2e7d2e',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    documentsModalSecurityCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1.5,
        borderColor: '#e8f5e8',
    },
    documentsModalInfoCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    documentsModalInfoCardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    documentsModalInfoCardIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    documentsModalInfoCardContent: {
        flex: 1,
    },
    documentsModalInfoCardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#343a40',
        marginBottom: 8,
    },
    documentsModalInfoCardText: {
        fontSize: 13,
        color: '#6c757d',
        lineHeight: 18,
        marginBottom: 12,
    },
    documentsModalCopyright: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    documentsModalCopyrightMainText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },
    documentsModalCopyrightSubText: {
        fontSize: 11,
        color: '#adb5bd',
        textAlign: 'center',
        marginTop: 2,
    },
    // Estilos para modal de configurações
    settingsModalHeaderIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsModalHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FC7700',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingsModalHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    settingsModalHeaderSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    settingsModalCloseButton: {
        padding: 5,
    },
    settingsModalScrollView: {
        flex: 1,
    },
    settingsModalScrollViewContent: {
        paddingVertical: 10,
        paddingBottom: 20,
    },
    settingsModalSectionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    settingsModalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    settingsModalMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    settingsModalMenuIconProfile: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconDocuments: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconMap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconPrivacy: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#9C27B0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconHelp: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconAbout: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#607D8B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuIconLogout: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f44336',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsModalMenuContent: {
        flex: 1,
    },
    settingsModalMenuTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingsModalMenuSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    settingsModalMenuTitleLogout: {
        fontSize: 16,
        color: '#f44336',
        fontWeight: '500',
    },
    settingsModalSeparator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    settingsModalSpacer: {
        flex: 1,
    },
    
    // Estilos do Modal de Documentos
    documentsModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    documentsModalContainer: {
        width: '96%',
        maxWidth: 450,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 0,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        overflow: 'hidden',
    },
    documentsModalHeader: {
        backgroundColor: '#2196F3',
        paddingTop: 40,
        paddingHorizontal: 32,
        paddingBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    documentsModalHeaderCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    documentsModalHeaderIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    documentsModalHeaderTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    documentsModalHeaderSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    documentsModalContent: {
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    documentsModalStatusContainer: {
        backgroundColor: '#e8f5e8',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#4caf50',
    },
    documentsModalStatusIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    documentsModalStatusContent: {
        flex: 1,
    },
    documentsModalStatusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2e7d2e',
        marginBottom: 4,
    },
    documentsModalStatusSubtitle: {
        fontSize: 14,
        color: '#4caf50',
        fontWeight: '500',
    },
    documentsModalListContainer: {
        marginBottom: 16,
    },
    documentsModalListTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
        textAlign: 'center',
    },
    documentsModalDocumentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1.5,
        borderColor: '#e8f5e8',
    },
    documentsModalDocumentCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    documentsModalDocumentCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    documentsModalDocumentCardContent: {
        flex: 1,
    },
    documentsModalDocumentCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    documentsModalDocumentCardSubtitle: {
        fontSize: 13,
        color: '#4caf50',
        fontWeight: '500',
    },
    documentsModalDocumentCardBadge: {
        backgroundColor: '#e8f5e8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4caf50',
        marginTop: 6,
    },
    documentsModalDocumentCardBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2e7d2e',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    
    // Estilos do Modal de Privacidade
    privacyModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    privacyModalContainer: {
        width: '96%',
        maxWidth: 450,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 0,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        overflow: 'hidden',
    },
    privacyModalHeader: {
        backgroundColor: '#9C27B0',
        paddingTop: 40,
        paddingHorizontal: 32,
        paddingBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    privacyModalHeaderCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    privacyModalHeaderIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    privacyModalHeaderTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 6,
    },
    privacyModalHeaderSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    privacyModalContent: {
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    privacyModalIntroContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    privacyModalIntroText: {
        fontSize: 15,
        color: '#495057',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    privacyModalSecurityBadge: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    privacyModalSecurityBadgeText: {
        fontSize: 13,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },
    privacyModalSettingsContainer: {
        marginBottom: 24,
    },
    privacyModalSettingsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
        textAlign: 'center',
    },
    privacyModalSettingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderLeftWidth: 4,
    },
    privacyModalSettingCardLocation: {
        shadowColor: '#9C27B0',
        borderLeftColor: '#9C27B0',
    },
    privacyModalSettingCardPersonal: {
        shadowColor: '#FF5722',
        borderLeftColor: '#FF5722',
    },
    privacyModalSettingCardHistory: {
        shadowColor: '#2196F3',
        borderLeftColor: '#2196F3',
    },
    privacyModalSettingCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privacyModalSettingCardIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    privacyModalSettingCardIconLocation: {
        backgroundColor: '#9C27B0',
    },
    privacyModalSettingCardIconPersonal: {
        backgroundColor: '#FF5722',
    },
    privacyModalSettingCardIconHistory: {
        backgroundColor: '#2196F3',
    },
    privacyModalSettingCardContent: {
        flex: 1,
    },
    privacyModalSettingCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    privacyModalSettingCardSubtitle: {
        fontSize: 12,
        color: '#6c757d',
    },
    privacyModalSettingCardBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    privacyModalSettingCardBadgeActive: {
        backgroundColor: '#4CAF50',
    },
    privacyModalSettingCardBadgeProtected: {
        backgroundColor: '#4CAF50',
    },
    privacyModalSettingCardBadgeLimited: {
        backgroundColor: '#FF9800',
    },
    privacyModalSettingCardBadgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    privacyModalRightsContainer: {
        marginBottom: 24,
    },
    privacyModalRightsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
        textAlign: 'center',
    },
    privacyModalRightsCard: {
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    privacyModalRightsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    privacyModalRightsItemLast: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privacyModalRightsItemText: {
        fontSize: 14,
        color: '#1565c0',
        fontWeight: '600',
        flex: 1,
    },
    privacyModalContactCard: {
        backgroundColor: '#f3e5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ce93d8',
    },
    privacyModalContactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    privacyModalContactTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#7b1fa2',
    },
    privacyModalContactText: {
        fontSize: 13,
        color: '#8e24aa',
        lineHeight: 18,
        marginBottom: 8,
    },
    privacyModalContactEmail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privacyModalContactEmailText: {
        fontSize: 12,
        color: '#7b1fa2',
        fontWeight: '600',
    },
    privacyModalCopyright: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    privacyModalCopyrightTitle: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },
    privacyModalCopyrightSubtitle: {
        fontSize: 11,
        color: '#adb5bd',
        textAlign: 'center',
        marginTop: 2,
    },
    privacyModalCloseButton: {
        backgroundColor: '#9C27B0',
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#9C27B0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    privacyModalCloseButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    
    // Estilos do Modal "Sobre" (About Modal)
    aboutModalScrollView: {
        flex: 1,
    },
    aboutModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    aboutModalContainer: {
        width: '92%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 0,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 25,
        overflow: 'hidden',
    },
    aboutModalHeader: {
        backgroundColor: '#FC7700',
        paddingTop: 40,
        paddingHorizontal: 32,
        paddingBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    aboutModalHeaderCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    aboutModalHeaderIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    aboutModalHeaderTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    aboutModalHeaderSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    aboutModalContent: {
        paddingHorizontal: 32,
        paddingVertical: 32,
    },
    aboutModalVersionContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    aboutModalVersionBadge: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 24,
    },
    aboutModalVersionText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FC7700',
        textAlign: 'center',
    },
    aboutModalDescription: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    aboutModalFeaturesContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    aboutModalFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aboutModalFeatureItemLast: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aboutModalFeatureIcon: {
        marginRight: 10,
    },
    aboutModalFeatureText: {
        fontSize: 15,
        color: '#495057',
        fontWeight: '500',
    },
    aboutModalCopyright: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    aboutModalCopyrightTitle: {
        fontSize: 13,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },
    aboutModalCopyrightSubtitle: {
        fontSize: 12,
        color: '#adb5bd',
        textAlign: 'center',
        marginTop: 4,
    },
    aboutModalCloseButton: {
        backgroundColor: '#FC7700',
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    aboutModalCloseButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    
    // Estilos do Modal de Logout
    logoutModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoutModalContainer: {
        width: '90%',
        maxWidth: 350,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    logoutModalHeader: {
        alignItems: 'center',
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    logoutModalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF3E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#FF9800',
    },
    logoutModalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 12,
    },
    logoutModalDescription: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 12,
    },
    logoutModalButtonsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    logoutModalCancelButton: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#f0f0f0',
    },
    logoutModalCancelButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#666666',
    },
    logoutModalConfirmButton: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#FF5722',
        borderBottomRightRadius: 24,
    },
    logoutModalConfirmButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    
    // Estilos dos Botões Flutuantes do Mapa
    mapFloatingButtonsContainer: {
        position: 'absolute',
        right: 16,
        bottom: 250,
        flexDirection: 'column',
        gap: 12,
    },
    mapZoomInButton: {
        backgroundColor: '#FC7700',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginBottom: 8,
    },
    mapZoomOutButton: {
        backgroundColor: '#FC7700',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
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
    mapRidesButton: {
        backgroundColor: '#2196F3',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginTop: 8,
    },
    mapAvailableRidesButton: {
        backgroundColor: '#FF9800',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginTop: 8,
    },
    mapBalanceRequestsButton: {
        backgroundColor: '#8E24AA',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        marginTop: 8,
    },
    
    // Botão de Veículos (lado esquerdo)
    mapVehiclesButtonContainer: {
        position: 'absolute',
        left: 16,
        top: 16,
        flexDirection: 'column',
        gap: 12,
    },
    mapVehiclesButton: {
        backgroundColor: '#9C27B0',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    
    // Botão de Localização (canto superior direito)
    mapLocationButtonContainer: {
        position: 'absolute',
        right: 16,
        top: 16,
        flexDirection: 'column',
        gap: 12,
    },
    mapLocationButton: {
        backgroundColor: '#FC7700',
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    
    // Botão de Tracking (quando está desligado)
    mapTrackingOffContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapTrackingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        width: 250,
        height: 70,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    mapTrackingButtonIcon: {
        marginRight: 10,
    },
    mapTrackingButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    
    // Estilo do MapView
    mapViewStyle: {
        width: '100%',
        height: '100%',
    },
    
    // Estilo do Marker (ícone do carro)
    mapMarkerContainer: {
        backgroundColor: '#FC7700',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        overflow: 'hidden',
    },
    
    // Estilos do Modal de Solicitações de Saldo
    balanceRequestsModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    balanceRequestsModalContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    balanceRequestsModalHeader: {
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
    balanceRequestsModalHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceRequestsModalHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8E24AA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    balanceRequestsModalHeaderTextContainer: {
        // Sem estilos específicos, apenas container
    },
    balanceRequestsModalHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    balanceRequestsModalHeaderSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    balanceRequestsModalCloseButton: {
        padding: 5,
    },
    balanceRequestsModalList: {
        flex: 1,
        paddingVertical: 10,
    },
    balanceRequestsModalNewRequestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E24AA',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
    },
    balanceRequestsModalNewRequestIcon: {
        marginRight: 12,
    },
    balanceRequestsModalNewRequestText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    balanceRequestsModalListContainer: {
        paddingHorizontal: 16,
    },
    balanceRequestsModalListTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    balanceRequestsModalRequestCardPending: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceRequestsModalRequestCardApproved: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceRequestsModalRequestCardRejected: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceRequestsModalRequestIconPending: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f39c12',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    balanceRequestsModalRequestIconApproved: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    balanceRequestsModalRequestIconRejected: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f44336',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    balanceRequestsModalRequestContent: {
        flex: 1,
    },
    balanceRequestsModalRequestAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    balanceRequestsModalRequestDate: {
        fontSize: 14,
        color: '#666',
    },
    balanceRequestsModalRequestStatusPending: {
        fontSize: 12,
        color: '#f39c12',
        fontWeight: '600',
    },
    balanceRequestsModalRequestStatusApproved: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
    },
    balanceRequestsModalRequestStatusRejected: {
        fontSize: 12,
        color: '#f44336',
        fontWeight: '600',
    },
    balanceRequestsModalRequestActionButton: {
        padding: 8,
    },
    balanceRequestsModalSpacer: {
        flex: 1,
    },
    balanceRequestsModalInfoCard: {
        backgroundColor: '#e3f2fd',
        borderColor: '#bbdefb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        margin: 16,
        alignItems: 'center',
    },
    balanceRequestsModalInfoIcon: {
        marginBottom: 4,
    },
    balanceRequestsModalInfoText: {
        color: '#1976D2',
        textAlign: 'center',
        fontSize: 14,
    },
    balanceRequestsModalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f8f8f8',
    },
    balanceRequestsModalFooterButtonHistory: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        opacity: 0.5,
    },
    balanceRequestsModalFooterButtonLimits: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        opacity: 0.5,
    },
    balanceRequestsModalFooterButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    recenterButtonContainer: {
        position: 'absolute',
        bottom: 200,
        alignSelf: 'center',
        zIndex: 1000,
    },
    recenterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FC7700',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 8,
    },
    recenterButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // MODAL DE INICIALIZAÇÃO - TEMPORIZADOR DE 6 SEGUNDOS
    startupModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    startupModalContainer: {
        backgroundColor: '#4CAF50',
        paddingVertical: 40,
        paddingHorizontal: 60,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    startupModalIcon: {
        marginBottom: 20,
    },
    startupModalTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    startupModalTimer: {
        color: '#fff',
        fontSize: 72,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    startupModalSubtitle: {
        color: '#fff',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
        opacity: 0.9,
    },
    // MODAL DE PAUSA - TEMPORIZADOR DE 10 SEGUNDOS
    pauseModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    pauseModalContainer: {
        backgroundColor: '#FC7700',
        paddingVertical: 40,
        paddingHorizontal: 60,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    pauseModalIcon: {
        marginBottom: 20,
    },
    pauseModalTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    pauseModalTimer: {
        color: '#fff',
        fontSize: 72,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    pauseModalSubtitle: {
        color: '#fff',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
        opacity: 0.9,
    },
    // TEMPORIZADOR DE 5 MINUTOS
    mainTimerContainer: {
        backgroundColor: 'rgba(252, 119, 0, 0.95)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    mainTimerIcon: {
        marginRight: 8,
    },
    mainTimerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
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
        top: 128,
        left: 5,
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
        top: 132,
        left: 10,
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
});

export default styles;