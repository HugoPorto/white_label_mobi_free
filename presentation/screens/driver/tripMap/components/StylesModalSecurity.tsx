import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20
    },
    inputContainer: {
        marginBottom: 24
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 8,
        borderWidth: 2,
        color: '#333'
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 8
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666'
    },
    verifyButton: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF'
    },
    verifyingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginRight: 8
    }
});

export default styles;