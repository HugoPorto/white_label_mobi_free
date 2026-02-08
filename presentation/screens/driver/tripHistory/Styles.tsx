import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    
    // Header Styles
    headerContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666'
    },

    // Filter Bar Styles
    filterRow: {
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10
    },
    activeFilterChip: {
        backgroundColor: '#FC7700',
        borderColor: '#FC7700'
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666'
    },
    activeFilterChipText: {
        color: '#FFF'
    },

    // Loading Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16
    },

    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyIconContainer: {
        marginBottom: 24
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center'
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24
    },

    // Bottom Bar
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },

    // Pagination Styles
    loadingMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 8
    },
    loadingMoreText: {
        fontSize: 14,
        color: '#FC7700',
        fontWeight: '500'
    },
    endMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 8
    },
    endMessageText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500'
    },
    itemContainer: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: 'hidden',
        paddingVertical: 20,
        paddingHorizontal: 16
    },

    // Trip Code Badge
    tripCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFF8F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FC7700',
        gap: 6
    },
    tripCodeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FC7700',
        letterSpacing: 0.5
    },
    
    // Header Section
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#fff'
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
        borderColor: '#fff'
    },
    clientDetails: {
        flex: 1
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        fontWeight: '600'
    },
    fareContainer: {
        alignItems: 'flex-end'
    },
    fareLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2
    },
    fareValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50'
    },

    // Schedule Section
    scheduleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FC7700'
    },
    scheduleInfo: {
        flex: 1,
        marginLeft: 12
    },
    scheduleLabel: {
        fontSize: 11,
        color: '#999',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2
    },
    scheduleDateTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FC7700'
    },
    toleranceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    toleranceText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        marginLeft: 4
    },

    // Vehicle Type Section
    vehicleTypeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 12,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    vehicleTypeText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },

    // Trip Section
    tripSection: {
        marginVertical: 16
    },
    routeContainer: {
        paddingLeft: 8
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    pickupDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        marginRight: 12,
        marginTop: 4
    },
    destinationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#f44336',
        marginRight: 12,
        marginTop: 4
    },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginLeft: 5,
        marginVertical: 4
    },
    locationInfo: {
        flex: 1
    },
    locationLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 2
    },
    locationText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        lineHeight: 20
    },
    locationNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
        lineHeight: 16
    },

    // Actions Container
    // actionsContainer: {
    //     flexDirection: 'row',
    //     gap: 12,
    //     marginTop: 16
    // },
    // cancelButton: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#f44336',
    //     borderRadius: 12,
    //     paddingVertical: 14,
    //     paddingHorizontal: 16,
    //     gap: 8,
    //     elevation: 2,
    //     shadowColor: '#f44336',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.3,
    //     shadowRadius: 4
    // },
    // cancelButtonText: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: '#fff',
    //     letterSpacing: 0.5
    // },
    // travelButton: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#4CAF50',
    //     borderRadius: 12,
    //     paddingVertical: 14,
    //     paddingHorizontal: 16,
    //     gap: 8,
    //     elevation: 2,
    //     shadowColor: '#4CAF50',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.3,
    //     shadowRadius: 4
    // },
    // travelButtonText: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: '#fff',
    //     letterSpacing: 0.5
    // },

    // Stats Section
    statsSection: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginVertical: 16
    },
    statItem: {
        flex: 1,
        alignItems: 'center'
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 4
    },
    statLabel: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center'
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 8
    },

    // Action Indicator
    actionIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8
    },
    actionText: {
        fontSize: 14,
        color: '#FC7700',
        fontWeight: '500',
        marginRight: 4
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 8,
        width: '100%',
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10
    },
    modalHeader: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginBottom: 16
    },
    modalTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    modalCloseButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36
    },
    modalBody: {
        padding: 20
    },
    tripPreview: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24
    },
    previewRoute: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    previewText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1
    },
    offerInputContainer: {
        marginBottom: 24
    },
    offerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12
    },
    offerInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: 'transparent'
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginRight: 8
    },
    offerInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    offerHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 8
    },
    submitOfferButton: {
        backgroundColor: '#FC7700',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitOfferText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },

    // Legacy styles (mantidos para compatibilidade)
    mainInfoContainer: {
        flexDirection: 'row'
    },
    mainTextContainer: {
        width: '85%',
    },
    textMainInfo: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    imageClient: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    textDataTrip: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
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
     // Actions Container
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 8
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    actionButtonCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    cancelButtonCircle: {
        backgroundColor: '#f44336'
    },
    finishButtonCircle: {
        backgroundColor: '#4CAF50'
    },
    chatButtonCircle: {
        backgroundColor: '#2196F3'
    },
    locationButtonCircle: {
        backgroundColor: '#FF9800'
    },
    travelButtonCircle: {
        backgroundColor: '#4CAF50'
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center'
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f44336',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 8,
        elevation: 2,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5
    },
    travelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 8,
        elevation: 2,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    travelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5
    },

    // Report Modal Styles
    reportInputContainer: {
        marginBottom: 24
    },
    reportLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12
    },
    reportInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#1a1a1a',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        minHeight: 150,
        maxHeight: 200
    },
    reportHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
        textAlign: 'right'
    },
    submitReportButton: {
        backgroundColor: '#FF5722',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 2,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    submitReportButtonDisabled: {
        backgroundColor: '#ccc',
        elevation: 0,
        shadowOpacity: 0
    },
    submitReportText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },

    // Rating Modal Styles
    ratingInputContainer: {
        marginBottom: 24,
        alignItems: 'center'
    },
    ratingPromptText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20
    },
    starButton: {
        padding: 4
    },
    ratingFeedbackText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 12
    },
    submitRatingButton: {
        backgroundColor: '#FFB800',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 2,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    submitRatingButtonDisabled: {
        backgroundColor: '#ccc',
        elevation: 0,
        shadowOpacity: 0
    },
    submitRatingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
});

export default styles;