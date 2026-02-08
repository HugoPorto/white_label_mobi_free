import { Image, Modal, Pressable, Text, TextInput, View, Alert, TouchableOpacity, ToastAndroid, ScrollView } from "react-native";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import styles from './Styles';
import { useState } from "react";
import { DriverClientRequestViewModel } from "./DriverClientRequestViewModel";
import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { Ionicons } from '@expo/vector-icons';
import { ClientSerchMapViewModel } from "../../client/searchMap/ClientSearchMapViewModel";
import { container } from "../../../../di/container";

interface Props {
    clientRequestResponse: ClientRequestResponse,
    viewModel: DriverClientRequestViewModel,
    authResponse: AuthResponse | null,
    onOfferSent: (clientRequestId: number) => void
}

export function DriverClientRequestItem({ clientRequestResponse, viewModel, authResponse, onOfferSent }: Props) {

    const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
    const [offer, setOffer] = useState<string>('');
    const clientViewModel: ClientSerchMapViewModel = container.resolve('clientSearchMapViewModel');

    console.log('CLIENT REQUEST ITEM - clientRequestResponse:', clientRequestResponse);

    // ===================================================================
    // ============ CRIA UMA OFERTA DE VIAGEM PARA O CLIENTE =============
    // ===================================================================
    const handleCreateDriverTripOffer = async () => {

        const driverTripOfferData = {
            id_driver: authResponse?.user.id!,
            id_client_request: clientRequestResponse.id,
            fare_offered: Number(offer),
            distance: clientRequestResponse.google_distance_matrix.distance.value / 1000,
            time: clientRequestResponse.google_distance_matrix.duration.value / 60,
        };

        console.log('DADOS PARA ENVIAR NA OFERTA DE VIAGEM:', driverTripOfferData);

        try {
            const response = await viewModel.createDriverTripOffer({
                id_driver: driverTripOfferData.id_driver,
                id_client_request: driverTripOfferData.id_client_request,
                fare_offered: driverTripOfferData.fare_offered,
                distance: driverTripOfferData.distance,
                time: driverTripOfferData.time,
            });

            if ('id_client_request' in response) {
                viewModel.emitNewDriverOffer(clientRequestResponse.id);
                onOfferSent(clientRequestResponse.id); // REMOVE O ITEM DA LISTA APÓS ENVIAR A OFERTA COM SUCESSO
            } else {
                Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
        }
    }

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
        return {
            label: 'COMUM',
            icon: 'flash' as const,
            bgColor: '#FFF3E0',
            textColor: '#F57C00',
            borderColor: '#F57C00'
        };
    };

    const badgeInfo = getBadgeInfo();

    const handleCreateDriverTripOfferAccepted = async () => {
        try {
            const result = await viewModel.getByIdAndExpiredStatus(clientRequestResponse.id);

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
                if (clientRequestResponse.clientRequestType === 'scheduled') {
                    ToastAndroid.show('Corrida agendada com sucesso!', ToastAndroid.LONG);

                    const response = await clientViewModel.updateDriverAssigned(
                        clientRequestResponse.id,
                        authResponse?.user.id!,
                        Number(clientRequestResponse.fare_offered),
                    );

                    if (typeof response === 'boolean') {
                        ToastAndroid.show('Condutor atribuído à corrida agendada com sucesso!', ToastAndroid.LONG);
                        onOfferSent(clientRequestResponse.id);
                    } else {
                        Alert.alert('Erro', 'Não foi possível atribuir o condutor à corrida agendada. Tente novamente.');
                    }
                }
            } else {
                Alert.alert('Erro', 'Não foi possível enviar a oferta. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a oferta. Por favor tente novamente.');
        }
    }

    const formatScheduledDateTime = (scheduledFor: string | Date) => {
        const date = typeof scheduledFor === 'string'
            ? new Date(scheduledFor.replace('Z', ''))
            : scheduledFor;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return {
            date: `${day}/${month}/${year}`,
            time: `${hours}:${minutes}`,
            fullDateTime: `${day}/${month}/${year} às ${hours}:${minutes}`
        };
    };

    return (
        <View style={[
            styles.itemContainer,
            clientRequestResponse?.clientRequestType === 'scheduled'
                ? styles.scheduledBorder
                : styles.commonBorder
        ]}>

            {/* Badge de tipo de solicitação e código da viagem */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View style={[styles.typeBadge, { backgroundColor: badgeInfo.bgColor, borderColor: badgeInfo.borderColor }]}>
                    <Ionicons name={badgeInfo.icon} size={14} color={badgeInfo.textColor} />
                    <Text style={[styles.typeBadgeText, { color: badgeInfo.textColor }]}>
                        {badgeInfo.label}
                    </Text>
                </View>
                <View style={styles.tripCodeContainer}>
                    <Ionicons name="receipt-outline" size={14} color="#FC7700" />
                    <Text style={styles.tripCodeText}>Viagem #{clientRequestResponse.id}</Text>
                </View>
            </ScrollView>

            {/* Header com informações principais */}
            <View style={styles.headerSection}>
                <View style={styles.clientInfo}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatarImage}
                            source={{ uri: clientRequestResponse.client.image }}
                        />
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.clientDetails}>
                        <Text style={styles.clientName}>
                            {clientRequestResponse.client.name} {clientRequestResponse.client.lastname}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFB800" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.fareContainer}>
                    <Text style={styles.fareLabel}>Tarifa</Text>
                    <Text style={styles.fareValue}>R$ {clientRequestResponse.fare_offered}</Text>
                </View>
            </View>
            {clientRequestResponse?.clientRequestType === 'scheduled' && (
                <View style={styles.scheduleSection}>
                    <Ionicons name="calendar-outline" size={20} color="#FC7700" />
                    <View style={styles.scheduleInfo}>
                        <Text style={styles.scheduleLabel}>Agendado para</Text>
                        <Text style={styles.scheduleDateTime}>
                            {formatScheduledDateTime(clientRequestResponse.scheduledFor).fullDateTime}
                        </Text>
                    </View>
                    <View style={styles.toleranceBadge}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.toleranceText}>±{clientRequestResponse.tolerance_minutes}min</Text>
                    </View>
                </View>
            )}
            
            {/* Informações da viagem */}
            <View style={styles.tripSection}>
                <View style={styles.routeContainer}>
                    <View style={styles.routeItem}>
                        <View style={styles.pickupDot} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>ORIGEM</Text>
                            <Text style={styles.locationText} numberOfLines={1}>
                                {clientRequestResponse.pickup_description}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routeItem}>
                        <View style={styles.destinationDot} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>DESTINO</Text>
                            <Text style={styles.locationText} numberOfLines={1}>
                                {clientRequestResponse.destination_description}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Estatísticas da viagem */}
            <View style={styles.statsSection}>
                <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={18} color="#666" />
                    <Text style={styles.statValue}>{clientRequestResponse.duration_text}</Text>
                    <Text style={styles.statLabel}>Tempo</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="car-outline" size={18} color="#666" />
                    <Text style={styles.statValue}>{clientRequestResponse.distance_text}</Text>
                    <Text style={styles.statLabel}>Distância</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="cash-outline" size={18} color="#666" />
                    <Text style={styles.statValue}>R${clientRequestResponse.km_value}/km</Text>
                    <Text style={styles.statLabel}>Rentabilidade</Text>
                </View>
            </View>
            <View style={styles.statsSection}>
                <View style={styles.statItem}>
                    <Ionicons name="cash-outline" size={18} color="#666" />
                    <Text style={styles.statValue}>R${clientRequestResponse.min_value}/min</Text>
                    <Text style={styles.statLabel}>Rentabilidade</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="cash-outline" size={18} color="#666" />
                    <Text style={styles.statValue}>R${clientRequestResponse.recommended_value}</Text>
                    <Text style={styles.statLabel}>Valor Sugerido</Text>
                </View>
            </View>
            {/* {clientRequestResponse?.clientRequestType === 'scheduled' ? (
                <TouchableOpacity onPress={() => handleCreateDriverTripOfferAccepted()}>
                    <View style={styles.actionIndicator}>
                        <Text style={styles.actionText}>Aceitar Corrida</Text>
                    </View>
                </TouchableOpacity>                
            ) : (
                <TouchableOpacity onPress={() => setIsOfferModalVisible(true)}>
                    <View style={styles.actionIndicator}>
                        <Text style={styles.actionText}>Toque para fazer oferta</Text>
                        <Ionicons name="chevron-forward" size={16} color="#FC7700" />
                    </View>
                </TouchableOpacity>
            )} */}
            {clientRequestResponse?.clientRequestType === 'scheduled' && (
                <TouchableOpacity onPress={() => handleCreateDriverTripOfferAccepted()}>
                    <View style={styles.actionIndicator}>
                        <Text style={styles.actionText}>Aceitar Corrida</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Modal de oferta */}
            <Modal
                visible={isOfferModalVisible}
                animationType="slide"
                onRequestClose={() => setIsOfferModalVisible(false)}
                transparent={true}
                presentationStyle="overFullScreen"
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={styles.modalBackdrop}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View style={styles.modalIndicator} />
                                <View style={styles.modalTitleContainer}>
                                    <Text style={styles.modalTitle}>Fazer Oferta</Text>
                                    <Pressable
                                        style={styles.modalCloseButton}
                                        onPress={() => setIsOfferModalVisible(false)}
                                        android_ripple={{ color: '#ccc' }}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="close" size={20} color="#666" />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.tripPreview}>
                                    <View style={styles.previewRoute}>
                                        <Ionicons name="location" size={16} color="#4CAF50" />
                                        <Text style={styles.previewText} numberOfLines={1}>
                                            {clientRequestResponse.pickup_description}
                                        </Text>
                                    </View>
                                    <Ionicons name="arrow-down" size={16} color="#ccc" style={{ alignSelf: 'center', marginVertical: 4 }} />
                                    <View style={styles.previewRoute}>
                                        <Ionicons name="location" size={16} color="#f44336" />
                                        <Text style={styles.previewText} numberOfLines={1}>
                                            {clientRequestResponse.destination_description}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.offerInputContainer}>
                                    <Text style={styles.offerLabel}>Sua Oferta</Text>
                                    <View style={styles.offerInputWrapper}>
                                        <Text style={styles.currencySymbol}>R$</Text>
                                        <TextInput
                                            style={styles.offerInput}
                                            placeholder="0,00"
                                            placeholderTextColor="#ccc"
                                            value={offer}
                                            onChangeText={setOffer}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <Text style={styles.offerHint}>
                                        Sugestão: R$ {clientRequestResponse.fare_offered}
                                    </Text>
                                </View>

                                <Pressable
                                    style={styles.submitOfferButton}
                                    onPress={() => {
                                        setIsOfferModalVisible(false);
                                        handleCreateDriverTripOffer();
                                    }}
                                >
                                    <Text style={styles.submitOfferText}>Enviar Oferta</Text>
                                    <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 8 }} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}