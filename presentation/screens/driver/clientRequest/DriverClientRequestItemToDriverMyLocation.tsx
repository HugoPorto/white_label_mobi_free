import { Image, Text, TextInput, View, Alert, TouchableOpacity, ToastAndroid, } from "react-native";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import styles from './Styles';
import { useState } from "react";
import { DriverClientRequestViewModel } from "./DriverClientRequestViewModel";
import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { Ionicons } from '@expo/vector-icons';
import { ClientSerchMapViewModel } from "../../client/searchMap/ClientSearchMapViewModel";
import { container } from "../../../../di/container";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";

interface Props {
    clientRequestResponse: ClientRequestResponse,
    viewModel: DriverClientRequestViewModel,
    authResponse: AuthResponse | null,
    onOfferSent: (clientRequestId: number) => void,
    onScheduledAccepted?: () => void
}

export function DriverClientRequestItemToDriverMyLocation({ clientRequestResponse, viewModel, authResponse, onOfferSent, onScheduledAccepted }: Props) {
    const [showOfferInput, setShowOfferInput] = useState(false);
    const [offer, setOffer] = useState<string>('');
    const clientViewModel: ClientSerchMapViewModel = container.resolve('clientSearchMapViewModel');
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    console.log('Renderizando DriverClientRequestItemToDriverMyLocation para ClientRequest ID:', clientRequestResponse);

    const handleCreateDriverTripOffer = async () => {
        const mainVehicle = authResponse?.vehicles?.find(vehicle => vehicle.isMain === true);

        if (!mainVehicle) {
            Alert.alert('Erro', 'Você precisa de um veículo principal para enviar uma oferta.');
            return;
        }

        try {
            const response = await viewModel.createDriverTripOffer({
                id_driver: authResponse?.user.id!,
                id_client_request: clientRequestResponse.id,
                fare_offered: Number(offer),
                distance: clientRequestResponse.google_distance_matrix.distance.value / 1000,
                time: clientRequestResponse.google_distance_matrix.duration.value / 60,
            });

            if ('id_client_request' in response) {
                viewModel.emitNewDriverOffer(clientRequestResponse.id);
                onOfferSent(clientRequestResponse.id);
            } else {
                Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
            }

        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
        }
    }

    // Função para aceitar a oferta diretamente
    const handleCreateDriverTripOfferAccepted = async () => {
        console.log('##################################################################################');
        try {
            const result = await viewModel.getByIdAndExpiredStatus(clientRequestResponse.id);

            console.log('Resultado da verificação de expiração:', result);

            if (result && !('message' in result) && 'id' in result) {
                Alert.alert('Atenção', 'Esta solicitação de corrida expirou e não pode mais ser aceita.');
                onOfferSent(clientRequestResponse.id);
                return;
            }

            const response = await viewModel.createDriverTripOffer({
                id_driver: authResponse?.user.id!,
                id_client_request: clientRequestResponse.id,
                fare_offered: Number(clientRequestResponse.fare_offered),
                distance: clientRequestResponse.google_distance_matrix.distance.value / 1000,
                time: clientRequestResponse.google_distance_matrix.duration.value / 60,
            });

            if ('id_client_request' in response) {
                // ========================================================
                // ============ BLOCO PARA CORRIDAS AGENDADAS =============
                // ========================================================
                if (clientRequestResponse.clientRequestType === 'scheduled') {
                    ToastAndroid.show('Corrida agendada com sucesso!', ToastAndroid.LONG);

                    const response = await clientViewModel.updateDriverAssigned(
                        clientRequestResponse.id,
                        authResponse?.user.id!,
                        Number(clientRequestResponse.fare_offered),
                    );

                    if (typeof response === 'boolean') {
                        ToastAndroid.show('Condutor atribuído à corrida agendada com sucesso!', ToastAndroid.LONG);

                        // Fecha o modal e reseta o estado ANTES de navegar
                        if (onScheduledAccepted) {
                            onScheduledAccepted();
                        }

                        // Pequeno delay para garantir que o modal feche antes da navegação
                        setTimeout(() => {
                            rootNavigation.navigate('DriverSchedulesScreen');
                        }, 300);
                    } else {
                        console.error('🟢[CLIENT_SEARCH]  Falha ao atribuir o condutor:', response.message || response);
                    }
                } else {
                    console.log('Oferta enviada com sucesso:', response);
                    console.log('##################################################################################');
                    console.log('##################################################################################');
                    console.log('Client Request', clientRequestResponse);
                    // Emite a oferta aceita
                    viewModel.emitNewDriverOffer(clientRequestResponse.id, true, clientRequestResponse.clientRequestType);
                    onOfferSent(clientRequestResponse.id);
                }
            } else {
                Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a oferta. Por favor tente novamente.');
        }
    }

    // Define o estilo e informações do badge baseado no tipo
    const getBadgeInfo = () => {
        if (clientRequestResponse?.clientRequestType === 'scheduled') {
            return {
                label: 'AGENDADA',
                icon: 'calendar' as const,
                bgColor: '#f4e2ffff',
                textColor: '#895eff',
                borderColor: '#895eff'
            };
        }

        if (clientRequestResponse?.clientRequestType === 'delivery') {
            return {
                label: 'DELIVERY',
                icon: 'flash' as const,
                bgColor: '#FFF3E0',
                textColor: '#F57C00',
                borderColor: '#F57C00'
            };
        }

        return {
            label: 'COMUM',
            icon: 'flash' as const,
            bgColor: '#FFF3E0',
            textColor: '#F57C00',
            borderColor: '#F57C00'
        };
    };

    const badgeInfo = getBadgeInfo();

    return (
        <View style={[
            styles.itemContainer,
            clientRequestResponse?.clientRequestType === 'scheduled'
                ? styles.scheduledBorder
                : styles.commonBorder,
            { paddingHorizontal: 12, paddingVertical: 8, marginVertical: 4 }
        ]}>

            {/* Badge de Tipo de Corrida */}
            <View style={[styles.typeBadge, { backgroundColor: badgeInfo.bgColor, borderColor: badgeInfo.borderColor }]}>
                <Ionicons name={badgeInfo.icon} size={14} color={badgeInfo.textColor} />
                <Text style={[styles.typeBadgeText, { color: badgeInfo.textColor }]}>
                    {badgeInfo.label}
                </Text>
            </View>

            {/* Header com informações principais */}
            <View style={[styles.headerSection, { paddingVertical: 8 }]}>
                <View style={styles.clientInfo}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={[styles.avatarImage, { width: 32, height: 32 }]}
                            source={{ uri: clientRequestResponse.client.image }}
                        />
                        <View style={[styles.onlineIndicator, { width: 8, height: 8 }]} />
                    </View>
                    <View style={styles.clientDetails}>
                        <Text style={[styles.clientName, { fontSize: 14, lineHeight: 18 }]}>
                            {clientRequestResponse.client.name} {clientRequestResponse.client.lastname}
                        </Text>
                        {clientRequestResponse.client.general_client_rating > 0 ? (
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Text style={[styles.ratingText, { fontSize: 11 }]}>{clientRequestResponse.client.general_client_rating}</Text>
                            </View>
                        ) : (
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Text style={[styles.ratingText, { fontSize: 11 }]}>Ainda não calculado</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.fareContainer}>
                    <Text style={[styles.fareLabel, { fontSize: 11 }]}>Tarifa</Text>
                    <Text style={[styles.fareValue, { fontSize: 16 }]}>R$ {clientRequestResponse.fare_offered}</Text>
                </View>
            </View>

            {/* Informações da viagem */}
            <View style={[styles.tripSection, { paddingVertical: 6 }]}>
                <View style={styles.routeContainer}>
                    <View style={[styles.routeItem, { marginBottom: 4 }]}>
                        <View style={[styles.pickupDot, { width: 6, height: 6, marginRight: 8 }]} />
                        <View style={styles.locationInfo}>
                            <Text style={[styles.locationLabel, { fontSize: 9, marginBottom: 2 }]}>Origem</Text>
                            <Text style={[styles.locationText, { fontSize: 12, lineHeight: 16 }]} numberOfLines={1}>
                                {clientRequestResponse.pickup_description}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.routeLine, { height: 12, marginVertical: 2 }]} />

                    <View style={styles.routeItem}>
                        <View style={[styles.destinationDot, { width: 6, height: 6, marginRight: 8 }]} />
                        <View style={styles.locationInfo}>
                            <Text style={[styles.locationLabel, { fontSize: 9, marginBottom: 2 }]}>Destino</Text>
                            <Text style={[styles.locationText, { fontSize: 12, lineHeight: 16 }]} numberOfLines={1}>
                                {clientRequestResponse.destination_description}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Estatísticas da viagem */}
            <View style={[styles.statsSection, { paddingVertical: 6 }]}>
                <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={[styles.statValue, { fontSize: 11, lineHeight: 14 }]}>{clientRequestResponse.google_distance_matrix.duration.text}</Text>
                    <Text style={[styles.statLabel, { fontSize: 9 }]}>Tempo</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="car-outline" size={14} color="#666" />
                    <Text style={[styles.statValue, { fontSize: 11, lineHeight: 14 }]}>{clientRequestResponse.google_distance_matrix.distance.text}</Text>
                    <Text style={[styles.statLabel, { fontSize: 9 }]}>Distância</Text>
                </View>
            </View>

            {/* Botões de Ação */}
            <View style={{ flexDirection: 'column', gap: 6, paddingVertical: 8 }}>
                {/* Primeira linha - Botão Aceitar (principal) */}
                <TouchableOpacity
                    onPress={() => {
                        handleCreateDriverTripOfferAccepted();

                    }}
                    style={{ width: '100%' }}
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={[styles.actionIndicator, { paddingVertical: 10, backgroundColor: '#4CAF50', borderRadius: 8 }]}>
                        <Text style={[styles.actionText, { fontSize: 13, color: '#fff', fontWeight: '600' }]}>Aceitar R$ {clientRequestResponse.fare_offered}</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>

                {/* Segunda linha - Fazer Oferta e Recusar */}
                <View style={{ flexDirection: 'row', gap: 6 }}>
                    {/* Botão para fazer oferta */}
                    {clientRequestResponse?.clientRequestType !== 'scheduled' && (
                        <TouchableOpacity
                            onPress={() => {

                                setShowOfferInput(!showOfferInput);
                            }}
                            style={{ flex: 1 }}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <View style={[styles.actionIndicator, { paddingVertical: 8, paddingHorizontal: 5, backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#FC7700' }]}>
                                <Text style={[styles.actionText, { fontSize: 11, color: '#FC7700' }]}>Fazer Oferta</Text>
                                <Ionicons name="create-outline" size={12} color="#FC7700" />
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Botão para recusar */}
                    <TouchableOpacity
                        onPress={() => {
                            onOfferSent(clientRequestResponse.id);
                        }}
                        style={{ flex: 1 }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={[styles.actionIndicator, { paddingVertical: 8, paddingHorizontal: 5, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e74c3c' }]}>
                            <Text style={[styles.actionText, { fontSize: 11, color: '#e74c3c' }]}>Recusar</Text>
                            <Ionicons name="close-circle" size={12} color="#e74c3c" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Input de Oferta Inline */}
            {showOfferInput && (
                <View style={{ paddingTop: 12, paddingHorizontal: 8, paddingBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#FC7700' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FC7700', marginRight: 8 }}>R$</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: 16, color: '#333', paddingVertical: 4 }}
                            placeholder="0,00"
                            placeholderTextColor="#999"
                            value={offer}
                            onChangeText={setOffer}
                            keyboardType="numeric"
                            autoFocus={true}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (offer && parseFloat(offer) > 0) {
                                    setShowOfferInput(false);
                                    handleCreateDriverTripOffer();
                                } else {
                                    Alert.alert('Atenção', 'Por favor, digite um valor válido para a oferta.');
                                }
                            }}
                            style={{ backgroundColor: '#FC7700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginLeft: 8 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setShowOfferInput(false);
                                setOffer('');
                            }}
                            style={{ marginLeft: 8, padding: 4 }}
                        >
                            <Ionicons name="close" size={16} color="#999" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' }}>
                        Sugestão: R$ {clientRequestResponse.fare_offered}
                    </Text>
                </View>
            )}
        </View>
    );
}