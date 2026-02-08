import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    statusBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },

    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },

    contentContainer: {
        padding: 16,
        gap: 12,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },

    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        flex: 1,
    },

    notesContainer: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 12,
        borderRadius: 8,
        marginTop: 4,
    },

    notesText: {
        fontSize: 13,
        color: '#666',
        flex: 1,
        lineHeight: 18,
    },

    imagePreviewContainer: {
        padding: 16,
        paddingTop: 0,
    },

    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
});
