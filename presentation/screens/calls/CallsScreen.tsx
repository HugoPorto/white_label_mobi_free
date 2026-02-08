import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StatusBar,
    RefreshControl,
    Modal,
    ScrollView,
    SafeAreaView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';

// Interface para os chamados
interface SupportCall {
    id: number;
    title: string;
    description: string;
    response?: string;
    createdAt: Date;
    updatedAt?: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'technical' | 'payment' | 'account' | 'safety' | 'other';
}

export default function CallsScreen() {
    const [calls, setCalls] = useState<SupportCall[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<SupportCall[]>([]);
    const [paginatedCalls, setPaginatedCalls] = useState<SupportCall[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCall, setSelectedCall] = useState<SupportCall | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNewCallModalVisible, setIsNewCallModalVisible] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'open' | 'resolved'>('all');

    // Estados do formulário de novo chamado
    const [newCallForm, setNewCallForm] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
    });

    const itemsPerPage = 10;

    useFocusEffect(
        React.useCallback(() => {
            handleGetCalls();
        }, [])
    );

    const handleGetCalls = async () => {
        setLoading(true);
        try {
            // TODO: Substituir por chamada real à API
            // const response = await callsViewModel.getCallsByUserId(userId);
            
            // Dados mockados para demonstração
            const mockCalls: SupportCall[] = [
                {
                    id: 1,
                    title: 'Problema com pagamento',
                    description: 'Meu cartão foi recusado ao tentar fazer uma corrida. O saldo está disponível mas o pagamento não passa.',
                    response: 'Olá! Verificamos sua conta e o problema foi resolvido. Era uma questão temporária com o gateway de pagamento. Tente novamente.',
                    createdAt: new Date('2024-01-15T10:30:00'),
                    updatedAt: new Date('2024-01-15T14:20:00'),
                    status: 'resolved',
                    priority: 'high',
                    category: 'payment'
                },
                {
                    id: 2,
                    title: 'App travando ao iniciar corrida',
                    description: 'Quando tento aceitar uma corrida, o aplicativo trava e fecha sozinho. Já tentei reinstalar mas o problema continua.',
                    response: 'Estamos investigando este problema. Por favor, nos informe o modelo do seu celular e versão do sistema operacional.',
                    createdAt: new Date('2024-01-20T09:15:00'),
                    updatedAt: new Date('2024-01-20T11:30:00'),
                    status: 'in_progress',
                    priority: 'urgent',
                    category: 'technical'
                },
                {
                    id: 3,
                    title: 'Não consigo atualizar meus dados',
                    description: 'Tentei atualizar meu endereço mas o sistema não salva as alterações.',
                    createdAt: new Date('2024-01-22T14:45:00'),
                    status: 'open',
                    priority: 'medium',
                    category: 'account'
                },
                {
                    id: 4,
                    title: 'Motorista não seguiu a rota',
                    description: 'O motorista pegou um caminho totalmente diferente do que foi mostrado no app, aumentando o valor da corrida.',
                    response: 'Analisamos sua corrida e reembolsamos a diferença. O motorista foi notificado sobre o ocorrido.',
                    createdAt: new Date('2024-01-23T16:20:00'),
                    updatedAt: new Date('2024-01-24T10:00:00'),
                    status: 'resolved',
                    priority: 'high',
                    category: 'safety'
                },
                {
                    id: 5,
                    title: 'Dúvida sobre programa de fidelidade',
                    description: 'Como funciona o programa de pontos? Quantas corridas preciso fazer para ganhar um desconto?',
                    createdAt: new Date('2024-01-24T11:00:00'),
                    status: 'open',
                    priority: 'low',
                    category: 'other'
                }
            ];

            setCalls(mockCalls);
            setFilteredCalls(mockCalls);
            updatePagination(mockCalls, 1);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePagination = (callsList: SupportCall[], page: number = 1) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = callsList.slice(startIndex, endIndex);
        setPaginatedCalls(paginatedData);
        setCurrentPage(page);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        let filtered: SupportCall[];

        if (text.trim() === '') {
            filtered = applyFilter(calls);
        } else {
            filtered = calls.filter(call =>
                call.title.toLowerCase().includes(text.toLowerCase()) ||
                call.description.toLowerCase().includes(text.toLowerCase())
            );
            filtered = applyFilter(filtered);
        }

        setFilteredCalls(filtered);
        updatePagination(filtered, 1);
    };

    const applyFilter = (callsList: SupportCall[]) => {
        if (filterType === 'all') return callsList;
        if (filterType === 'open') return callsList.filter(call => call.status === 'open' || call.status === 'in_progress');
        if (filterType === 'resolved') return callsList.filter(call => call.status === 'resolved' || call.status === 'closed');
        return callsList;
    };

    const handleFilterChange = (type: 'all' | 'open' | 'resolved') => {
        setFilterType(type);
        const filtered = applyFilter(calls);
        setFilteredCalls(filtered);
        updatePagination(filtered, 1);
    };

    const handlePageChange = (page: number) => {
        updatePagination(filteredCalls, page);
    };

    const getTotalPages = () => {
        return Math.ceil(filteredCalls.length / itemsPerPage);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const oldPage = currentPage;
        await handleGetCalls();

        setTimeout(() => {
            const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
            if (oldPage <= totalPages && oldPage > 1) {
                handlePageChange(oldPage);
            }
        }, 100);

        setRefreshing(false);
    };

    const handleCallPress = (call: SupportCall) => {
        setSelectedCall(call);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCall(null);
    };

    const openNewCallModal = () => {
        setIsNewCallModalVisible(true);
    };

    const closeNewCallModal = () => {
        setIsNewCallModalVisible(false);
        setNewCallForm({
            title: '',
            description: '',
            category: '',
            priority: 'medium'
        });
    };

    const handleSubmitNewCall = async () => {
        if (!newCallForm.title.trim() || !newCallForm.description.trim() || !newCallForm.category) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            // TODO: Substituir por chamada real à API
            // await callsViewModel.createCall(newCallForm);
            
            Alert.alert('Sucesso', 'Seu chamado foi aberto com sucesso! Nossa equipe entrará em contato em breve.', [
                {
                    text: 'OK',
                    onPress: () => {
                        closeNewCallModal();
                        handleGetCalls();
                    }
                }
            ]);
        } catch (error) {
            console.error('Erro ao criar chamado:', error);
            Alert.alert('Erro', 'Não foi possível criar o chamado. Tente novamente.');
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'open': return { text: 'Aberto', color: '#2196F3', icon: 'radio-button-on' as const };
            case 'in_progress': return { text: 'Em Andamento', color: '#FF9800', icon: 'sync' as const };
            case 'resolved': return { text: 'Resolvido', color: '#4CAF50', icon: 'checkmark-circle' as const };
            case 'closed': return { text: 'Fechado', color: '#757575', icon: 'close-circle' as const };
            default: return { text: 'Desconhecido', color: '#757575', icon: 'help-circle' as const };
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'technical': return 'construct' as const;
            case 'payment': return 'card' as const;
            case 'account': return 'person' as const;
            case 'safety': return 'shield-checkmark' as const;
            case 'other': return 'help-circle' as const;
            default: return 'chatbubble-ellipses' as const;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'technical': return '#2196F3';
            case 'payment': return '#4CAF50';
            case 'account': return '#9C27B0';
            case 'safety': return '#F44336';
            case 'other': return '#757575';
            default: return '#607D8B';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'urgent': return { text: 'Urgente', color: '#D32F2F' };
            case 'high': return { text: 'Alta', color: '#F44336' };
            case 'medium': return { text: 'Média', color: '#FF9800' };
            case 'low': return { text: 'Baixa', color: '#4CAF50' };
            default: return { text: 'Normal', color: '#757575' };
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Hoje às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Ontem às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return `${diffDays} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    };

    const openCount = calls.filter(call => call.status === 'open' || call.status === 'in_progress').length;
    const resolvedCount = calls.filter(call => call.status === 'resolved' || call.status === 'closed').length;

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="headset" size={28} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Suporte</Text>
                        <Text style={styles.headerSubtitle}>
                            {openCount > 0 
                                ? `${openCount} chamado${openCount > 1 ? 's' : ''} aberto${openCount > 1 ? 's' : ''}`
                                : 'Nenhum chamado aberto'
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderCallItem = ({ item }: { item: SupportCall }) => {
        const categoryColor = getCategoryColor(item.category);
        const priorityBadge = getPriorityBadge(item.priority);
        const statusInfo = getStatusInfo(item.status);

        return (
            <TouchableOpacity
                style={[
                    styles.callCard,
                    (item.status === 'open' || item.status === 'in_progress') && styles.callCardActive
                ]}
                onPress={() => handleCallPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.callHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
                        <Ionicons name={getCategoryIcon(item.category)} size={24} color={categoryColor} />
                    </View>
                    <View style={styles.callHeaderContent}>
                        <View style={styles.callTitleRow}>
                            <Text style={styles.callTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </View>
                        <Text style={styles.callDate}>{formatDate(item.createdAt)}</Text>
                    </View>
                </View>

                <Text style={styles.callPreview} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.callFooter}>
                    <View style={styles.callBadges}>
                        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
                            <Ionicons name={statusInfo.icon} size={12} color={statusInfo.color} />
                            <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.text}
                            </Text>
                        </View>
                        <View style={[styles.priorityBadge, { backgroundColor: priorityBadge.color + '15' }]}>
                            <Text style={[styles.priorityText, { color: priorityBadge.color }]}>
                                {priorityBadge.text}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>Ver detalhes</Text>
                        <Ionicons name="chevron-forward" size={16} color="#2196F3" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color="#9E9E9E" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum chamado encontrado</Text>
            <Text style={styles.emptySubtitle}>
                Você ainda não abriu nenhum chamado de suporte
            </Text>
            <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={openNewCallModal}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.emptyAddButtonText}>Abrir Chamado</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

            {renderHeader()}

            {/* Filtros */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
                    onPress={() => handleFilterChange('all')}
                >
                    <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
                        Todos ({calls.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filterType === 'open' && styles.filterButtonActive]}
                    onPress={() => handleFilterChange('open')}
                >
                    <Text style={[styles.filterButtonText, filterType === 'open' && styles.filterButtonTextActive]}>
                        Abertos ({openCount})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filterType === 'resolved' && styles.filterButtonActive]}
                    onPress={() => handleFilterChange('resolved')}
                >
                    <Text style={[styles.filterButtonText, filterType === 'resolved' && styles.filterButtonTextActive]}>
                        Resolvidos ({resolvedCount})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar chamados..."
                        value={searchText}
                        onChangeText={handleSearch}
                        placeholderTextColor="#999"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => handleSearch('')}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                {searchText.length > 0 && (
                    <Text style={styles.searchResultText}>
                        {filteredCalls.length} resultado{filteredCalls.length !== 1 ? 's' : ''} encontrado{filteredCalls.length !== 1 ? 's' : ''}
                    </Text>
                )}
            </View>

            <View style={styles.contentContainer}>
                <FlatList
                    data={paginatedCalls}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCallItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2196F3']}
                            tintColor="#2196F3"
                        />
                    }
                />

                {/* Componente de Paginação */}
                {filteredCalls.length > itemsPerPage && (
                    <View style={styles.paginationContainer}>
                        <View style={styles.paginationInfo}>
                            <Text style={styles.paginationText}>
                                Página {currentPage} de {getTotalPages()} • {filteredCalls.length} chamados total
                            </Text>
                        </View>

                        <View style={styles.paginationControls}>
                            <TouchableOpacity
                                style={[
                                    styles.paginationButton,
                                    currentPage === 1 && styles.paginationButtonDisabled
                                ]}
                                onPress={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={20}
                                    color={currentPage === 1 ? '#BDBDBD' : '#2196F3'}
                                />
                                <Text style={[
                                    styles.paginationButtonText,
                                    currentPage === 1 && styles.paginationButtonTextDisabled
                                ]}>
                                    Anterior
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.pageNumbers}>
                                {Array.from({ length: getTotalPages() }, (_, index) => {
                                    const pageNumber = index + 1;
                                    const isCurrentPage = pageNumber === currentPage;

                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === getTotalPages() ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[
                                                    styles.pageNumber,
                                                    isCurrentPage && styles.pageNumberActive
                                                ]}
                                                onPress={() => handlePageChange(pageNumber)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[
                                                    styles.pageNumberText,
                                                    isCurrentPage && styles.pageNumberTextActive
                                                ]}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return <Text key={pageNumber} style={styles.pageEllipsis}>...</Text>;
                                    }
                                    return null;
                                })}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.paginationButton,
                                    currentPage === getTotalPages() && styles.paginationButtonDisabled
                                ]}
                                onPress={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === getTotalPages()}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.paginationButtonText,
                                    currentPage === getTotalPages() && styles.paginationButtonTextDisabled
                                ]}>
                                    Próxima
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={currentPage === getTotalPages() ? '#BDBDBD' : '#2196F3'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Botão Flutuante para Novo Chamado */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={openNewCallModal}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Modal de Detalhes do Chamado */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedCall && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Header do Modal */}
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalTitleContainer}>
                                        <View style={[
                                            styles.modalIconContainer,
                                            { backgroundColor: getCategoryColor(selectedCall.category) }
                                        ]}>
                                            <Ionicons
                                                name={getCategoryIcon(selectedCall.category)}
                                                size={24}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                        <View style={styles.modalTitleTextContainer}>
                                            <Text style={styles.modalTitle}>{selectedCall.title}</Text>
                                            <Text style={styles.modalSubtitle}>
                                                Aberto em {formatDate(selectedCall.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        style={styles.modalCloseButton}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                {/* Badges */}
                                <View style={styles.modalBadgesContainer}>
                                    <View style={[
                                        styles.modalStatusBadge,
                                        { backgroundColor: getStatusInfo(selectedCall.status).color + '15' }
                                    ]}>
                                        <Ionicons 
                                            name={getStatusInfo(selectedCall.status).icon} 
                                            size={14} 
                                            color={getStatusInfo(selectedCall.status).color} 
                                        />
                                        <Text style={[
                                            styles.modalStatusText,
                                            { color: getStatusInfo(selectedCall.status).color }
                                        ]}>
                                            {getStatusInfo(selectedCall.status).text}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.modalPriorityBadge,
                                        { backgroundColor: getPriorityBadge(selectedCall.priority).color + '15' }
                                    ]}>
                                        <Text style={[
                                            styles.modalPriorityText,
                                            { color: getPriorityBadge(selectedCall.priority).color }
                                        ]}>
                                            Prioridade: {getPriorityBadge(selectedCall.priority).text}
                                        </Text>
                                    </View>
                                </View>

                                {/* Descrição do Problema */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Descrição do Problema</Text>
                                    <View style={styles.modalSectionContent}>
                                        <Text style={styles.modalSectionText}>
                                            {selectedCall.description}
                                        </Text>
                                    </View>
                                </View>

                                {/* Resposta do Suporte */}
                                {selectedCall.response && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Resposta do Suporte</Text>
                                        <View style={[styles.modalSectionContent, styles.responseContent]}>
                                            <View style={styles.responseHeader}>
                                                <Ionicons name="chatbox-ellipses" size={18} color="#2196F3" />
                                                <Text style={styles.responseHeaderText}>Equipe de Suporte</Text>
                                                {selectedCall.updatedAt && (
                                                    <Text style={styles.responseDate}>
                                                        {formatDate(selectedCall.updatedAt)}
                                                    </Text>
                                                )}
                                            </View>
                                            <Text style={styles.modalSectionText}>
                                                {selectedCall.response}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Botão de Fechar */}
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.modalCloseButtonFull}
                                        onPress={closeModal}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                        <Text style={styles.modalCloseButtonText}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal de Novo Chamado */}
            <Modal
                visible={isNewCallModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeNewCallModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header do Modal */}
                            <View style={styles.modalHeader}>
                                <View style={styles.modalTitleContainer}>
                                    <View style={[styles.modalIconContainer, { backgroundColor: '#2196F3' }]}>
                                        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.modalTitleTextContainer}>
                                        <Text style={styles.modalTitle}>Novo Chamado</Text>
                                        <Text style={styles.modalSubtitle}>Descreva seu problema</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={closeNewCallModal}
                                    style={styles.modalCloseButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Formulário */}
                            <View style={styles.formContainer}>
                                {/* Título */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Título do Chamado *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Ex: Problema com pagamento"
                                        value={newCallForm.title}
                                        onChangeText={(text) => setNewCallForm({ ...newCallForm, title: text })}
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* Categoria */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Categoria *</Text>
                                    <View style={styles.categoryContainer}>
                                        {[
                                            { value: 'technical', label: 'Técnico', icon: 'construct' as const },
                                            { value: 'payment', label: 'Pagamento', icon: 'card' as const },
                                            { value: 'account', label: 'Conta', icon: 'person' as const },
                                            { value: 'safety', label: 'Segurança', icon: 'shield-checkmark' as const },
                                            { value: 'other', label: 'Outro', icon: 'help-circle' as const }
                                        ].map((cat) => (
                                            <TouchableOpacity
                                                key={cat.value}
                                                style={[
                                                    styles.categoryButton,
                                                    newCallForm.category === cat.value && styles.categoryButtonActive
                                                ]}
                                                onPress={() => setNewCallForm({ ...newCallForm, category: cat.value })}
                                            >
                                                <Ionicons
                                                    name={cat.icon}
                                                    size={20}
                                                    color={newCallForm.category === cat.value ? '#FFFFFF' : '#666'}
                                                />
                                                <Text style={[
                                                    styles.categoryButtonText,
                                                    newCallForm.category === cat.value && styles.categoryButtonTextActive
                                                ]}>
                                                    {cat.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Prioridade */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Prioridade</Text>
                                    <View style={styles.priorityContainer}>
                                        {[
                                            { value: 'low', label: 'Baixa', color: '#4CAF50' },
                                            { value: 'medium', label: 'Média', color: '#FF9800' },
                                            { value: 'high', label: 'Alta', color: '#F44336' },
                                            { value: 'urgent', label: 'Urgente', color: '#D32F2F' }
                                        ].map((pri) => (
                                            <TouchableOpacity
                                                key={pri.value}
                                                style={[
                                                    styles.priorityButton,
                                                    newCallForm.priority === pri.value && [
                                                        styles.priorityButtonActive,
                                                        { backgroundColor: pri.color }
                                                    ]
                                                ]}
                                                onPress={() => setNewCallForm({ ...newCallForm, priority: pri.value as any })}
                                            >
                                                <Text style={[
                                                    styles.priorityButtonText,
                                                    newCallForm.priority === pri.value && styles.priorityButtonTextActive
                                                ]}>
                                                    {pri.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Descrição */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Descrição do Problema *</Text>
                                    <TextInput
                                        style={[styles.textInput, styles.textArea]}
                                        placeholder="Descreva seu problema em detalhes..."
                                        value={newCallForm.description}
                                        onChangeText={(text) => setNewCallForm({ ...newCallForm, description: text })}
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* Informação */}
                                <View style={styles.infoContainer}>
                                    <Ionicons name="information-circle" size={16} color="#2196F3" />
                                    <Text style={styles.infoText}>
                                        Nossa equipe responderá seu chamado em até 24 horas úteis.
                                    </Text>
                                </View>
                            </View>

                            {/* Botões */}
                            <View style={styles.modalButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeNewCallModal}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        (!newCallForm.title.trim() || !newCallForm.description.trim() || !newCallForm.category) 
                                            && styles.submitButtonDisabled
                                    ]}
                                    onPress={handleSubmitNewCall}
                                    disabled={!newCallForm.title.trim() || !newCallForm.description.trim() || !newCallForm.category}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.submitButtonText}>Abrir Chamado</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomSpacer} />
        </SafeAreaView>
    );
}
