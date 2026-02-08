import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Animated, Easing, Text, Dimensions, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigator/MainStackNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { LoginViewModel } from '../auth/login/LoginViewModel';
import { container } from '../../../di/container';

const { width, height } = Dimensions.get('window');

interface Props extends StackScreenProps<RootStackParamList, 'SplashScreen'> { };

export default function SplashScreen({ navigation }: Props) {
    const { authResponse, removeAuthSession } = useAuth();
    const loginViewModel: LoginViewModel = container.resolve('loginViewModel');

    // Função para verificar se o token JWT ainda é válido
    const isTokenExpired = (token: string): boolean => {
        try {
            // Decodifica o JWT para verificar a expiração
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Verifica se o token expirou (exp é em segundos)
            return payload.exp < currentTime;
        } catch (error) {
            console.log('🔒[SPLASH] Erro ao verificar token JWT:', error);
            // Se não conseguir decodificar, considera como expirado por segurança
            return true;
        }
    };

    // Função para validar a sessão atual
    const validateCurrentSession = async (): Promise<boolean> => {
        if (!authResponse || !authResponse.token) {
            console.log('🔒[SPLASH] Nenhuma sessão ou token encontrado');
            return false;
        }

        // Verifica se o token JWT expirou
        if (isTokenExpired(authResponse.token)) {
            console.log('🔒[SPLASH] Token JWT expirado - tentando renovar com refresh token');
            
            // Verifica se existe refresh_token
            if (!authResponse.refresh_token) {
                console.log('❌[SPLASH] Nenhum refresh token disponível');
                Alert.alert(
                    'Sessão Expirada',
                    'Sua sessão expirou. Por favor, faça login novamente.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await removeAuthSession();
                                navigation.replace('LoginScreen');
                            }
                        }
                    ]
                );
                return false;
            }

            try {
                // Tenta renovar o token usando o refresh token
                console.log('🔄[SPLASH] Tentando renovar token...');
                const refreshResult = await loginViewModel.refresh(authResponse.refresh_token);

                if ('token' in refreshResult) {
                    console.log('✅[SPLASH] Token renovado com sucesso');
                    // A sessão será atualizada automaticamente pelo contexto
                    // pois o refresh retorna um AuthResponse completo
                    return true;
                } else {
                    // Erro ao renovar token
                    console.log('❌[SPLASH] Erro ao renovar token:', refreshResult.message);
                    Alert.alert(
                        'Sessão Expirada',
                        'Não foi possível renovar sua sessão. Por favor, faça login novamente.',
                        [
                            {
                                text: 'OK',
                                onPress: async () => {
                                    await removeAuthSession();
                                    navigation.replace('LoginScreen');
                                }
                            }
                        ]
                    );
                    return false;
                }
            } catch (error) {
                console.log('❌[SPLASH] Erro ao tentar renovar token:', error);
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro ao renovar sua sessão. Por favor, faça login novamente.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await removeAuthSession();
                                navigation.replace('LoginScreen');
                            }
                        }
                    ]
                );
                return false;
            }
        }

        console.log('🔒[SPLASH] Token JWT válido - sessão mantida');
        return true;
    };

    // Animações Premium
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideUpAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const particleAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const backgroundZoomAnim = useRef(new Animated.Value(1)).current;

    // Inicializar animações premium
    useEffect(() => {
        // Sequência de animações orquestrada
        const startAnimations = () => {
            // 1. Background zoom in sutil
            Animated.timing(backgroundZoomAnim, {
                toValue: 1.1,
                duration: 8000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();

            // 2. Logo entrance (dramatic)
            Animated.sequence([
                Animated.delay(300),
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1400,
                        easing: Easing.out(Easing.back(1.4)),
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideUpAnim, {
                        toValue: 0,
                        duration: 1200,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ])
            ]).start();

            // 3. Glow effect (breathing)
            setTimeout(() => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(glowAnim, {
                            toValue: 1,
                            duration: 2000,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(glowAnim, {
                            toValue: 0,
                            duration: 2000,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }, 800);

            // 4. Progress bar animation
            setTimeout(() => {
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: false,
                }).start();
            }, 1000);

            // 5. Particle system
            setTimeout(() => {
                Animated.loop(
                    Animated.timing(particleAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();
            }, 1200);

            // 6. Wave animation
            Animated.loop(
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ).start();

            // 7. Rotation for loading indicator (smooth)
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // 8. Subtle pulse for logo
            setTimeout(() => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.03,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }, 1500);
        };

        startAnimations();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
        }, [])
    );

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (authResponse !== null && authResponse !== undefined) {
                console.log('🔒[SPLASH] Validando sessão existente...');

                // Primeiro valida se o token ainda é válido
                const isSessionValid = await validateCurrentSession();
                if (!isSessionValid) {
                    // Se a sessão não é válida, a função validateCurrentSession já trata a navegação
                    return;
                }

                const hasDriverRole = authResponse.user.roles?.some(role => role.id === 'DRIVER');

                if (hasDriverRole) {
                    if ('vehicles' in authResponse && (!authResponse.vehicles || authResponse.vehicles.length === 0)) {
                        navigation.replace('VehicleRegisterScreen');
                        return;
                    }
                }

                if (authResponse.user.roles?.some(role => role.id === 'ADMIN')) {
                    navigation.replace('AdminScreen');
                    return;
                }

                if (authResponse.user.roles!.length > 1) {
                    console.log('NAVEGANDO PARA: RolesScreen (múltiplos papéis)');
                    navigation.replace('RolesScreen');
                    return;
                } else {
                    const roleId = authResponse.user.roles![0].id;
                    if (roleId === 'CLIENT') {
                        console.log('NAVEGANDO PARA: ClientHomeScreen');
                        navigation.replace('ClientHomeScreen');
                    } else if (roleId === 'DRIVER') {
                        console.log('NAVEGANDO PARA: DriverHomeScreen');
                        navigation.replace('DriverHomeScreen');
                    }
                    return;
                }
            } else if (authResponse === null) {
                console.log('Nenhuma sessão encontrada, navegando para Login');
                navigation.replace('LoginScreen');
            }
            // Se authResponse === undefined, ainda está carregando, então aguarda
        };

        // Aguarda um tempo para dar chance do contexto carregar
        const timer = setTimeout(checkAuthStatus, 1500);

        return () => clearTimeout(timer);
    }, [authResponse, navigation]);

    // Interpolações das animações premium
    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.9],
    });

    const particleY = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [height + 50, -50],
    });

    const waveScale = waveAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                {/* Background com zoom dinâmico */}
                <Animated.View style={[
                    styles.backgroundContainer,
                    {
                        transform: [{ scale: backgroundZoomAnim }]
                    }
                ]}>
                    <Image
                        style={styles.imageBackground}
                        source={require('../../../assets/city.jpg')}
                    />
                    <View style={styles.backgroundOverlay} />
                </Animated.View>

                {/* Partículas flutuantes */}
                <Animated.View style={[
                    styles.particleContainer,
                    {
                        transform: [{ translateY: particleY }]
                    }
                ]}>
                    {[...Array(6)].map((_, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.particle,
                                {
                                    left: `${15 + index * 12}%`,
                                    opacity: fadeAnim,
                                    transform: [{
                                        scale: waveAnim.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0.8 + index * 0.05, 1.1, 0.9 + index * 0.05],
                                        })
                                    }]
                                }
                            ]}
                        />
                    ))}
                </Animated.View>

                {/* Ondas de fundo */}
                <Animated.View style={[
                    styles.waveContainer,
                    {
                        opacity: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.4],
                        }),
                        transform: [{ scale: waveScale }]
                    }
                ]}>
                    <View style={styles.wave1} />
                    <View style={styles.wave2} />
                    <View style={styles.wave3} />
                </Animated.View>

                {/* Container principal - removido glow laranja */}
                <Animated.View style={[
                    styles.logoMainContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: Animated.multiply(scaleAnim, pulseAnim) },
                            { translateY: slideUpAnim }
                        ]
                    }
                ]}>
                    {/* Conteúdo removido - apenas loading sofisticado */}
                </Animated.View>

                {/* Loading indicator premium */}
                <Animated.View style={[
                    styles.loadingSection,
                    {
                        opacity: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    }
                ]}>
                    {/* Spinner customizado */}
                    <Animated.View style={[
                        styles.spinnerContainer,
                        {
                            transform: [{ rotate: rotateInterpolation }]
                        }
                    ]}>
                        <View style={styles.spinnerRing}>
                            {[...Array(8)].map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.spinnerDot,
                                        {
                                            transform: [
                                                { rotate: `${index * 45}deg` },
                                                { translateY: -20 }
                                            ],
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                    </Animated.View>

                    {/* Progress bar premium */}
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                            <Animated.View style={[
                                styles.progressBarFill,
                                { width: progressWidth }
                            ]} />
                        </View>
                        <Animated.Text style={[
                            styles.progressText,
                            { opacity: fadeAnim }
                        ]}>
                            {/* Texto removido - loading sofisticado */}
                        </Animated.Text>
                    </View>
                </Animated.View>

                {/* Bottom branding */}
                <Animated.View style={[
                    styles.brandingContainer,
                    {
                        opacity: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.3],
                        }),
                    }
                ]}>
                    {/* Branding minimalista */}
                    <Text style={styles.versionText}>v1.0</Text>
                </Animated.View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    // Background Premium
    backgroundContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backgroundOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    // Partículas e Efeitos
    particleContainer: {
        position: 'absolute',
        width: '100%',
        height: height + 100,
        zIndex: 1,
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FC7700',
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 5,
    },

    // Ondas de fundo
    waveContainer: {
        position: 'absolute',
        width: width * 2,
        height: width * 2,
        left: -width / 2,
        top: -width / 2,
        zIndex: 1,
    },
    wave1: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: width,
        borderWidth: 1,
        borderColor: 'rgba(252, 119, 0, 0.1)',
    },
    wave2: {
        position: 'absolute',
        width: '80%',
        height: '80%',
        borderRadius: width * 0.8,
        borderWidth: 1,
        borderColor: 'rgba(252, 119, 0, 0.15)',
        top: '10%',
        left: '10%',
    },
    wave3: {
        position: 'absolute',
        width: '60%',
        height: '60%',
        borderRadius: width * 0.6,
        borderWidth: 1,
        borderColor: 'rgba(252, 119, 0, 0.2)',
        top: '20%',
        left: '20%',
    },

    // Logo Principal
    logoMainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        position: 'relative',
    },
    logoGlow: {
        position: 'absolute',
        width: 300,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FC7700',
        opacity: 0.3,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 50,
        elevation: 20,
        // Removido - não usado mais
        display: 'none',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        // Removido - não usado mais
        display: 'none',
    },
    imageLogo: {
        width: 220,
        height: 80,
        resizeMode: 'contain',
        // Removido - não usado mais
        display: 'none',
    },

    // Subtitle
    subtitleContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    subtitleText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '300',
        letterSpacing: 2,
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.9,
    },

    // Loading Section
    loadingSection: {
        position: 'absolute',
        bottom: height * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        width: '100%',
    },

    // Spinner Premium
    spinnerContainer: {
        marginBottom: 30,
    },
    spinnerRing: {
        width: 50,
        height: 50,
        position: 'relative',
    },
    spinnerDot: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FC7700',
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },

    // Progress Bar Premium
    progressBarContainer: {
        alignItems: 'center',
        width: width * 0.7,
    },
    progressBarBackground: {
        width: '100%',
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FC7700',
        borderRadius: 2,
        position: 'absolute',
        left: 0,
        top: 0,
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3,
    },
    progressText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: '300',
        marginTop: 15,
        letterSpacing: 1,
    },

    // Branding
    brandingContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        zIndex: 3,
    },
    versionText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '300',
        marginBottom: 5,
    },
    copyrightText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        fontWeight: '300',
        letterSpacing: 1,
    },

    // Legacy styles (mantidos para compatibilidade)
    loadingContainer: {
        position: 'absolute',
        bottom: 150,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    loadingRing: {
        width: 60,
        height: 60,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingDot1: {
        position: 'absolute',
        top: 0,
        left: '50%',
        marginLeft: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FC7700',
        shadowColor: '#FC7700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingDot2: {
        position: 'absolute',
        right: 0,
        top: '50%',
        marginTop: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF9800',
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingDot3: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        marginLeft: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFC107',
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingDot4: {
        position: 'absolute',
        left: 0,
        top: '50%',
        marginTop: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFD54F',
        shadowColor: '#FFD54F',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 3,
    },
});
