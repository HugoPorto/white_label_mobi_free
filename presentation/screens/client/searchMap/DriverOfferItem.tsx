import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import { ClientSerchMapViewModel } from "./ClientSearchMapViewModel";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

interface Props {
    viewModel: ClientSerchMapViewModel,
    driverTripOffer: DriverTripOffer,
    navigation: StackNavigationProp<ClientMapStackParamList, 'ClientSearchMapScreen', undefined>,
    onReject?: () => void,
    onRemove?: (itemId: number) => void
}

export function DriverOfferItem(
    {
        viewModel, // ViewModel para lógica de negócios
        driverTripOffer, // Oferta de viagem do motorista
        navigation, // Navegação para outras telas
        onReject, // Método para rejeitar a oferta
        onRemove // Método para remover a oferta
    }: Props) {

    // 
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~ Função para atualizar o motorista atribuído ~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const handleUpdateDriverAssigned = async () => {
        try {
            const response = await viewModel.updateDriverAssigned(
                driverTripOffer.id_client_request,
                driverTripOffer.id_driver,
                driverTripOffer.fare_offered
            );
            if (typeof response === 'boolean') {
                viewModel.emitNewDriverAssigned(driverTripOffer.id_client_request, driverTripOffer.id_driver);
                console.log('🟢[CLIENT_SEARCH] Condutor atribuído com sucesso!');
                console.log('🟢[CLIENT_SEARCH] DriverOffer:', driverTripOffer);
                navigation.navigate('ClientTripMapScreen', {
                    idClientRequest: driverTripOffer.id_client_request, vehicle: driverTripOffer.vehicle
                });
            } else {
                console.error('🟢[CLIENT_SEARCH]  Falha ao atribuir o condutor:', response.message || response);
            }
        } catch (error) {
            console.error('🟢[CLIENT_SEARCH] Erro ao atualizar o motorista atribuído:', error);
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~ Função para rejeitar a oferta ~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const handleReject = () => {
        if (onRemove && driverTripOffer.id) {
            onRemove(driverTripOffer.id);
        }
        if (onReject) {
            onReject();
        }
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho com informações do motorista */}
            <View style={styles.driverHeader}>
                <View style={styles.driverImageContainer}>
                    {driverTripOffer.driver?.image ? (
                        <Image
                            source={{ uri: driverTripOffer.driver?.image }}
                            style={styles.imageDriver}
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <MaterialIcons name="person" size={24} color="#7f8c8d" />
                        </View>
                    )}
                </View>

                <View style={styles.driverInfo}>
                    <View style={styles.driverNameContainer}>
                        <Text style={styles.driverName}>{driverTripOffer.driver?.name || 'Motorista'}</Text>
                        <View style={[
                            styles.vehicleTypeBadge,
                            driverTripOffer.driver?.typeVehicle
                                ? styles.carBadge
                                : styles.motoBadge
                        ]}>
                            {driverTripOffer.driver?.typeVehicle ? (
                                <Ionicons name="car" size={12} color="#fff" />
                            ) : (
                                <MaterialIcons name="two-wheeler" size={12} color="#fff" />
                            )}
                            <Text style={styles.vehicleTypeBadgeText}>
                                {driverTripOffer.driver?.typeVehicle ? 'Carro' : 'Moto'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <FontAwesome5 name="star" size={12} color="#f39c12" solid />
                        <Text style={styles.ratingText}>5.0</Text>
                        <Text style={styles.reviewsText}>• 127 avaliações</Text>
                    </View>
                    <View style={styles.vehicleInfo}>
                        {driverTripOffer.driver?.typeVehicle ? (
                            <Ionicons name="car" size={14} color="#4CAF50" />
                        ) : (
                            <MaterialIcons name="two-wheeler" size={14} color="#E91E63" />
                        )}
                        <Text style={styles.vehicleText}>
                            {/* {driverTripOffer.vehicle?.typeVehicle ? 'Volkswagen Gol' : 'Honda CG 160'} */}
                            {driverTripOffer.vehicle?.brand} {driverTripOffer.vehicle?.model} {driverTripOffer.vehicle?.color}
                        </Text>
                    </View>
                </View>

                <View style={styles.offerInfo}>
                    <Text style={styles.price}>R$ {parseFloat(driverTripOffer.fare_offered.toString()).toFixed(2)}</Text>
                    <View style={styles.estimateContainer}>
                        <View style={styles.estimateItem}>
                            <MaterialIcons name="schedule" size={14} color="#3498db" />
                            <Text style={styles.estimateText}>{driverTripOffer.time} min</Text>
                        </View>
                        <View style={styles.estimateItem}>
                            <MaterialIcons name="straighten" size={14} color="#e74c3c" />
                            <Text style={styles.estimateText}>{driverTripOffer.distance} km</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Detalhes adicionais */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <MaterialIcons name="local-taxi" size={16} color="#FC7700" />
                    <Text style={styles.detailText}>Chegará em {driverTripOffer.time} minutos</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="verified-user" size={16} color="#27ae60" />
                    <Text style={styles.detailText}>Motorista verificado</Text>
                </View>
                <View style={styles.detailItem}>
                    {driverTripOffer.driver?.typeVehicle ? (
                        <Ionicons name="car" size={16} color="#4CAF50" />
                    ) : (
                        <MaterialIcons name="two-wheeler" size={16} color="#E91E63" />
                    )}
                    <Text style={styles.detailText}>
                        Veículo: {driverTripOffer.driver?.typeVehicle ? 'Carro' : 'Motocicleta'}
                    </Text>
                </View>
            </View>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                    <MaterialIcons name="close" size={18} color="#e74c3c" />
                    <Text style={styles.rejectText}>Recusar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.acceptButton,
                        driverTripOffer.driver?.typeVehicle
                            ? styles.acceptButtonCar
                            : styles.acceptButtonMoto
                    ]}
                    onPress={handleUpdateDriverAssigned}
                >
                    {driverTripOffer.driver?.typeVehicle ? (
                        <Ionicons name="car" size={18} color="#ffffff" />
                    ) : (
                        <MaterialIcons name="two-wheeler" size={18} color="#ffffff" />
                    )}
                    <Text style={styles.acceptText}>Aceitar Corrida</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    driverImageContainer: {
        marginRight: 12,
    },
    imageDriver: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
    },
    placeholderImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#2c3e50',
        fontWeight: '600',
        marginLeft: 4,
    },
    reviewsText: {
        fontSize: 12,
        color: '#7f8c8d',
        marginLeft: 4,
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleText: {
        fontSize: 12,
        color: '#7f8c8d',
        marginLeft: 4,
    },
    offerInfo: {
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#27ae60',
        marginBottom: 8,
    },
    estimateContainer: {
        alignItems: 'center',
    },
    estimateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    estimateText: {
        fontSize: 12,
        color: '#7f8c8d',
        marginLeft: 4,
        fontWeight: '500',
    },
    detailsContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    detailText: {
        fontSize: 13,
        color: '#2c3e50',
        marginLeft: 8,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    rejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e74c3c',
        gap: 6,
    },
    rejectText: {
        color: '#e74c3c',
        fontSize: 14,
        fontWeight: '600',
    },
    acceptButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FC7700',
        gap: 6,
    },
    acceptButtonCar: {
        backgroundColor: '#4CAF50', // Verde para carros
    },
    acceptButtonMoto: {
        backgroundColor: '#E91E63', // Rosa para motos
    },
    acceptText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos antigos mantidos para compatibilidade
    row: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 10
    },
    infoDriver: {
        marginLeft: 10,
        flex: 1
    },
    rowButtons: {
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    time: {
        fontWeight: 'bold'
    },
    distance: {
        fontWeight: 'bold'
    },
    // Novos estilos para diferenciação de veículos
    driverNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    vehicleTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        gap: 4,
        marginRight: 8
    },
    carBadge: {
        backgroundColor: '#4CAF50',
    },
    motoBadge: {
        backgroundColor: '#E91E63',
    },
    vehicleTypeBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
});