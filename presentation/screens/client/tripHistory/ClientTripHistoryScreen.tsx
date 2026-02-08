import { View, Text, FlatList, RefreshControl, StatusBar, Alert, TouchableOpacity, ScrollView } from "react-native";
import { container } from "../../../../di/container";
import { useEffect, useState } from "react";
import styles from './Styles';
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { ClientTripHistoryItem } from "./ClientTripHistoryItem";
import { useAuth } from "../../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import { ClientTripHistoryViewModel } from "./ClientTripHistoryViewModel";
import { Status } from "../../../../domain/repository/ClientRequestRepository";

export function ClientTripHistoryScreen() {
    const viewModel: ClientTripHistoryViewModel = container.resolve('clientTripHistoryViewModel');
    const [clientRequestResponse, setClientRequestResponse] = useState<ClientRequestResponse[]>([]);
    const [displayedData, setDisplayedData] = useState<ClientRequestResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'accepted' | 'finished' | 'cancelled'>('accepted');
    const { authResponse } = useAuth();
    const ITEMS_PER_PAGE = 5;
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        handleGetCreatedScheduleByClient();
    }, [])

    const handleGetCreatedScheduleByClient = async () => {
        setIsLoading(true);
        if (authResponse !== null) {
            const response = await viewModel.getByClientCommonAssigned(authResponse?.user.id!);
            const data = response as ClientRequestResponse[];
            setClientRequestResponse(data);
            applyFilter(data, selectedFilter);
            setIsLoading(false);
        }
    }

    const applyFilter = (data: ClientRequestResponse[], filter: 'accepted' | 'finished' | 'cancelled') => {
        const filteredData = data.filter(trip => {
            if (filter === 'accepted') {
                return trip.status === 'ACCEPTED';
            } else if (filter === 'finished') {
                return trip.status === 'FINISHED';
            } else {
                return trip.status === 'CANCELLED';
            }
        });

        setDisplayedData(filteredData.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
    }

    useEffect(() => {
        applyFilter(clientRequestResponse, selectedFilter);
    }, [selectedFilter]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await handleGetCreatedScheduleByClient();
        setIsRefreshing(false);
    }

    const handleLoadMore = () => {
        if (isLoadingMore) return;

        // Obter os dados filtrados baseado no filtro atual
        const filteredData = clientRequestResponse.filter(trip => {
            if (selectedFilter === 'accepted') {
                return trip.status === 'ACCEPTED';
            } else if (selectedFilter === 'finished') {
                return trip.status === 'FINISHED';
            } else {
                return trip.status === 'CANCELLED';
            }
        });

        const totalItems = filteredData.length;
        const currentItems = displayedData.length;

        if (currentItems >= totalItems) return; // Verifica se ainda há mais itens para carregar

        setIsLoadingMore(true);

        setTimeout(() => { // Simula um pequeno delay para melhor UX
            const nextPage = currentPage + 1;
            const startIndex = 0;
            const endIndex = nextPage * ITEMS_PER_PAGE;
            const newData = filteredData.slice(startIndex, endIndex);

            setDisplayedData(newData);
            setCurrentPage(nextPage);
            setIsLoadingMore(false);
        }, 300);
    }

    const handleRemoveClientRequest = (clientRequestId: number) => {
        setClientRequestResponse(prev => prev.filter(item => item.id !== clientRequestId));
        setDisplayedData(prev => prev.filter(item => item.id !== clientRequestId));
    }

    const handleCancelTrip = (id: number) => {
        Alert.alert(
            'Cancelar Viagem',
            `Você deseja cancelar a viagem #${id}?`,
            [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim, Cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        const response = await viewModel.updateStatus(id, Status.CANCELLED);

                        console.log('Resposta do cancelamento da viagem:', response);  

                        if (typeof response === 'boolean') {
                            setClientRequestResponse([]);
                            setDisplayedData([]);
                            setCurrentPage(1);
                            await handleGetCreatedScheduleByClient();
                        }
                    }
                }
            ]
        );
    }

    const handleFinishTrip = (id: number) => {
        Alert.alert(
            'Finalizar Viagem',
            `Você deseja finalizar a viagem #${id}?`,
            [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim, Finalizar',
                    style: 'destructive',
                    onPress: async () => {
                        const response = await viewModel.updateStatus(id, Status.FINISHED);

                        if (typeof response === 'boolean') {
                            setClientRequestResponse([]);
                            setDisplayedData([]);
                            setCurrentPage(1);
                            await handleGetCreatedScheduleByClient();
                        }
                    }
                }
            ]
        );
    }

    const handleTravelTrip = (clientRequest: ClientRequestResponse) => {
        Alert.alert(
            'Iniciar Viagem',
            `Deseja iniciar a viagem para ${clientRequest.client.name} ${clientRequest.client.lastname}?\n\nOrigem: ${clientRequest.pickup_description}\nDestino: ${clientRequest.destination_description}\nValor: R$ ${clientRequest.fare_offered}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Iniciar Viagem',
                    style: 'default',
                    onPress: () => {
                        console.log(`🚗 Iniciando viagem - ID: ${clientRequest.id}`);
                        console.log(`📍 Cliente: ${clientRequest.client.name} ${clientRequest.client.lastname}`);
                        console.log(`💰 Valor: R$ ${clientRequest.fare_offered}`);
                        rootNavigation.navigate('DriverMapStackNavigator', {
                            screen: 'DriverTripMapScreen',
                            params: { idClientRequest: clientRequest.id }
                        } as any);
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Viagens</Text>
                <Text style={styles.headerSubtitle}>
                    {displayedData.length} de {clientRequestResponse.length} viage{displayedData.length !== 1 ? 'ns' : 'm'} exibida{displayedData.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Barra de filtros */}
            <View style={{ backgroundColor: '#fff' }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'accepted' && styles.activeFilterChip]}
                        onPress={() => setSelectedFilter('accepted')}
                    >
                        <Text style={[styles.filterChipText, selectedFilter === 'accepted' && styles.activeFilterChipText]}>
                            Aceitos ({clientRequestResponse.filter(t => t.status === 'ACCEPTED').length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'finished' && styles.activeFilterChip]}
                        onPress={() => setSelectedFilter('finished')}
                    >
                        <Text style={[styles.filterChipText, selectedFilter === 'finished' && styles.activeFilterChipText]}>
                            Finalizados ({clientRequestResponse.filter(t => t.status === 'FINISHED').length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'cancelled' && styles.activeFilterChip]}
                        onPress={() => setSelectedFilter('cancelled')}
                    >
                        <Text style={[styles.filterChipText, selectedFilter === 'cancelled' && styles.activeFilterChipText]}>
                            Cancelados ({clientRequestResponse.filter(t => t.status === 'CANCELLED').length})
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Ionicons name="car" size={48} color="#FC7700" />
                    <Text style={styles.loadingText}>Buscando viagens próximas...</Text>
                </View>
            ) : clientRequestResponse.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="car-outline" size={80} color="#e0e0e0" />
                    </View>
                    <Text style={styles.emptyTitle}>
                        Nenhuma viagem disponível
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Não há solicitações de viagem na sua área no momento.{'\n'}
                        Puxe para baixo para atualizar.
                    </Text>
                </View>
            ) : displayedData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="filter-outline" size={80} color="#e0e0e0" />
                    </View>
                    <Text style={styles.emptyTitle}>
                        Nenhuma viagem {
                            selectedFilter === 'accepted' ? 'aceita' :
                                selectedFilter === 'finished' ? 'finalizada' :
                                    'cancelada'
                        }
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Não há viagens com status "{
                            selectedFilter === 'accepted' ? 'ACEITO' :
                                selectedFilter === 'finished' ? 'FINALIZADO' :
                                    'CANCELADO'
                        }" no momento.{'\n'}
                        Tente selecionar outro filtro.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={displayedData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ClientTripHistoryItem
                            clientRequestResponse={item}
                            onCancel={handleCancelTrip}
                            onTravel={handleTravelTrip}
                            onRefresh={async () => {
                                setClientRequestResponse([]);
                                setDisplayedData([]);
                                setCurrentPage(1);
                                await handleGetCreatedScheduleByClient();
                            }}
                            onFinish={handleFinishTrip}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 80, paddingTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={7}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={7}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isLoadingMore && displayedData.length < clientRequestResponse.length ? (
                            <View style={styles.loadingMoreContainer}>
                                <Ionicons name="hourglass-outline" size={24} color="#FC7700" />
                                <Text style={styles.loadingMoreText}>Carregando mais...</Text>
                            </View>
                        ) : displayedData.length >= clientRequestResponse.length && clientRequestResponse.length > ITEMS_PER_PAGE ? (
                            <View style={styles.endMessageContainer}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                                <Text style={styles.endMessageText}>Todas as viagens foram carregadas</Text>
                            </View>
                        ) : null
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={['#FC7700']}
                            tintColor="#FC7700"
                            title="Atualizando..."
                            titleColor="#666"
                        />
                    }
                />
            )}

            <View style={styles.bottomBar} />
        </View>
    );
}