import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, ToastAndroid } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LoginViewModel } from "../auth/login/LoginViewModel";
import { container } from "../../../di/container";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get('window');

const options = [
    {
        key: 'ClientHomeScreen',
        label: 'Viagem Simples',
        description: 'Corrida rápida para qualquer destino',
        icon: <Ionicons name="car-sport" size={36} color="#fff" />,
        gradient: ["#388E3C", "#4CAF50"],
    }
];

export default function SelectClientScreen({ navigation }: any) {
    const { authResponse, removeAuthSession } = useAuth();
    const loginViewModel: LoginViewModel = container.resolve('loginViewModel');

    useFocusEffect(
        React.useCallback(() => {
            const checkSession = async () => {
                try {
                    if (authResponse?.session_id) {
                        await loginViewModel.checkSession(authResponse.session_id);
                    }
                } catch (error: any) {
                    if (error.response?.status === 401) {
                        ToastAndroid.show('Sessão expirada. Faça login novamente.', ToastAndroid.LONG);
                        await removeAuthSession();
                        navigation.replace('LoginScreen');
                    }
                }
            };

            checkSession();
        }, [])
    );


    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                    return true;
                }
                return false;
            };
            
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation])
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ImageBackground
                source={require("../../../assets/city.jpg")}
                style={styles.background}
                blurRadius={2}
            >
                <View style={styles.overlay} />
                <Text style={styles.title}>Escolha o tipo de serviço</Text>
                <Text style={styles.subtitle}>O que você deseja fazer?</Text>
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={[styles.optionButton, { backgroundColor: option.gradient[0] }]}
                            activeOpacity={0.85}
                            onPress={() => navigation.replace(option.key)}
                        >
                            <View style={styles.iconContainer}>{option.icon}</View>
                            <View style={styles.textContainer}>
                                <Text style={styles.optionLabel}>{option.label}</Text>
                                <Text style={styles.optionDescription}>{option.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.chevron} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ImageBackground>
            <View style={styles.bottomBar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
    },
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.55)",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginTop: 60,
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        marginBottom: 32,
        opacity: 0.85,
    },
    optionsContainer: {
        width: width * 0.92,
        alignSelf: "center",
        marginTop: 8,
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 18,
        marginBottom: 18,
        paddingVertical: 22,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "rgba(255,255,255,0.13)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 18,
    },
    textContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    optionDescription: {
        fontSize: 15,
        color: "#f5f5f5",
        opacity: 0.85,
    },
    chevron: {
        marginLeft: 12,
    },
});
