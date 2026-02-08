import React from "react";
import {
    FlatList,
    View,
    Text,
    StatusBar,
    RefreshControl,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ScrollView
} from "react-native";
import { container } from "../../../di/container";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { VehiclesItem } from "./VehiclesItem";
import { VehicleRegisterViewModel } from "./VehicleRegisterViewModel";
import { VehicleResponse } from "../../../domain/models/VehicleResponse";
import { VehicleRequest } from "../../../domain/models/VehicleRequest";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './Styles';
import { ProfileUpdateViewModel } from "../profile/update/ProfileUpdateViewModel";

const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'Branco': '#FFFFFF',
        'Preto': '#000000',
        'Prata': '#C0C0C0',
        'Azul': '#1976D2',
        'Vermelho': '#D32F2F',
        'Cinza': '#757575'
    };

    return colorMap[colorName] || '#E0E0E0';
};

export function VehiclesScreen() {
    const vehicleRegisterViewModel: VehicleRegisterViewModel = container.resolve('vehicleRegisterViewModel');
    const { authResponse, saveAuthSession } = useAuth();
    const [vehicleRequests, setVehicleRequests] = useState<VehicleResponse[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleResponse[]>([]);
    const [paginatedVehicles, setPaginatedVehicles] = useState<VehicleResponse[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const profileViewModel: ProfileUpdateViewModel = container.resolve('profileUpdateViewModel');
    const itemsPerPage = 10;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        typeVehicle: '',
        licensePlate: '',
        year: '',
        brand: '',
        model: '',
        color: ''
    });

    useFocusEffect(
        React.useCallback(() => {
            handleGetVehiclesByIdUser();
        }, [authResponse])
    );

    const handleGetVehiclesByIdUser = async () => {
        if (authResponse !== null) {
            setLoading(true);
            console.log('ID USER', authResponse?.user.id);
            try {
                const response = await vehicleRegisterViewModel.getVehicleRequestsByUserId(authResponse?.user.id!);
                console.log('Response VehiclesScreen:', response);
                const vehicles = response as VehicleResponse[];
                setVehicleRequests(vehicles);
                setFilteredVehicles(vehicles);
                updatePagination(vehicles, 1);
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const updatePagination = (vehicles: VehicleResponse[], page: number = 1) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = vehicles.slice(startIndex, endIndex);
        setPaginatedVehicles(paginatedData);
        setCurrentPage(page);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        let filtered: VehicleResponse[];

        if (text.trim() === '') {
            filtered = vehicleRequests;
        } else {
            filtered = vehicleRequests.filter(vehicle =>
                vehicle.licensePlate.toLowerCase().includes(text.toLowerCase())
            );
        }

        setFilteredVehicles(filtered);
        updatePagination(filtered, 1); // RESET PARA PRIMEIRA PÁGINA AO PESQUISAR
    };

    const handlePageChange = (page: number) => {
        updatePagination(filteredVehicles, page);
    };

    const getTotalPages = () => {
        return Math.ceil(filteredVehicles.length / itemsPerPage);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const oldPage = currentPage;
        await handleGetVehiclesByIdUser();

        // TENTAR MANTER A PÁGINA ATUAL APÓS REFRESH
        setTimeout(() => {
            const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
            if (oldPage <= totalPages && oldPage > 1) {
                handlePageChange(oldPage);
            }
        }, 100);

        setRefreshing(false);
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setFormData({
            typeVehicle: '',
            licensePlate: '',
            year: '',
            brand: '',
            model: '',
            color: ''
        });
    };

    const handleSubmit = async () => {
        if (!formData.typeVehicle || !formData.licensePlate || !formData.year) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const yearNum = parseInt(formData.year);
        if (yearNum < 1990 || yearNum > 2025) {
            Alert.alert('Erro', 'O ano do veículo deve estar entre 1990 e 2025.');
            return;
        }

        if (formData.licensePlate.length < 7) {
            Alert.alert('Erro', 'Por favor, digite uma placa válida (mínimo 7 caracteres).');
            return;
        }

        if (!authResponse?.user.id) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
        }

        setIsSubmitting(true);

        try {
            const vehicleRequest: VehicleRequest = {
                id_user: authResponse.user.id,
                typeVehicle: formData.typeVehicle,
                licensePlate: formData.licensePlate.toUpperCase(),
                year: yearNum,
                brand: formData.brand.trim() || undefined,
                model: formData.model.trim() || undefined,
                color: formData.color.trim() || undefined,
                isActive: true,
                isMain: false,
                isVerified: false
            };

            const response = await vehicleRegisterViewModel.register(vehicleRequest);

            if (response && typeof response === 'object' && 'id' in response && 'user' in response) {
                Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            closeModal();
                            handleGetVehiclesByIdUser();
                        }
                    }
                ]);
            } else {
                Alert.alert('Erro', 'Falha ao cadastrar o veículo. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetPrimary = async (vehicleId: number) => {
        if (!authResponse?.user.id) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
        }

        try {
            const response = await vehicleRegisterViewModel.toggleMainVehicle(vehicleId, authResponse.user.id);

            if (response && typeof response === 'object' && 'id' in response) {
                let responseUser = null;

                responseUser = await profileViewModel.update({
                    id: authResponse?.user.id,
                    name: authResponse!.user.name,
                    lastname: authResponse!.user.lastname,
                    phone: authResponse!.user.phone,
                    email: authResponse?.user.email!,
                    car: response.typeVehicle === 'car' ? true : false,
                });

                if ('id' in responseUser) {
                    saveAuthSession({
                        user: { ...responseUser, roles: authResponse?.user.roles },
                        token: authResponse?.token!,
                        session_id: authResponse?.session_id!,
                        refresh_token: authResponse?.refresh_token!
                    });
                }

                Alert.alert('Sucesso', 'Veículo definido como principal!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Recarregar a lista de veículos para refletir as mudanças
                            handleGetVehiclesByIdUser();
                        }
                    }
                ]);
            } else {
                Alert.alert('Erro', 'Não foi possível definir o veículo como principal. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao definir veículo como principal:', error);
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="car-sport" size={28} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Meus Veículos</Text>
                        <Text style={styles.headerSubtitle}>
                            {searchText
                                ? `${filteredVehicles.length} de ${vehicleRequests.length} veículos encontrados`
                                : filteredVehicles.length > itemsPerPage
                                    ? `${vehicleRequests.length} veículos • Página ${currentPage} de ${getTotalPages()}`
                                    : `${vehicleRequests.length} ${vehicleRequests.length === 1 ? 'veículo cadastrado' : 'veículos cadastrados'}`
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="car-sport-outline" size={64} color="#9E9E9E" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Adicione seu primeiro veículo para começar a realizar corridas
            </Text>
            <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={openModal}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.emptyAddButtonText}>Adicionar Veículo</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

            {renderHeader()}

            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar por placa do veículo..."
                        value={searchText}
                        onChangeText={handleSearch}
                        placeholderTextColor="#999"
                        autoCapitalize="characters"
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
                        {filteredVehicles.length} resultado{filteredVehicles.length !== 1 ? 's' : ''} encontrado{filteredVehicles.length !== 1 ? 's' : ''}
                    </Text>
                )}
            </View>

            <View style={styles.contentContainer}>
                <FlatList
                    data={paginatedVehicles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <VehiclesItem
                            vehicleRequest={item}
                            onSetPrimary={handleSetPrimary}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={searchText ? () => (
                        <View style={styles.noResultsContainer}>
                            <Ionicons name="search-outline" size={64} color="#9E9E9E" />
                            <Text style={styles.noResultsTitle}>Nenhum veículo encontrado</Text>
                            <Text style={styles.noResultsSubtitle}>
                                Não foi possível encontrar veículos com a placa "{searchText}"
                            </Text>
                        </View>
                    ) : renderEmpty}
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
                {filteredVehicles.length > itemsPerPage && (
                    <View style={styles.paginationContainer}>
                        <View style={styles.paginationInfo}>
                            <Text style={styles.paginationText}>
                                Página {currentPage} de {getTotalPages()} • {filteredVehicles.length} veículos total
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

                                    // Mostrar apenas algumas páginas ao redor da atual
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === getTotalPages() ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[
                                                    styles.pageNumberButton,
                                                    isCurrentPage && styles.pageNumberButtonActive
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
                                        return (
                                            <Text key={pageNumber} style={styles.pageEllipsis}>...</Text>
                                        );
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

            {/* BOTÃO FLUTUANTE PARA ADICIONAR VEÍCULO */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={openModal}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* MODAL PARA ADICIONAR VEÍCULO */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* HEADER DO MODAL */}
                            <View style={styles.modalHeader}>
                                <View style={styles.modalTitleContainer}>
                                    <View style={styles.modalIconContainer}>
                                        <MaterialIcons name="directions-car" size={24} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.modalTitleTextContainer}>
                                        <Text style={styles.modalTitle}>Adicionar Veículo</Text>
                                        <Text style={styles.modalSubtitle}>Preencha as informações do seu veículo</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={closeModal}
                                    style={styles.modalCloseButton}
                                    activeOpacity={0.7}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* FORMULÁRIO */}
                            <View style={styles.formContainer}>
                                {/* TIPO DE VEÍCULO */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Tipo de Veículo *</Text>
                                    <View style={styles.vehicleTypeContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.vehicleTypeButton,
                                                formData.typeVehicle === 'car' && styles.vehicleTypeButtonActive
                                            ]}
                                            onPress={() => setFormData({ ...formData, typeVehicle: 'car' })}>
                                            <Ionicons
                                                name="car"
                                                size={20}
                                                color={formData.typeVehicle === 'car' ? '#FFFFFF' : '#666'}
                                            />
                                            <Text style={[
                                                styles.vehicleTypeText,
                                                formData.typeVehicle === 'car' && styles.vehicleTypeTextActive
                                            ]}>
                                                Carro
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.vehicleTypeButton,
                                                formData.typeVehicle === 'motorcycle' && styles.vehicleTypeButtonActive
                                            ]}
                                            onPress={() => setFormData({ ...formData, typeVehicle: 'motorcycle' })}>
                                            <MaterialIcons
                                                name="two-wheeler"
                                                size={20}
                                                color={formData.typeVehicle === 'motorcycle' ? '#FFFFFF' : '#666'} />
                                            <Text style={[
                                                styles.vehicleTypeText,
                                                formData.typeVehicle === 'motorcycle' && styles.vehicleTypeTextActive
                                            ]}>
                                                Moto
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* PLACA */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Placa do Veículo *</Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            formData.licensePlate && formData.licensePlate.length > 0 && formData.licensePlate.length < 7 && { borderColor: '#FF9800' }
                                        ]}
                                        placeholder="Ex: ABC-1234"
                                        value={formData.licensePlate}
                                        onChangeText={(text) => setFormData({ ...formData, licensePlate: text })}
                                        maxLength={8}
                                        autoCapitalize="characters"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* ANO */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Ano do Veículo *</Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            formData.year && (parseInt(formData.year) < 1990 || parseInt(formData.year) > 2025) && { borderColor: '#FF9800' }
                                        ]}
                                        placeholder="Ex: 2020"
                                        value={formData.year}
                                        onChangeText={(text) => setFormData({ ...formData, year: text })}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        placeholderTextColor="#999"
                                    />
                                    {formData.year && (parseInt(formData.year) < 1990 || parseInt(formData.year) > 2025) && (
                                        <Text style={styles.validationText}>
                                            Ano deve estar entre 1990 e 2025
                                        </Text>
                                    )}
                                </View>

                                {/* MARCA */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Marca do Veículo</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Ex: Toyota, Honda, Volkswagen"
                                        value={formData.brand}
                                        onChangeText={(text) => setFormData({ ...formData, brand: text })}
                                        autoCapitalize="words"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* MODELO */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Modelo do Veículo</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Ex: Corolla, Civic, Gol"
                                        value={formData.model}
                                        onChangeText={(text) => setFormData({ ...formData, model: text })}
                                        autoCapitalize="words"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* COR */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Cor do Veículo</Text>
                                    <View style={styles.colorContainer}>
                                        {['Branco', 'Preto', 'Prata', 'Azul', 'Vermelho', 'Cinza'].map((colorOption) => (
                                            <TouchableOpacity
                                                key={colorOption}
                                                style={[
                                                    styles.colorButton,
                                                    formData.color === colorOption && styles.colorButtonActive
                                                ]}
                                                onPress={() => setFormData({ ...formData, color: colorOption })}
                                            >
                                                <View style={[styles.colorPreview, { backgroundColor: getColorHex(colorOption) }]} />
                                                <Text style={[
                                                    styles.colorText,
                                                    formData.color === colorOption && styles.colorTextActive
                                                ]}>
                                                    {colorOption}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <TextInput
                                        style={[styles.textInput, { marginTop: 12 }]}
                                        placeholder="Ou digite uma cor personalizada"
                                        value={formData.color && !['Branco', 'Preto', 'Prata', 'Azul', 'Vermelho', 'Cinza'].includes(formData.color) ? formData.color : ''}
                                        onChangeText={(text) => setFormData({ ...formData, color: text })}
                                        autoCapitalize="words"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                {/* INFORMAÇÃO */}
                                <View style={styles.infoContainer}>
                                    <Ionicons name="information-circle" size={16} color="#2196F3" />
                                    <Text style={styles.infoText}>
                                        Campos com * são obrigatórios. As informações adicionais ajudam os clientes a identificar seu veículo.
                                    </Text>
                                </View>
                            </View>

                            {/* BOTÕES */}
                            <View style={styles.modalButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        (!formData.typeVehicle ||
                                            !formData.licensePlate ||
                                            formData.licensePlate.length < 7 ||
                                            !formData.year ||
                                            parseInt(formData.year) < 1990 ||
                                            parseInt(formData.year) > 2025) && styles.submitButtonDisabled
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        !formData.typeVehicle ||
                                        !formData.licensePlate ||
                                        formData.licensePlate.length < 7 ||
                                        !formData.year ||
                                        parseInt(formData.year) < 1990 ||
                                        parseInt(formData.year) > 2025
                                    }
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Veículo'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomSpacer} />
        </View>
    );
}