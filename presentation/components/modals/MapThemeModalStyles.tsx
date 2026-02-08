import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
    },
    themesContainer: {
        marginBottom: 20,
    },
    themeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    themeButtonActive: {
        backgroundColor: '#fff8f0',
        borderWidth: 2,
        borderColor: '#FF9800',
    },
    themeButtonInactive: {
        backgroundColor: '#f8f8f8',
        borderColor: '#e0e0e0',
    },
    themeButtonActiveDark: {
        backgroundColor: '#f0f0f8',
        borderWidth: 2,
        borderColor: '#424242',
    },
    themeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    themeIconOrange: {
        backgroundColor: '#FF9800',
    },
    themeIconDark: {
        backgroundColor: '#424242',
    },
    themeTextContainer: {
        flex: 1,
    },
    themeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    themeDescription: {
        fontSize: 14,
        color: '#666',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
});

export default styles;
