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

export const orangeMapStyle = [
    // ---- TEXTO: deixar visível e escuro ----
    {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
            { visibility: "on" },
            { color: "#3a2a1a" } // texto escuro marrom profundo
        ]
    },
    {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
            { visibility: "on" },
            { color: "#ffffff" }, // leve borda clara p/ contraste
            { weight: 2 }
        ]
    },

    // ---- ADMINISTRATIVO ----
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ visibility: "off" }]
    },

    // ---- TERRAS / PAISAGEM ----
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5d9b3" }] // laranja claro mais suave
    },

    // ---- POIs (pontos de interesse) ----
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#f4cfa3" }]
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3a2a1a" }] // texto bem visível
    },

    // ---- RUAS ----
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#d8b084" }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4d3a22" }]
    },

    // ---- ÁGUA (AZUL CLARA) ----
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            { color: "#a8d6ff" } // azul claro suave e contrastante
        ]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
            { color: "#2f5f88" } // texto sobre água bem visível
        ]
    },

    // ---- TRANSPORTE ----
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ visibility: "off" }]
    }
];


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
    placeAutocomplete: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        zIndex: 1
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
        height: 60,
        backgroundColor: '#e0e0e0ff',
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: 20,
        marginBottom: -15
    },
    timeAndDistanceText: {
        color: 'black',
        fontSize: 15
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        height: '90%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    viewDecoration: {
        backgroundColor: '#FC7700',
        width: '100%',
        height: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    textDecoration: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    // Novos estilos profissionais
    bottomPanel: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    tripInfoSection: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 8,
        letterSpacing: 0.5,
        alignSelf: 'center',
    },
    // Containers com cores específicas - VERSÃO SOFISTICADA
    originContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8f0', // Fundo levemente laranja
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#ffe4cc',
    },
    destinationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff0f0', // Fundo levemente vermelho
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    offerContainerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fff8', // Fundo levemente verde
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#ccf2e0',
    },
    // Icon containers específicos com gradientes visuais
    originIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FC7700',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    destinationIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#e74c3c',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    offerIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#27ae60',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#8e44ad', // Roxo sofisticado
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    infoText: {
        fontSize: 13,
        color: '#2c3e50',
        fontWeight: '600',
        lineHeight: 18,
    },
    tripEstimateSection: {
        backgroundColor: '#f8faff', // Fundo levemente azul
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#e3f2fd',
        shadowColor: '#2196f3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    estimateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    estimateItem: {
        flex: 1,
        alignItems: 'center',
    },
    estimateDivider: {
        width: 1,
        height: 35,
        backgroundColor: '#dee2e6',
        marginHorizontal: 12,
    },
    estimateLabel: {
        fontSize: 11,
        color: '#6c757d',
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },
    estimateValue: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '700',
        marginTop: 2,
        textAlign: 'center',
    },
    // Estilos dos modais
    autocompleteContainer: {
        padding: 20,
        flex: 1,
    },
    autocompleteInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    autocompleteList: {
        borderWidth: 0,
        backgroundColor: '#fff',
    },
    offerContainer: {
        padding: 20,
        flex: 1,
    },
    offerDescription: {
        fontSize: 16,
        color: '#2c3e50',
        textAlign: 'justify',
        marginBottom: 16,
        lineHeight: 24,
    },
    recommendedPrice: {
        fontSize: 14,
        color: '#27ae60',
        textAlign: 'left',
        marginBottom: 20,
        fontWeight: '600',
    },
    confirmOfferButton: {
        backgroundColor: '#FC7700',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    confirmOfferText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos de loading
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    infoIcon: {
        marginRight: 10,
        width: 22,
        height: 22,
        resizeMode: 'contain',
        opacity: 0.7
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    result: {
        marginTop: 20,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
    },
    // Botão flutuante no topo
    floatingRequestButton: {
        position: 'absolute',
        top: 103,
        left: 15,
        right: 15,
        backgroundColor: '#FC7700',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 27,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        gap: 10,
        // borderWidth: 2,
        // borderColor: '#ffffff',
    },
    floatingRequestButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 0.5,
    },

    // Estilos para a barra de filtros de veículos
    vehicleFilterBar: {
        position: 'absolute',
        top: 34,
        left: 75,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 18,
        backgroundColor: 'transparent',
        gap: 6,
        minWidth: 80,
    },
    filterButtonActive: {
        backgroundColor: '#FC7700',
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Seletor de tipo de veículo (dentro do painel)
    vehicleTypeSelector: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleTypeSelectorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    vehicleTypeButtons: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    vehicleTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        gap: 8,
    },
    vehicleTypeButtonActive: {
        backgroundColor: '#FC7700',
        borderColor: '#FC7700',
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    vehicleTypeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    vehicleTypeButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    // ESTILOS DE INDICADORES DE CONEXÃO
    offlineBar: {
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        zIndex: 9999,
        elevation: 10,
    },
    offlineBarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    socketStatusIndicator: {
        position: 'absolute',
        top: 105,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        zIndex: 9998,
    },
    socketStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
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
});

export default styles;
