import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    // Container e Layout Base
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    bottomSpacer: {
        height: 60,
    },

    // Header
    headerContainer: {
        backgroundColor: '#2196F3',
        paddingTop: Platform.OS === 'ios' ? 0 : 16,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },

    // Filtros
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },

    // Barra de Pesquisa
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        padding: 0,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
    searchResultText: {
        fontSize: 13,
        color: '#666',
        marginTop: 8,
        marginLeft: 4,
    },

    // Cards de Chamados
    callCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    callCardActive: {
        borderColor: '#2196F3',
        borderWidth: 2,
        backgroundColor: '#F0F8FF',
    },
    callHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    callHeaderContent: {
        flex: 1,
    },
    callTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    callTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        flex: 1,
    },
    callDate: {
        fontSize: 12,
        color: '#757575',
    },
    callPreview: {
        fontSize: 14,
        color: '#616161',
        lineHeight: 20,
        marginBottom: 12,
    },
    callFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    callBadges: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewDetailsText: {
        fontSize: 13,
        color: '#2196F3',
        fontWeight: '600',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#424242',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    emptyAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#2196F3',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    emptyAddButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Paginação
    paginationContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    paginationInfo: {
        alignItems: 'center',
        marginBottom: 12,
    },
    paginationText: {
        fontSize: 13,
        color: '#666',
    },
    paginationControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        gap: 4,
    },
    paginationButtonDisabled: {
        opacity: 0.4,
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2196F3',
    },
    paginationButtonTextDisabled: {
        color: '#BDBDBD',
    },
    pageNumbers: {
        flexDirection: 'row',
        gap: 6,
    },
    pageNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    pageNumberActive: {
        backgroundColor: '#2196F3',
    },
    pageNumberText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    pageNumberTextActive: {
        color: '#FFFFFF',
    },
    pageEllipsis: {
        fontSize: 14,
        color: '#999',
        paddingHorizontal: 4,
        lineHeight: 32,
    },

    // Botão Flutuante (FAB)
    fabButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#2196F3',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },

    // Modal Base
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    modalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitleTextContainer: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#757575',
        marginTop: 2,
    },
    modalCloseButton: {
        padding: 4,
        marginLeft: 12,
    },

    // Badges do Modal
    modalBadgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    modalStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    modalStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    modalPriorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    modalPriorityText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Seções do Modal
    modalSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#424242',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    modalSectionContent: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    modalSectionText: {
        fontSize: 15,
        color: '#424242',
        lineHeight: 22,
    },

    // Resposta do Suporte
    responseContent: {
        backgroundColor: '#E3F2FD',
        borderColor: '#90CAF9',
    },
    responseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#90CAF9',
    },
    responseHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
        flex: 1,
    },
    responseDate: {
        fontSize: 12,
        color: '#64B5F6',
    },

    // Botões do Modal
    modalButtonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    modalCloseButtonFull: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#2196F3',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    modalCloseButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Formulário de Novo Chamado
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#424242',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },

    // Categoria
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    categoryButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    categoryButtonTextActive: {
        color: '#FFFFFF',
    },

    // Prioridade
    priorityContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    priorityButtonActive: {
        borderColor: 'transparent',
    },
    priorityButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    priorityButtonTextActive: {
        color: '#FFFFFF',
    },

    // Informação
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1976D2',
        lineHeight: 18,
    },

    // Botões do Formulário
    modalButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#2196F3',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    submitButtonDisabled: {
        backgroundColor: '#BDBDBD',
        ...Platform.select({
            ios: {
                shadowOpacity: 0,
            },
            android: {
                elevation: 0,
            },
        }),
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default styles;
