import React, { useState, useEffect, useRef } from "react";
import { Text, ToastAndroid, TouchableOpacity, View, ScrollView, Dimensions, Animated } from "react-native";
import { DriverMapStackParamList } from "../../../navigator/DriverMapStackNavigator";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import styles from './Styles';
import { Ionicons } from "@expo/vector-icons";
import { container } from "../../../../di/container";
import { DriverTripRatingViewModel } from "./DriverTripRatingViewModel";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";

interface Props extends StackScreenProps<DriverMapStackParamList, 'DriverTripRatingScreen'> { };

export function DriverTripRatingScreen({ navigation, route }: Props) {

    const { clientRequest } = route.params;
    const viewModel: DriverTripRatingViewModel = container.resolve('driverTripRatingViewModel');
    const [rating, setRating] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

    const handleUpdateClientRating = async () => {
        if (rating === 0) {
            ToastAndroid.show('Por favor, selecione uma avaliação', ToastAndroid.LONG);
            return;
        }

        const response = await viewModel.updateClientRating(clientRequest.id, rating);

        if (typeof response === 'boolean') {
            ToastAndroid.show('Avaliação enviada com sucesso!', ToastAndroid.LONG);
            rootNavigation.replace('DriverHomeScreen');
        }
    }

    return (
        <View style={styles.modernContainer}>
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
                    <Text style={styles.modernTitle}>Viagem Concluída! 🚗</Text>
                    <Text style={styles.subtitle}>Obrigado por dirigir com segurança!</Text>

                    {/* Trip Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.cardTitle}>🏁 Resumo da Corrida</Text>
                        <View style={styles.routeContainer}>
                            <View style={styles.routeItem}>
                                <View style={styles.fromDot} />
                                <View style={styles.routeInfo}>
                                    <Text style={styles.routeLabel}>Partida</Text>
                                    <Text style={styles.routeText}>{clientRequest.pickup_description}</Text>
                                </View>
                            </View>
                            <View style={styles.routeLine} />
                            <View style={styles.routeItem}>
                                <View style={styles.toDot} />
                                <View style={styles.routeInfo}>
                                    <Text style={styles.routeLabel}>Chegada</Text>
                                    <Text style={styles.routeText}>{clientRequest.destination_description}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Earnings Display */}
                        <View style={styles.earningsContainer}>
                            <Text style={styles.earningsLabel}>💰 Seus Ganhos</Text>
                            <Text style={styles.earningsValue}>R$ {clientRequest.fare_offered}</Text>
                        </View>
                    </View>

                    {/* Rating Section */}
                    <View style={styles.ratingCard}>
                        <Text style={styles.ratingTitle}>⭐ Avalie seu Passageiro</Text>
                        <Text style={styles.ratingSubtitle}>Como foi a experiência com esse cliente?</Text>
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
                                {rating === 1 && "😞 Experiência difícil"}
                                {rating === 2 && "😐 Passageiro regular"}
                                {rating === 3 && "🙂 Passageiro ok"}
                                {rating === 4 && "😊 Bom passageiro"}
                                {rating === 5 && "🤩 Passageiro exemplar!"}
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
                    onPress={handleUpdateClientRating}
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