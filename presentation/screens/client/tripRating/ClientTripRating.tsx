import { Text, ToastAndroid, TouchableOpacity, View, ScrollView, Animated, StatusBar } from "react-native";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { container } from "../../../../di/container";
import { ClientTripRatingViewModel } from "./ClientTripRatingViewModel";
import { useState, useEffect, useRef } from "react";
import styles from './Styles';
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { DrawerMenuButton } from "../../../components/DrawerMenuButton";

interface Props extends StackScreenProps<ClientMapStackParamList, 'ClientTripRatingScreen'> { };

export function ClientTripRatingScreen({ navigation, route }: Props) {

    const { clientRequest } = route.params;
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const viewModel: ClientTripRatingViewModel = container.resolve('clientTripRatingViewModel');
    const [rating, setRating] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
        }, [])
    );

    const handleUpdateDriverRating = async () => {
        if (rating === 0) {
            ToastAndroid.show('Por favor, selecione uma avaliação', ToastAndroid.LONG);
            return;
        }
        const response = await viewModel.updateDriverRating(clientRequest.id, rating);
        if (typeof response === 'boolean') {
            ToastAndroid.show('Avaliação enviada com sucesso!', ToastAndroid.LONG);

            // Limpar todos os estados relacionados ao socket e mapa
            await Promise.all([
                AsyncStorage.removeItem('clientMapState'),
                AsyncStorage.removeItem('driverPosition'),
                AsyncStorage.removeItem('activeTrip')
            ]);

            console.log('Client request type:', clientRequest.clientRequestType);

            if (clientRequest.clientRequestType === 'delivery') {
                rootNavigation.replace('DeliveryPackageClientSearchMapScreen');
            } else {
                rootNavigation.replace('ClientHomeScreen');
            }

        }
    }

    return (
        <View style={styles.modernContainer}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
            {/* BOTÃO PARA ABRIR O DRAWER */}
            <DrawerMenuButton />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <Animated.View style={[
                    styles.contentContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}>
                    {/* Success Icon */}
                    <View style={styles.successIconContainer}>
                        <View style={styles.successIconBackground}>
                            <Ionicons
                                name="checkmark-circle"
                                size={80}
                                color="#4CAF50"
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.modernTitle}>Viagem Concluída! 🎉</Text>
                    <Text style={styles.subtitle}>Esperamos que tenha gostado da experiência</Text>

                    {/* Trip Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.cardTitle}>📍 Resumo da Viagem</Text>

                        <View style={styles.routeContainer}>
                            <View style={styles.routeItem}>
                                <View style={styles.fromDot} />
                                <View style={styles.routeInfo}>
                                    <Text style={styles.routeLabel}>Origem</Text>
                                    <Text style={styles.routeText}>{clientRequest.pickup_description}</Text>
                                </View>
                            </View>

                            <View style={styles.routeLine} />

                            <View style={styles.routeItem}>
                                <View style={styles.toDot} />
                                <View style={styles.routeInfo}>
                                    <Text style={styles.routeLabel}>Destino</Text>
                                    <Text style={styles.routeText}>{clientRequest.destination_description}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Fare Display */}
                        <View style={styles.fareContainer}>
                            <Text style={styles.fareLabel}>💰 Total Pago</Text>
                            <Text style={styles.fareValue}>R$ {clientRequest.fare_offered}</Text>
                        </View>
                    </View>

                    {/* Rating Section */}
                    <View style={styles.ratingCard}>
                        <Text style={styles.ratingTitle}>⭐ Avalie seu Motorista</Text>
                        <Text style={styles.ratingSubtitle}>Sua opinião é importante para nós</Text>

                        <View style={styles.modernStarContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={[
                                        styles.modernStarButton,
                                        star <= rating && styles.selectedStar
                                    ]}
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
                            <Animated.Text style={styles.ratingText}>
                                {rating === 1 && "😞 Precisa melhorar"}
                                {rating === 2 && "😐 Regular"}
                                {rating === 3 && "🙂 Bom"}
                                {rating === 4 && "😊 Muito bom"}
                                {rating === 5 && "🤩 Excelente!"}
                            </Animated.Text>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        rating > 0 ? styles.submitButtonActive : styles.submitButtonInactive
                    ]}
                    onPress={handleUpdateDriverRating}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.submitButtonText}>
                        {rating > 0 ? 'Enviar Avaliação' : 'Selecione uma Avaliação'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}