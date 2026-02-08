import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modernContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContainer: {
        paddingBottom: 120,
        paddingTop: 20,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    successIconBackground: {
        backgroundColor: '#E8F5E8',
        borderRadius: 50,
        padding: 20,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    modernTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    routeContainer: {
        marginBottom: 20,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    fromDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF6B35',
        marginTop: 8,
        marginRight: 16,
    },
    toDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        marginTop: 8,
        marginRight: 16,
    },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: '#E0E0E0',
        marginLeft: 5,
        marginVertical: 8,
    },
    routeInfo: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    routeText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
    },
    earningsContainer: {
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    earningsLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    earningsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    ratingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 40,
    },
    ratingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    ratingSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    modernStarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modernStarButton: {
        padding: 5,
        marginHorizontal: 4,
        borderRadius: 25,
        backgroundColor: 'transparent',
    },
    selectedStar: {
        backgroundColor: '#FFF3CD',
        transform: [{ scale: 1.1 }],
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginTop: 10,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 65,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonActive: {
        backgroundColor: '#FF6B35',
    },
    submitButtonInactive: {
        backgroundColor: '#CCCCCC',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    buttonIcon: {
        marginRight: 4,
    },
    // Manter estilos antigos para compatibilidade
    rowContainer: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginBottom: 40
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
    iconCheck: {
        alignSelf: 'center',
        marginTop: 15
    },
    textTripFinished: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10
    },
    textDescription: {
        marginLeft: 10
    },
    bold: {
        fontWeight: 'bold',
    },
    textFare: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 50
    },
    textFareValue: {
        alignSelf: 'center',
        color: 'green',
        fontSize: 25,
        fontWeight: 'bold'
    },
    textRating: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    starRating: {
        alignSelf: 'center',
        marginTop: 5
    },
    starContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    starButton: {
        marginHorizontal: 5,
        padding: 5
    }
});

export default styles;