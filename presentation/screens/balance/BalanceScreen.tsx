import React from "react";
import {
    FlatList,
    View,
    Text,
    StatusBar,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Alert
} from "react-native";
import { container } from "../../../di/container";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { BalanceViewModel } from "./BalanceViewModel";
import { Ionicons } from '@expo/vector-icons';
import styles from './Styles';
import { StatusResponse } from "../../../domain/models/StatusResponse";
import { BalancesItem } from "./BalancesItem";

export function BalanceScreen() {
    const balanceViewModel: BalanceViewModel = container.resolve('balanceViewModel');

    const { authResponse } = useAuth();
    const [balanceRequests, setBalanceRequests] = useState<StatusResponse[]>([]);
    const [filteredBalances, setFilteredBalances] = useState<StatusResponse[]>([]);
    const [paginatedBalances, setPaginatedBalances] = useState<StatusResponse[]>([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const itemsPerPage = 10;

    useFocusEffect(
        React.useCallback(() => {
            handleGetBalanceStatusByIdUser();
        }, [authResponse])
    );

    const handleGetBalanceStatusByIdUser = async () => {
        if (authResponse !== null) {
            setLoading(true);
            try {
                const response = await balanceViewModel.getAllBalanceStatus(authResponse?.user.id!);
                const balances = response as StatusResponse[];
                setBalanceRequests(balances);
                setFilteredBalances(balances);
                updatePagination(balances, 1);
            } catch (error) {
                console.error('Erro ao buscar saldos:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const updatePagination = (balances: StatusResponse[], page: number = 1) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = balances.slice(startIndex, endIndex);
        setPaginatedBalances(paginatedData);
        setCurrentPage(page);
    };

    const handleSetPrimary = async (balanceStatusCode: string) => {
        console.log('Setando saldo como principal:', balanceStatusCode);

        if (!authResponse?.user.id) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
        }

        try {
            const response = await balanceViewModel.consultStatus(balanceStatusCode);

            if (response && typeof response === 'object') {
                Alert.alert('Sucesso', 'Status atualizado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // RECARREGAR A LISTA DE VEÍCULOS PARA REFLETIR AS MUDANÇAS
                            handleGetBalanceStatusByIdUser();
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

    const handleSearch = (text: string) => {
        setSearchText(text);
        let filtered: StatusResponse[];

        if (text.trim() === '') {
            filtered = balanceRequests;
        } else {
            filtered = balanceRequests.filter(balance =>
                balance.code.toLowerCase().includes(text.toLowerCase())
            );
        }

        setFilteredBalances(filtered);
        updatePagination(filtered, 1); // RESET PARA PRIMEIRA PÁGINA AO PESQUISAR
    };

    const handlePageChange = (page: number) => {
        updatePagination(filteredBalances, page);
    };

    const getTotalPages = () => {
        return Math.ceil(filteredBalances.length / itemsPerPage);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const oldPage = currentPage;
        await handleGetBalanceStatusByIdUser();

        // TENTAR MANTER A PÁGINA ATUAL APÓS REFRESH
        setTimeout(() => {
            const totalPages = Math.ceil(filteredBalances.length / itemsPerPage);
            if (oldPage <= totalPages && oldPage > 1) {
                handlePageChange(oldPage);
            }
        }, 100);

        setRefreshing(false);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="wallet" size={28} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Meus Saldos</Text>
                        <Text style={styles.headerSubtitle}>
                            {searchText
                                ? `${filteredBalances.length} de ${balanceRequests.length} saldos encontrados`
                                : filteredBalances.length > itemsPerPage
                                    ? `${balanceRequests.length} saldos • Página ${currentPage} de ${getTotalPages()}`
                                    : `${balanceRequests.length} ${balanceRequests.length === 1 ? 'saldo cadastrado' : 'saldos cadastrados'}`
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
            <Text style={styles.emptyTitle}>Nenhum saldo cadastrado</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
            {/* {renderHeader()} */}
            {/* BARRA DE PESQUISA */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar por código do saldo..."
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
                        {filteredBalances.length} resultado{filteredBalances.length !== 1 ? 's' : ''} encontrado{filteredBalances.length !== 1 ? 's' : ''}
                    </Text>
                )}
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={paginatedBalances}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <BalancesItem
                            statusResponse={item}
                            onSetPrimary={handleSetPrimary}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={searchText ? () => (
                        <View style={styles.noResultsContainer}>
                            <Ionicons name="search-outline" size={64} color="#9E9E9E" />
                            <Text style={styles.noResultsTitle}>Nenhum saldo encontrado</Text>
                            <Text style={styles.noResultsSubtitle}>
                                Não foi possível encontrar saldos com o código "{searchText}"
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
            </View>
            <View style={styles.bottomSpacer} />
        </SafeAreaView>
    );
}