import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modernCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        marginBottom: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modernImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#E3F2FD',
    },
    clientDetails: {
        flex: 1,
    },
    clientLabel: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginTop: 2,
    },
    earningsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    earningsText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    routeContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    fromDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF6B35',
        marginTop: 6,
        marginRight: 12,
    },
    toDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginTop: 6,
        marginRight: 12,
    },
    routeLine: {
        width: 2,
        height: 16,
        backgroundColor: '#E0E0E0',
        marginLeft: 4,
        marginVertical: 8,
    },
    routeInfo: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    routeText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 18,
        marginBottom: 8,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
        marginLeft: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
    },

    container: {
        width: '100%',
        height: 270,
        backgroundColor: 'white',
        elevation: 2,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10
    },
    rowContainer: {
        flexDirection: 'row',
        marginRight: 30,
        marginLeft: 30,
        marginTop: 10,
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    infoContainer: {
        flex: 1
    },
    textDescription: {
        fontWeight: 'bold'
    },
    textValue: {
        color: 'gray',
        fontSize: 13
    }
});

export default styles;