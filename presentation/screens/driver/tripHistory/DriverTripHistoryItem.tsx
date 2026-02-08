import { Linking, Image, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView, Platform, ToastAndroid } from "react-native";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import styles from './Styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { DriverTripRatingViewModel } from "../tripRating/DriverTripRatingViewModel";
import { container } from "../../../../di/container";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";

interface Props {
    clientRequestResponse: ClientRequestResponse
    onCancel?: (id: number) => void
    onTravel?: (clientRequest: ClientRequestResponse) => void
    onRefresh?: () => void
    onFinish?: (id: number) => void
}

export function DriverTripHistoryItem({ clientRequestResponse, onCancel, onTravel, onRefresh, onFinish }: Props) {
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportText, setReportText] = useState('');
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const viewModel: DriverTripRatingViewModel = container.resolve('driverTripRatingViewModel');
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleSendReport = async () => {
        if (reportText.trim()) {
            console.log('📝 Reportando problema:', {
                tripId: clientRequestResponse.id,
                report: reportText
            });

            const response = await viewModel.updateClientReport(clientRequestResponse.id, reportText);

            if (typeof response === 'boolean') {
                setReportText('');
                setIsReportModalVisible(false);

                ToastAndroid.show('Relatório enviado com sucesso!', ToastAndroid.LONG);

                if (onRefresh) {
                    onRefresh();
                }
            }
        }
    };

    const handleSendRating = async () => {
        if (rating === 0) {
            return;
        }

        const response = await viewModel.updateClientRating(clientRequestResponse.id, rating);

        if (typeof response === 'boolean') {
            ToastAndroid.show('Avaliação enviada com sucesso!', ToastAndroid.LONG);

            // Recarregar a lista de viagens
            if (onRefresh) {
                onRefresh();
            }
        }

        setRating(0);
        setIsRatingModalVisible(false);
    };

    // const formatScheduledDateTime = (scheduledFor: string | Date) => {
    //     const date = typeof scheduledFor === 'string'
    //         ? new Date(scheduledFor.replace('Z', ''))
    //         : scheduledFor;

    //     const day = date.getDate().toString().padStart(2, '0');
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const year = date.getFullYear();
    //     const hours = date.getHours().toString().padStart(2, '0');
    //     const minutes = date.getMinutes().toString().padStart(2, '0');

    //     return {
    //         date: `${day}/${month}/${year}`,
    //         time: `${hours}:${minutes}`,
    //         fullDateTime: `${day}/${month}/${year} às ${hours}:${minutes}`
    //     };
    // };

    const getVehicleTypeInfo = (vehicleType: string) => {
        const types: Record<string, { label: string; icon: string; color: string }> = {
            'car': { label: 'Carro', icon: 'car', color: '#2196F3' },
            'motorcycle': { label: 'Moto', icon: 'bicycle', color: '#FF9800' },
            'suv': { label: 'SUV', icon: 'car-sport', color: '#4CAF50' },
            'van': { label: 'Van', icon: 'bus', color: '#9C27B0' },
        };
        return types[vehicleType.toLowerCase()] || { label: vehicleType, icon: 'car', color: '#666' };
    };

    // const scheduledDateTime = formatScheduledDateTime(clientRequestResponse.scheduledFor);
    const vehicleInfo = getVehicleTypeInfo(clientRequestResponse.vehicle_type);

    const gotToChatScreen = () => {
        rootNavigation.navigate('ChatScreen', {
            comeFrom: 'DriverTripHistoryScreen',
            id_receiver: clientRequestResponse.id_client,
            id_client_request: clientRequestResponse.id
        });
    }

    return (
        <View style={styles.itemContainer}>
            {/* Trip Code Badge */}
            <View style={styles.tripCodeContainer}>
                <Ionicons name="receipt-outline" size={14} color="#FC7700" />
                <Text style={styles.tripCodeText}>Viagem #{clientRequestResponse.id}</Text>
            </View>

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
            {/* <View style={styles.scheduleSection}>
                <Ionicons name="calendar-outline" size={20} color="#FC7700" />
                <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleLabel}>Agendado para</Text>
                    <Text style={styles.scheduleDateTime}>{scheduledDateTime.fullDateTime}</Text>
                </View>
                <View style={styles.toleranceBadge}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.toleranceText}>±{clientRequestResponse.tolerance_minutes}min</Text>
                </View>
            </View> */}

            {/* Tipo de Veículo */}
            <View style={styles.vehicleTypeSection}>
                <Ionicons name={vehicleInfo.icon as any} size={18} color={vehicleInfo.color} />
                <Text style={[styles.vehicleTypeText, { color: vehicleInfo.color }]}>
                    {vehicleInfo.label}
                </Text>
            </View>

            <View style={styles.tripSection}>
                <View style={styles.routeContainer}>
                    <View style={styles.routeItem}>
                        <View style={styles.pickupDot} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>ORIGEM</Text>
                            <Text style={styles.locationText} numberOfLines={1}>
                                {clientRequestResponse.pickup_description}
                            </Text>
                            {clientRequestResponse.pickup_description_plus && (
                                <Text style={styles.locationNote} numberOfLines={2}>
                                    📝 {clientRequestResponse.pickup_description_plus}
                                </Text>
                            )}
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
                            {clientRequestResponse.destination_description_plus && (
                                <Text style={styles.locationNote} numberOfLines={2}>
                                    📝 {clientRequestResponse.destination_description_plus}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionsContainer}>
                {clientRequestResponse.status === 'CREATED' ? (
                    // Apenas botão cancelar para viagens CRIADAS
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onCancel && onCancel(clientRequestResponse.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionButtonCircle, styles.cancelButtonCircle]}>
                            <Ionicons name="close-circle-outline" size={24} color="#fff" />
                        </View>
                        <Text style={styles.actionButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                ) : clientRequestResponse.status === 'ACCEPTED' ? (
                    // Todos os botões para viagens ACEITAS
                    <>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onFinish && onFinish(clientRequestResponse.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.finishButtonCircle]}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Finalizar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onCancel && onCancel(clientRequestResponse.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.cancelButtonCircle]}>
                                <Ionicons name="close-circle-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                gotToChatScreen();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.chatButtonCircle]}>
                                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Chat</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                console.log('Ver localização do cliente')
                                Linking.openURL(`tel:${clientRequestResponse.client.phone}`);
                            }
                            }
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.locationButtonCircle]}>
                                <Ionicons name="call-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Ligar</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onTravel && onTravel(clientRequestResponse)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.travelButtonCircle]}>
                                <Ionicons name="navigate-circle-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Viajar</Text>
                        </TouchableOpacity> */}
                    </>
                ) : clientRequestResponse.status === 'FINISHED' ? (
                    // Para viagens FINALIZADAS: botão de avaliação (se não avaliado) + botão reportar problema
                    <>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                gotToChatScreen();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionButtonCircle, styles.chatButtonCircle]}>
                                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionButtonText}>Chat</Text>
                        </TouchableOpacity>
                        {clientRequestResponse.client_rating === null && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setIsRatingModalVisible(true)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.actionButtonCircle, { backgroundColor: '#FFB800' }]}>
                                    <Ionicons name="star-outline" size={24} color="#fff" />
                                </View>
                                <Text style={styles.actionButtonText}>Avaliar</Text>
                            </TouchableOpacity>
                        )}
                        {clientRequestResponse.client_report === null && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setIsReportModalVisible(true)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.actionButtonCircle, { backgroundColor: '#FF5722' }]}>
                                    <Ionicons name="alert-circle-outline" size={24} color="#fff" />
                                </View>
                                <Text style={styles.actionButtonText}>Reportar</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : null}
            </View>

            {/* Modal de Avaliação */}
            <Modal
                visible={isRatingModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsRatingModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setIsRatingModalVisible(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                            style={styles.modalContent}
                        >
                            <View style={styles.modalHeader}>
                                <View style={styles.modalIndicator} />
                                <View style={styles.modalTitleContainer}>
                                    <Text style={styles.modalTitle}>⭐ Avalie seu Passageiro</Text>
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setIsRatingModalVisible(false)}
                                    >
                                        <Ionicons name="close" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.tripPreview}>
                                    <View style={styles.previewRoute}>
                                        <Ionicons name="person-circle" size={20} color="#FFB800" />
                                        <Text style={styles.previewText}>
                                            {clientRequestResponse.client.name} {clientRequestResponse.client.lastname}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.ratingInputContainer}>
                                    <Text style={styles.ratingPromptText}>Como foi a experiência com esse cliente?</Text>

                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity
                                                key={star}
                                                onPress={() => setRating(star)}
                                                style={styles.starButton}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={star <= rating ? 'star' : 'star-outline'}
                                                    size={45}
                                                    color={star <= rating ? '#FFD700' : '#E0E0E0'}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {rating > 0 && (
                                        <Text style={styles.ratingFeedbackText}>
                                            {rating === 1 && "😞 Experiência difícil"}
                                            {rating === 2 && "😐 Passageiro regular"}
                                            {rating === 3 && "🙂 Passageiro ok"}
                                            {rating === 4 && "😊 Bom passageiro"}
                                            {rating === 5 && "🤩 Passageiro exemplar!"}
                                        </Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.submitRatingButton,
                                        rating === 0 && styles.submitRatingButtonDisabled
                                    ]}
                                    onPress={handleSendRating}
                                    disabled={rating === 0}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="send" size={20} color="#fff" />
                                    <Text style={styles.submitRatingText}>
                                        {rating > 0 ? 'Enviar Avaliação' : 'Selecione uma Avaliação'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal de Reportar Problema */}
            <Modal
                visible={isReportModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsReportModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setIsReportModalVisible(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                            style={styles.modalContent}
                        >
                            <View style={styles.modalHeader}>
                                <View style={styles.modalIndicator} />
                                <View style={styles.modalTitleContainer}>
                                    <Text style={styles.modalTitle}>Reportar Problema</Text>
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setIsReportModalVisible(false)}
                                    >
                                        <Ionicons name="close" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.tripPreview}>
                                    <View style={styles.previewRoute}>
                                        <Ionicons name="alert-circle" size={20} color="#FF5722" />
                                        <Text style={styles.previewText}>
                                            Viagem #{clientRequestResponse.id} - {clientRequestResponse.client.name}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.reportInputContainer}>
                                    <Text style={styles.reportLabel}>Descreva o problema</Text>
                                    <TextInput
                                        style={styles.reportInput}
                                        placeholder="Digite aqui o que aconteceu..."
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                        value={reportText}
                                        onChangeText={setReportText}
                                        maxLength={500}
                                    />
                                    <Text style={styles.reportHint}>
                                        {reportText.length}/500 caracteres
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.submitReportButton,
                                        !reportText.trim() && styles.submitReportButtonDisabled
                                    ]}
                                    onPress={handleSendReport}
                                    disabled={!reportText.trim()}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="send" size={20} color="#fff" />
                                    <Text style={styles.submitReportText}>Enviar Reporte</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}