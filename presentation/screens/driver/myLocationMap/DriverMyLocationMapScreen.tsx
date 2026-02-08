// ARQUIVO: presentation/screens/driver/myLocationMap/DriverMyLocationMapScreen.tsx
// AUTOR: PARTIU DEV TEAM | HUGO PORTO
// DATA: 19-12-2025
// DESCRIÇÃO: TELA DE LOCALIZAÇÃO DO MOTORISTA COM MAPA, STATUS, CONFIGURAÇÕES E SOLICITAÇÕES

// ===============================
// 1️⃣ REACT (SEMPRE PRIMEIRO)
// ===============================
import React, { useEffect, useRef, useState } from "react";

// ===============================
// 2️⃣ REACT NATIVE CORE
// ===============================
import {
    Alert,
    Animated,
    FlatList,
    Image,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ToastAndroid
} from "react-native";

// ===============================
// 2️⃣.1️⃣ DETECÇÃO DE REDE
// ===============================
import NetInfo from '@react-native-community/netinfo';

// ===============================
// 3️⃣ NAVEGAÇÃO
// ===============================
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// ===============================
// 4️⃣ MAPAS
// ===============================
import MapView, { Marker, Region, Camera } from "react-native-maps";

// ===============================
// 5️⃣ EXPO / APIS NATIVAS
// ===============================
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import * as KeepAwake from "expo-keep-awake";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

// ===============================
// 6️⃣ STORAGE
// ===============================
import AsyncStorage from "@react-native-async-storage/async-storage";

// ===============================
// 7️⃣ ÍCONES
// ===============================
import { Ionicons } from "@expo/vector-icons";

// ===============================
// 8️⃣ BIBLIOTECAS DE TERCEIROS
// ===============================
import ToggleSwitch from "toggle-switch-react-native";

// ===============================
// 9️⃣ NAVEGADORES / TIPOS
// ===============================
import { RootStackParamList } from "../../../navigator/MainStackNavigator";

// ===============================
// 🔟 HOOKS / CONTEXTS
// ===============================
import { useAuth } from "../../../hooks/useAuth";

// ===============================
// 1️⃣1️⃣ MODELS / DOMAIN
// ===============================
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { DriverPosition } from "../../../../domain/models/DriverPosition";

// ===============================
// 1️⃣2️⃣ VIEWMODELS / DI
// ===============================
import { container } from "../../../../di/container";
import { DriverMyLocationMapViewModel } from "./DriverMyLocationMapViewModel";
import { ProfileUpdateViewModel } from "../../profile/update/ProfileUpdateViewModel";
import { VehicleRegisterViewModel } from "../../vehicle/VehicleRegisterViewModel";
import { DriverClientRequestViewModel } from "../clientRequest/DriverClientRequestViewModel";

// ===============================
// 1️⃣3️⃣ COMPONENTES / MODAIS
// ===============================
import MapThemeModal from "../../../components/modals/MapThemeModal";
import CPFModal from "../../../components/modals/CPFModal";
import { LogoutModal } from "../../../components/modals/LogoutModal";
import { DocumentsModal } from "../../../components/modals/DocumentsModal";
import { BalanceRequestsModal } from "../../../components/modals/BalanceRequestsModal";
import { DriverClientRequestItemToDriverMyLocation } from "../clientRequest/DriverClientRequestItemToDriverMyLocation";

// ===============================
// 1️⃣4️⃣ ESTILOS
// ===============================
import styles, { darkMapStyle } from "./Styles";
import { orangeMapStyle } from "../../client/searchMap/Styles";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";

export default function DriverMyLocationMapScreen() {
    // ===============================
    // 1️⃣ CONSTANTES FIXAS
    // ===============================
    const defaultRegion: Region = {
        latitude: -14.2350,
        longitude: -51.9253,
        latitudeDelta: 35,
        longitudeDelta: 35
    };

    // ===============================
    // 2️⃣ HOOKS DE CONTEXTO / NAVEGAÇÃO
    // ===============================
    const rootNavigation =
        useNavigation<StackNavigationProp<RootStackParamList>>();

    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();

    // ===============================
    // 3️⃣ DEPENDÊNCIAS INJETADAS (DI)
    // ===============================
    const viewModel: DriverMyLocationMapViewModel =
        container.resolve('driverMyLocationMapViewModel');

    const vehicleRegisterViewModel: VehicleRegisterViewModel =
        container.resolve('vehicleRegisterViewModel');

    const driverClientRequestViewModel: DriverClientRequestViewModel =
        container.resolve('driverClientRequestViewModel');

    const profileViewModel: ProfileUpdateViewModel =
        container.resolve('profileUpdateViewModel');

    // ===============================
    // 4️⃣ ESTADOS (useState) — AGRUPADOS
    // ===============================

    // 🔹 MAPA / LOCALIZAÇÃO
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [initialRegion, setInitialRegion] = useState<Region>(defaultRegion);
    const [isLoadingInitialRegion, setIsLoadingInitialRegion] = useState(true);
    const [tracking, setTracking] = useState<boolean>(false);
    const [mapTheme, setMapTheme] = useState<'dark' | 'orange'>('orange');
    const [isUserDragging, setIsUserDragging] = useState(false);
    const [showRecenterButton, setShowRecenterButton] = useState(false);

    // 🔹 SALDO / PIX
    const [ganhos, setGanhos] = useState(0);
    const [creditos, setCreditos] = useState(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isAddingBalance, setIsAddingBalance] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showValueSelect, setShowValueSelect] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [qrCodeBase64, setQrCodeBase64] = useState('');
    const [ticketUrl, setTicketUrl] = useState('');
    const [isLoadingPix, setIsLoadingPix] = useState(false);

    // 🔹 MODAIS GERAIS
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalCPFVisible, setModalCPFVisible] = useState(false);
    const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
    const [isBalanceRequestsModalVisible, setBalanceRequestsModalVisible] = useState(false);
    const [isMapThemeModalVisible, setMapThemeModalVisible] = useState(false);
    const [isAboutModalVisible, setAboutModalVisible] = useState(false);
    const [isHelpModalVisible, setHelpModalVisible] = useState(false);
    const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
    const [isDocumentsModalVisible, setDocumentsModalVisible] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // 🔹 SOLICITAÇÕES DE CLIENTES
    const [isClientRequestsModalVisible, setClientRequestsModalVisible] = useState(false);
    const [clientRequestResponse, setClientRequestResponse] = useState<ClientRequestResponse[]>([]);
    const [isRefreshingRequests, setIsRefreshingRequests] = useState(false);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);

    // 🔹 TEMPORIZADOR PRINCIPAL (5 MIN)
    const [timerSeconds, setTimerSeconds] = useState(300);
    const [isTimerActive, setIsTimerActive] = useState(false);

    // 🔹 TEMPORIZADOR DE PAUSA (10s)
    const [pauseSeconds, setPauseSeconds] = useState(10);
    const [isPauseActive, setIsPauseActive] = useState(false);

    // 🔹 TEMPORIZADOR DE STARTUP (6s)
    const [startupSeconds, setStartupSeconds] = useState(6);
    const [isStartupActive, setIsStartupActive] = useState(false);

    // 🔹 CONEXÃO COM INTERNET E SOCKET
    const [isOnline, setIsOnline] = useState(true);
    const [showOfflineAlert, setShowOfflineAlert] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

    // ===============================
    // 5️⃣ REFS (useRef)
    // ===============================

    // 🔹 MAPA
    const mapRef = useRef<MapView>(null);

    // 🔹 LOCALIZAÇÃO
    let locationSubscription = useRef<Location.LocationSubscription | null>(null);

    // 🔹 CONTROLE GPS / TRACKING
    const isGPSActive = useRef<boolean>(false);
    const isCreatingSubscription = useRef(false);
    const lastCenterPosition = useRef<{ latitude: number; longitude: number } | null>(null);

    // 🔹 TEMPORIZADORES
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pauseIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startupIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isTimerInitialized = useRef(false);

    // 🔹 AUTO FOLLOW (ESTILO WAZE)
    const autoFollowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 🔹 CONTROLE DE RECONEXÃO
    const isReconnecting = useRef<boolean>(false);
    const lastReconnectAttempt = useRef<number>(0);
    const reconnectAttempts = useRef<number>(0);
    const reconnectionTimeout = useRef<NodeJS.Timeout | null>(null);
    const socketHealthCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000; // 3 segundos

    // 🔹 ANIMAÇÕES
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // ===============================
    // 6️⃣ ÁUDIO / NOTIFICAÇÕES
    // ===============================
    const player = useAudioPlayer(
        require('../../../../assets/sounds/332651__ebcrosby__notification-2.wav')
    );

    // ============================================================
    // ========== ESCUTAR EVENTOS DE EXPIRAÇÃO DO SOCKET ==========
    // ============================================================
    useEffect(() => {
        const handleTokenExpired = async () => {
            console.log('=========================================');
            console.log('FILE: DriverMyLocationMapScreen.tsx');
            console.log('🔄 TOKEN EXPIRADO, RENOVANDO...');
            console.log('=========================================');

            const renewed = await viewModel.refreshSocketToken();

            // SE NÃO RENOVOU, FORÇA LOGOUT
            if (!renewed) {
                Alert.alert(
                    'Sessão Expirada',
                    'Sua sessão expirou. Faça login novamente.',
                    [{
                        text: 'OK', onPress: () => {
                            removeAuthSession();
                            rootNavigation.replace('LoginScreen');
                        }
                    }]
                );
            } else {
                // ✅ IMPORTANTE: RECARREGAR A SESSÃO DO STORAGE PARA O CONTEXTO
                const localStorage = new LocalStorage();
                const newAuthData = await localStorage.getItem('auth');

                if (newAuthData) {
                    const parsedAuth = JSON.parse(newAuthData);
                    saveAuthSession(parsedAuth); // 🎯 ATUALIZA O CONTEXTO!
                }
            }
        };

        viewModel.onTokenExpired(handleTokenExpired);

        return () => {
            viewModel.removeTokenExpiredListener(handleTokenExpired);
        };
    }, []);

    useEffect(() => {
        if (tracking) {
            // INICIAR RENOVAÇÃO PREVENTIVA A CADA 45 MINUTOS
            const refreshInterval = setInterval(async () => {
                console.log('=========================================');
                console.log('FILE: DriverMyLocationMapScreen.tsx');
                console.log('🔄 RENOVAÇÃO PREVENTIVA DE TOKEN...');
                console.log('=========================================');
                await viewModel.refreshSocketToken();
            }, 45 * 60 * 1000); // 45 MINUTOS

            return () => clearInterval(refreshInterval);
        }
    }, [tracking]);

    // SE VOCÊ QUISER ALGO MAIS SIMPLES, PODE FAZER APENAS:
    // A CADA 30 MINUTOS, VERIFICAR E RENOVAR SE NECESSÁRIO
    // setInterval(async () => {
    //     if (tracking && isTokenExpiring()) {
    //         await refreshToken();
    //     }
    // }, 30 * 60 * 1000);

    // ============================================================================
    // ============ CRIA POSIÇÃO INICIAL DO MOTORISTA NO SERVIDOR =================
    // ================ ATIVA KEEP AWAKE (TELA NÃO ESCURECE) ======================
    // ===== BUSCA LOCALIZAÇÃO PARA CENTRALIZAR O MAPA NA CIDADE DO MOTORISTA =====
    // ============================================================================
    useFocusEffect(
        React.useCallback(() => {
            const getCurrentLocationCityAndCreateFirstDriverPosition = async () => {
                try {
                    setIsLoadingInitialRegion(true);

                    let { status } = await Location.requestForegroundPermissionsAsync();

                    if (status !== 'granted') {
                        Alert.alert(
                            'Permissão Negada',
                            'O aplicativo precisa de permissão para acessar a localização.'
                        );
                        return;
                    }

                    if (Platform.OS === 'android') {
                        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                        if (backgroundStatus !== 'granted') {
                            Alert.alert(
                                'Permissão de Background Negada',
                                'O aplicativo precisa de permissão de localização "Permitir o tempo todo" para funcionar corretamente.',
                                [{ text: 'OK' }]
                            );
                            return;
                        }
                    } else if (Platform.OS === 'ios') {
                        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                        if (backgroundStatus !== 'granted') {
                            Alert.alert(
                                'Permissão de Background Negada',
                                'O aplicativo precisa de permissão "Sempre" nas configurações de localização para funcionar corretamente.',
                                [{ text: 'OK' }]
                            );
                            return;
                        }
                    }

                    // BUSCA LOCALIZAÇÃO ATUAL
                    const currentLocation = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });

                    // CRIA PRIMEIRA POSIÇÃO DO MOTORISTA NO SERVIDOR
                    await viewModel.createDriverPosition({
                        id_driver: authResponse!.user.id!,
                        lat: currentLocation.coords.latitude,
                        lng: currentLocation.coords.longitude
                    });

                    // CONFIGURA ZOOM DE CIDADE (NÃO MUITO PRÓXIMO, NÃO MUITO LONGE)
                    const cityRegion: Region = {
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    };

                    setInitialRegion(cityRegion);

                    // ANIMA PARA A CIDADE SE O MAPA JÁ ESTIVER MONTADO
                    if (mapRef.current) {
                        mapRef.current.animateToRegion(cityRegion, 1500);
                    }
                } catch (error) {
                    console.log('============================================');
                    console.log('FILE: DriverMyLocationMapScreen.tsx');
                    console.log('🎯[DRIVER_MAP] ⚠️ ERRO AO BUSCAR LOCALIZAÇÃO DA CIDADE: ', error);
                    console.error('🎯[DRIVER_MAP] ⚠️ ERRO AO BUSCAR LOCALIZAÇÃO DA CIDADE: ', error);
                    console.log('============================================');
                } finally {
                    setIsLoadingInitialRegion(false);
                }
            };

            const activateKeepAwake = async () => {
                try {
                    await KeepAwake.activateKeepAwakeAsync();
                } catch (error) {
                    console.log('=============================================');
                    console.log('FILE: DriverMyLocationMapScreen.tsx');
                    console.log('❌ ERRO AO ATIVAR KEEP AWAKE: ', error);
                    console.error('❌ ERRO AO ATIVAR KEEP AWAKE: ', error);
                    console.log('=============================================');
                }
            };

            activateKeepAwake();
            getCurrentLocationCityAndCreateFirstDriverPosition();
        }, [])
    );

    // ===============================================================================
    // ============ CONFIGURA MODO DE ÁUDIO PARA TOCAR EM SILENCIOSO(IOS) ============
    // ===============================================================================
    useEffect(() => {
        (async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: false,
                });
            } catch (error) {
                console.log('=============================================');
                console.log('FILE: DriverMyLocationMapScreen.tsx');
                console.log('ERRO AO CONFIGURAR MODO DE ÁUDIO: ', error);
                console.error('ERRO AO CONFIGURAR MODO DE ÁUDIO: ', error);
                console.log('=============================================');
            }
        })();
    }, []);

    useEffect(() => {
        if (isCreatingSubscription.current) return;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão Negada',
                    'O aplicativo precisa de permissão para acessar a localização.'
                );
                return;
            }

            if (Platform.OS === 'android') {
                const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                if (backgroundStatus !== 'granted') {
                    Alert.alert(
                        'Permissão de Background Negada',
                        'O aplicativo precisa de permissão de localização "Permitir o tempo todo" para funcionar corretamente.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
            } else if (Platform.OS === 'ios') {
                const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                if (backgroundStatus !== 'granted') {
                    Alert.alert(
                        'Permissão de Background Negada',
                        'O aplicativo precisa de permissão "Sempre" nas configurações de localização para funcionar corretamente.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
            }

            // SE MODAL CPF ESTÁ VISÍVEL OU NÃO TEM CPF OU NÃO TEM CRÉDITOS, PARA O TRACKING
            if (!isLoadingBalance && (isModalCPFVisible || !hasCpf() || !hasCredits())) {
                if (locationSubscription.current) {
                    await stopRealTimeLocation();
                }

                return;
            }

            // VERIFICAÇÃO CRÍTICA: IMPEDE MÚLTIPLAS SUBSCRIPTIONS
            if (tracking && locationSubscription.current) {
                console.log('============================================');
                console.log('FILE: DriverMyLocationMapScreen.tsx');
                console.log('🔄[USEEFFECT#4] ⚠️ SUBSCRIPTION JÁ EXISTE - PULANDO INICIALIZAÇÃO');
                console.log('============================================');
                return;
            }

            // SE TRACKING ESTÁ ATIVO E NÃO HÁ SUBSCRIPTION ATIVA, INICIA
            if (tracking && !locationSubscription.current) {
                isCreatingSubscription.current = true; // ← TRAVA
                console.log('============================================');
                console.log('FILE: DriverMyLocationMapScreen.tsx');
                console.log('🎯[DRIVER_MAP] ▶️ INICIANDO TRACKING DE LOCALIZAÇÃO');
                console.log('============================================');
                await startRealTimeLocation().finally(() => {
                    isCreatingSubscription.current = false; // ← DESTRAVA
                });
            }
            // SE TRACKING ESTÁ INATIVO E HÁ SUBSCRIPTION ATIVA, PARA
            else if (!tracking && locationSubscription.current) {
                console.log('============================================');
                console.log('FILE: DriverMyLocationMapScreen.tsx');
                console.log('����[DRIVER_MAP] ⏸️ PARANDO TRACKING DE LOCALIZAÇÃO 1');
                console.log('============================================');
                await stopRealTimeLocation();
            }
        })();

        // CLEANUP FUNCTION - NÃO FAZ NADA AQUI PARA EVITAR STOP INADVERTIDO
        return () => {
            console.log('=========================================');
            console.log('FILE: DriverMyLocationMapScreen.tsx');
            console.log('🔄[USEEFFECT#4] 🧹 CLEANUP (NÃO PARA TRACKING AQUI)');
            console.log('=========================================');
        };
    }, [tracking, isModalCPFVisible, authResponse?.user.cpf, creditos, isLoadingBalance]);

    // ======================================================================================================
    // ============ VERIFICA CRÉDITOS SEMPRE QUE ELES MUDAM, PARA PARAR O TRACKING SE NECESSÁRIO ============
    // ======================================================================================================
    useEffect(() => {
        if (!viewModel.isPaymentConnected()) {
            viewModel.initPaymentSocket();
            viewModel.listenerPPS(async (data: any) => {
                if (data.id_user === authResponse?.user?.id) {
                    if (data.status && data.status !== 'pending') {
                        let title = 'Status do Pagamento';
                        let message = '';

                        switch (data.status) {
                            case 'approved':
                                message = 'Pagamento aprovado! Seu crédito foi adicionado com sucesso.';
                                Alert.alert(title, message);

                                try {
                                    setTimeout(async () => {
                                        await reloadBalanceWithRetry();
                                    }, 2000);
                                } catch (error) {
                                    Alert.alert('Erro', 'Não foi possível atualizar o saldo. Tente novamente mais tarde.');
                                }
                                return;
                            case 'rejected':
                                message = 'Pagamento rejeitado. Tente novamente ou use outro método de pagamento.';
                                break;
                            case 'cancelled':
                                message = 'Pagamento cancelado.';
                                break;
                            case 'in_process':
                                message = 'Pagamento em processamento...';
                                break;
                            default:
                                message = `Status do pagamento: ${data.status}`;
                        }

                        Alert.alert(title, message);
                    } else {
                        Alert.alert('Status do Pagamento', 'Aguardando confirmação...');
                    }
                }
            });
        }

        return () => {
            viewModel.disconnectAllSockets();
        };
    }, []);

    // =============================================================================================
    // ==== EMITE A POSIÇÃO DO MOTORISTA SEMPRE QUE ELA MUDA (APENAS SE TRACKING ESTIVER ATIVO) ====
    // =============================================================================================
    useEffect(() => {
        if (location !== undefined && tracking && locationSubscription.current) {

            // EXECUTA EMITPOSITION DE FORMA ASSÍNCRONA SEM BLOQUEAR O USEEFFECT
            emitPosition().catch(error => {
                console.error('🎯[DRIVER_MAP] ❌ ERRO NO USEEFFECT EMITPOSITION: ', error);
            });
        } else if (location !== undefined && !tracking) {
            console.log('🎯[DRIVER_MAP] 🛑 TRACKING INATIVO, NÃO EMITINDO POSIÇÃO');
        }
    }, [location, tracking]);

    const getMapStyle = () => {
        switch (mapTheme) {
            case 'dark':
                return darkMapStyle;
            case 'orange':
                return orangeMapStyle;
            default:
                return orangeMapStyle;
        }
    };

    // ==============================================================
    // ==== VERIFICA CPF E CRÉDITOS SEMPRE QUE A TELA GANHA FOCO ====
    // ==============================================================
    useFocusEffect(
        React.useCallback(() => {
            if (authResponse?.user) {
                const userHasCpf = authResponse.user.cpf &&
                    authResponse.user.cpf !== null &&
                    authResponse.user.cpf !== undefined &&
                    authResponse.user.cpf.trim() !== '';

                const userHasCredits = creditos > 0;

                if (!userHasCpf) {
                    setModalCPFVisible(true);
                    setTracking(false);
                    return;
                } else if (!isLoadingBalance && !userHasCredits) {
                    // SÓ DESLIGA TRACKING SE O BALANCE JÁ FOI CARREGADO E REALMENTE NÃO TEM CRÉDITOS
                    setModalCPFVisible(false);
                    setTracking(false);
                } else {
                    setModalCPFVisible(false);
                    // NÃO ALTERA TRACKING AQUI - DEIXA O AUTO-START FAZER ISSO
                }
            }
        }, [authResponse?.user?.cpf, creditos, isLoadingBalance])
    );

    // CARREGA O BALANCE DO USUÁRIO AO MONTAR A TELA
    useEffect(() => {
        const loadUserBalance = async () => {
            if (authResponse?.user?.id) {
                setIsLoadingBalance(true);
                try {
                    const balance = await viewModel.getBalanceByUserId(authResponse.user.id);

                    if ('id' in balance) {
                        setCreditos(balance.balance_out || 0);
                        setGanhos(balance.balance_in || 0);
                    } else {
                        Alert.alert('Erro', 'Não foi possível carregar o saldo. Tente novamente mais tarde.');
                        setCreditos(0);
                        setGanhos(0);
                    }
                } catch (error) {
                    console.error('🎯[DRIVER_MAP] ERRO AO CARREGAR BALANCE: ', error);
                    setCreditos(0);
                    setGanhos(0);
                } finally {
                    setIsLoadingBalance(false);
                }
            }
        };

        loadUserBalance();
    }, [authResponse?.user?.id]);

    // CARREGA O TEMA DO MAPA AO MONTAR A TELA
    useEffect(() => {
        loadMapTheme();
    }, []);

    // AUTO-INICIA O TRACKING QUANDO TODAS AS CONDIÇÕES SÃO ATENDIDAS
    useEffect(() => {
        const autoStartTracking = async () => {
            console.log('🚀[AUTO_START] ========== VERIFICANDO AUTO-START ==========');
            console.log('🚀[AUTO_START] isLoadingBalance:', isLoadingBalance);
            console.log('🚀[AUTO_START] isLoadingInitialRegion:', isLoadingInitialRegion);
            console.log('🚀[AUTO_START] creditos:', creditos);
            console.log('🚀[AUTO_START] hasCpf():', hasCpf());
            console.log('🚀[AUTO_START] hasCredits():', hasCredits());
            console.log('🚀[AUTO_START] isModalCPFVisible:', isModalCPFVisible);
            console.log('🚀[AUTO_START] tracking:', tracking);
            console.log('🚀[AUTO_START] locationSubscription.current:', !!locationSubscription.current);

            // AGUARDA O CARREGAMENTO INICIAL TERMINAR
            if (isLoadingBalance || isLoadingInitialRegion) {
                console.log('🚀[AUTO_START] ⏳ Aguardando carregamento inicial...');
                return;
            }

            // VERIFICA SE PODE INICIAR O TRACKING
            const hasAllConditions = hasCpf() && hasCredits() && !isModalCPFVisible;
            const canStart = hasAllConditions && tracking && !locationSubscription.current;

            console.log('🚀[AUTO_START] hasAllConditions:', hasAllConditions);
            console.log('🚀[AUTO_START] canStart:', canStart);

            if (canStart) {
                console.log('🚀[AUTO_START] ✅✅✅ TODAS CONDIÇÕES ATENDIDAS! INICIANDO TRACKING... ✅✅✅');
                try {
                    await startRealTimeLocation();
                    console.log('🚀[AUTO_START] ✅ TRACKING INICIADO COM SUCESSO!');
                } catch (error) {
                    console.log('🚀[AUTO_START] ❌ ERRO AO INICIAR TRACKING: ', error);
                }
            } else {
                console.log('🚀[AUTO_START] ⏸️ CONDIÇÕES NÃO ATENDIDAS: ', {
                    hasCpf: hasCpf(),
                    hasCredits: hasCredits(),
                    modalClosed: !isModalCPFVisible,
                    trackingOn: tracking,
                    noSubscription: !locationSubscription.current,
                    hasAllConditions,
                    canStart
                });
            }
            console.log('🚀[AUTO_START] ========== FIM VERIFICAÇÃO AUTO-START ==========');
        };

        autoStartTracking();
    }, [isLoadingBalance, isLoadingInitialRegion, creditos, authResponse?.user?.cpf, isModalCPFVisible, tracking]);

    // VERIFICA CRÉDITOS SEMPRE QUE ELES MUDAM PARA PARAR O TRACKING SE NECESSÁRIO
    useEffect(() => {
        if (!isLoadingBalance && !hasCredits() && tracking) {
            setTracking(false);

            Alert.alert(
                'Créditos Insuficientes',
                'Seu saldo de créditos está esgotado...'
            );
        }

    }, [creditos, tracking, isLoadingBalance]);

    // USEEFFECT PARA GERENCIAR O TEMPORIZADOR DE 5 MINUTOS
    useEffect(() => {
        if (isTimerActive && timerSeconds > 0) {
            console.log('⏰[TIMER] TEMPORIZADOR ATIVO, SEGUNDOS RESTANTES: ', timerSeconds);

            timerIntervalRef.current = setInterval(() => {
                setTimerSeconds(prev => {
                    const newValue = prev - 1;
                    console.log('⏰[TIMER] CONTAGEM REGRESSIVA: ', newValue);
                    return newValue;
                });
            }, 1000);

            return () => {
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
            };
        } else if (isTimerActive && timerSeconds === 0) {
            // TEMPO ACABOU! ALTERNA AUTOMATICAMENTE O TRACKING
            console.log('⏰[TIMER] ⏱️ TEMPO ESGOTADO! ALTERNANDO TRACKING AUTOMATICAMENTE...');
            console.log('⏰[TIMER] ESTADO ATUAL DO TRACKING: ', tracking);

            // PARA O TEMPORIZADOR PRINCIPAL
            setIsTimerActive(false);

            // ALTERNA O TRACKING (SE ESTAVA LIGADO, DESLIGA; SE ESTAVA DESLIGADO, LIGA)
            setTracking(prev => {
                const newState = !prev;
                console.log('⏰[TIMER] Alternando tracking de', prev, 'para', newState);
                return newState;
            });

            // RESETA O TIMER PARA 5 MINUTOS PARA O PRÓXIMO CICLO
            setTimerSeconds(300);

            // TOCA UM SOM DE NOTIFICAÇÃO
            playNotificationSound();

            // INICIA O TEMPORIZADOR DE PAUSA VISUAL DE 10 SEGUNDOS
            console.log('⏰[PAUSE] INICIANDO TEMPORIZADOR DE PAUSA DE 10 SEGUNDOS...');
            setPauseSeconds(10);
            setIsPauseActive(true);
        }
    }, [isTimerActive, timerSeconds]);

    // USEEFFECT PARA GERENCIAR O TEMPORIZADOR DE PAUSA DE 10 SEGUNDOS
    useEffect(() => {
        if (isPauseActive && pauseSeconds > 0) {
            console.log('⏰[PAUSE] TEMPORIZADOR DE PAUSA ATIVO, SEGUNDOS RESTANTES: ', pauseSeconds);

            pauseIntervalRef.current = setInterval(() => {
                setPauseSeconds(prev => {
                    const newValue = prev - 1;
                    console.log('⏰[PAUSE] CONTAGEM REGRESSIVA DA PAUSA: ', newValue);
                    return newValue;
                });
            }, 1000);

            return () => {
                if (pauseIntervalRef.current) {
                    clearInterval(pauseIntervalRef.current);
                    pauseIntervalRef.current = null;
                }
            };
        } else if (isPauseActive && pauseSeconds === 0) {
            // PAUSA ACABOU! ALTERNA O TRACKING NOVAMENTE E REINICIA O CICLO
            console.log('⏰[PAUSE] ⏱️ PAUSA FINALIZADA! ALTERNANDO TRACKING E REINICIANDO CICLO...');

            // PARA O TEMPORIZADOR DE PAUSA
            setIsPauseActive(false);

            // ALTERNA O TRACKING NOVAMENTE
            setTracking(prev => {
                const newState = !prev;
                console.log('⏰[PAUSE] ALTERANDO TRACKING DE', prev, 'PARA', newState);
                return newState;
            });

            // REINICIA O TEMPORIZADOR PRINCIPAL DE 5 MINUTOS
            console.log('⏰[PAUSE] REINICIANDO TEMPORIZADOR PRINCIPAL DE 5 MINUTOS...');
            setTimerSeconds(300);
            setIsTimerActive(true);

            // RESETA PAUSESECONDS PARA O PRÓXIMO CICLO
            setPauseSeconds(10);
        }
    }, [isPauseActive, pauseSeconds]);

    // ============================================================================
    // ============================================================================
    // ====== FUNÇÃO AUXILIAR PARA RECONECTAR SOCKETS DE FORMA INTELIGENTE =======
    // ============================================================================
    const handleReconnectSockets = React.useCallback(async () => {
        if (isReconnecting.current) {
            console.log('🔄[RECONNECT] ⏳ Reconexão já em andamento, ignorando...');
            return;
        }

        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            console.log('🔄[RECONNECT] ❌ Máximo de tentativas atingido');
            Alert.alert(
                '⚠️ Erro de Conexão',
                'Não foi possível restabelecer a conexão. Por favor, reinicie o aplicativo.',
                [{ text: 'OK' }]
            );
            return;
        }

        const now = Date.now();
        if (now - lastReconnectAttempt.current < RECONNECT_DELAY) {
            console.log('🔄[RECONNECT] ⏳ Aguardando intervalo mínimo entre tentativas...');
            return;
        }

        isReconnecting.current = true;
        lastReconnectAttempt.current = now;
        reconnectAttempts.current += 1;

        console.log(`🔄[RECONNECT] 🔌 Tentativa ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS} de reconexão...`);

        try {
            // DESCONECTA TODOS OS SOCKETS EXISTENTES
            console.log('🔄[RECONNECT] 🔌 Desconectando sockets antigos...');
            viewModel.disconnectAllSockets();

            // AGUARDA UM POUCO ANTES DE RECONECTAR
            await new Promise(resolve => setTimeout(resolve, 1000));

            // RECONECTA LOCATION SOCKET SE TRACKING ESTIVER ATIVO
            if (tracking) {
                console.log('🔄[RECONNECT] 📍 Reconectando Location Socket...');
                viewModel.initLocationSocket();

                const isLocationConnected = await viewModel.waitForLocationConnection(5000);
                if (!isLocationConnected) {
                    throw new Error('Location Socket não conectou');
                }
                console.log('🔄[RECONNECT] ✅ Location Socket reconectado');

                // REINICIALIZA LISTENERS
                const driverPosition = await driverClientRequestViewModel.getDriverPosition(authResponse?.user.id!);
                if ('id_driver' in driverPosition) {
                    handleListenerNewClientRequest(driverPosition);
                    handleListenerNewDriverAssigned();
                    console.log('🔄[RECONNECT] ✅ Listeners reinicializados');
                }
            }

            // RECONECTA PAYMENT SOCKET
            if (!viewModel.isPaymentConnected()) {
                console.log('🔄[RECONNECT] 💳 Reconectando Payment Socket...');
                viewModel.initPaymentSocket();
                viewModel.listenerPPS(async (data: any) => {
                    if (data.id_user === authResponse?.user?.id) {
                        // [Lógica de pagamento mantida]
                        if (data.status && data.status !== 'pending') {
                            let title = 'Status do Pagamento';
                            let message = '';
                            switch (data.status) {
                                case 'approved':
                                    message = 'Pagamento aprovado!';
                                    Alert.alert(title, message);
                                    setTimeout(async () => {
                                        await reloadBalanceWithRetry();
                                    }, 2000);
                                    return;
                                case 'rejected':
                                    message = 'Pagamento rejeitado.';
                                    break;
                                case 'cancelled':
                                    message = 'Pagamento cancelado.';
                                    break;
                                default:
                                    message = `Status: ${data.status}`;
                            }
                            Alert.alert(title, message);
                        }
                    }
                });
            }

            setIsSocketConnected(true);
            reconnectAttempts.current = 0; // RESETA CONTADOR DE TENTATIVAS
            console.log('🔄[RECONNECT] ✅ Reconexão completa!');

            if (Platform.OS === 'android') {
                ToastAndroid.show('✅ Conexão restabelecida!', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('🔄[RECONNECT] ❌ Erro na reconexão:', error);
            setIsSocketConnected(false);

            // TENTA NOVAMENTE APÓS DELAY
            reconnectionTimeout.current = setTimeout(() => {
                handleReconnectSockets();
            }, RECONNECT_DELAY);
        } finally {
            isReconnecting.current = false;
        }
    }, [tracking, authResponse?.user.id, viewModel, driverClientRequestViewModel]);

    // ============================================================================
    // ============ USEEFFECT PARA MONITORAR STATUS DA CONEXÃO COM INTERNET =======
    // ====================== E QUALIDADE DA CONEXÃO ==============================
    // ============================================================================
    useEffect(() => {
        console.log('🌐[DRIVER_MAP] 📡 INICIALIZANDO LISTENER DE CONEXÃO E HEALTH CHECK');

        // SUBSCREVE AO STATUS DA CONEXÃO
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('🌐[DRIVER_MAP] 📶 STATUS DA CONEXÃO:', {
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details
            });

            const wasOnline = isOnline;
            const isCurrentlyOnline = state.isConnected === true && state.isInternetReachable !== false;

            // AVALIA QUALIDADE DA CONEXÃO
            let quality: 'good' | 'poor' | 'offline' = 'offline';
            if (isCurrentlyOnline) {
                // VERIFICA SE É WIFI OU CELULAR E FORÇA DO SINAL
                if (state.type === 'wifi') {
                    quality = 'good';
                } else if (state.type === 'cellular' && state.details) {
                    // @ts-ignore - cellularGeneration pode existir
                    const cellGen = state.details.cellularGeneration;
                    quality = (cellGen === '4g' || cellGen === '5g') ? 'good' : 'poor';
                } else {
                    quality = 'good'; // ASSUME BOM SE NÃO CONSEGUIR DETECTAR
                }
            }

            setIsOnline(isCurrentlyOnline);
            setConnectionQuality(quality);

            // SE ESTAVA ONLINE E AGORA ESTÁ OFFLINE
            if (wasOnline && !isCurrentlyOnline) {
                console.log('🌐[DRIVER_MAP] ❌ INTERNET CAIU!');
                setShowOfflineAlert(true);
                setIsSocketConnected(false);
                reconnectAttempts.current = 0; // RESETA CONTADOR

                if (Platform.OS === 'android') {
                    ToastAndroid.show(
                        '⚠️ Sem conexão com a internet!',
                        ToastAndroid.LONG
                    );
                }

                Alert.alert(
                    '⚠️ Sem Internet',
                    'Você perdeu a conexão. O aplicativo tentará reconectar automaticamente quando a internet voltar.',
                    [{ text: 'OK', onPress: () => setShowOfflineAlert(false) }]
                );
            }
            // SE ESTAVA OFFLINE E AGORA ESTÁ ONLINE - INICIA RECONEXÃO
            else if (!wasOnline && isCurrentlyOnline) {
                console.log('🌐[DRIVER_MAP] ✅ INTERNET RECONECTADA! Iniciando reconexão de sockets...');
                setShowOfflineAlert(false);

                if (Platform.OS === 'android') {
                    ToastAndroid.show(
                        '🔄 Reconectando ao servidor...',
                        ToastAndroid.SHORT
                    );
                }

                // AGUARDA UM POUCO ANTES DE RECONECTAR (ESTABILIZAÇÃO)
                setTimeout(() => {
                    handleReconnectSockets();
                }, 2000);
            }
            // SE CONEXÃO DEGRADOU
            else if (wasOnline && isCurrentlyOnline && quality === 'poor') {
                console.log('🌐[DRIVER_MAP] ⚠️ QUALIDADE DA CONEXÃO DEGRADOU');
                if (Platform.OS === 'android') {
                    ToastAndroid.show(
                        '⚠️ Conexão instável detectada',
                        ToastAndroid.SHORT
                    );
                }
            }
        });

        // HEALTH CHECK DO SOCKET A CADA 30 SEGUNDOS
        socketHealthCheckInterval.current = setInterval(() => {
            if (isOnline && tracking) {
                const isLocationConnected = viewModel.isLocationConnected();
                const isPaymentConnected = viewModel.isPaymentConnected();

                console.log('🏥[HEALTH_CHECK] Socket Status:', {
                    location: isLocationConnected,
                    payment: isPaymentConnected
                });

                // SE INTERNET OK MAS SOCKET DESCONECTADO, TENTA RECONECTAR
                if (!isLocationConnected || !isPaymentConnected) {
                    console.log('🏥[HEALTH_CHECK] ⚠️ Socket desconectado detectado, iniciando reconexão...');
                    setIsSocketConnected(false);
                    handleReconnectSockets();
                } else {
                    setIsSocketConnected(true);
                }
            }
        }, 30000); // 30 segundos

        // CLEANUP: REMOVE O LISTENER E HEALTH CHECK
        return () => {
            console.log('🌐[DRIVER_MAP] 🧹 REMOVENDO LISTENER DE CONEXÃO E HEALTH CHECK');
            unsubscribe();

            if (socketHealthCheckInterval.current) {
                clearInterval(socketHealthCheckInterval.current);
                socketHealthCheckInterval.current = null;
            }

            if (reconnectionTimeout.current) {
                clearTimeout(reconnectionTimeout.current);
                reconnectionTimeout.current = null;
            }
        };
    }, [isOnline, tracking, handleReconnectSockets]);

    // USEEFFECT PARA GERENCIAR O TEMPORIZADOR DE INICIALIZAÇÃO DE 6 SEGUNDOS
    useEffect(() => {
        if (isStartupActive && startupSeconds > 0) {
            console.log('⏰[STARTUP] TEMPORIZADOR DE INICIALIZAÇÃO ATIVO, SEGUNDOS RESTANTES: ', startupSeconds);

            startupIntervalRef.current = setInterval(() => {
                setStartupSeconds(prev => {
                    const newValue = prev - 1;
                    console.log('⏰[STARTUP] CONTAGEM REGRESSIVA DA INICIALIZAÇÃO: ', newValue);
                    return newValue;
                });
            }, 1000);

            return () => {
                if (startupIntervalRef.current) {
                    clearInterval(startupIntervalRef.current);
                    startupIntervalRef.current = null;
                }
            };
        } else if (isStartupActive && startupSeconds === 0) {
            // INICIALIZAÇÃO COMPLETA! ATIVA O TRACKING
            console.log('⏰[STARTUP] ⏱️ INICIALIZAÇÃO COMPLETA! ATIVANDO TRACKING...');

            // PARA O TEMPORIZADOR DE INICIALIZAÇÃO
            setIsStartupActive(false);

            // ATIVA O TRACKING EFETIVAMENTE
            setTracking(true);

            // INICIA O TEMPORIZADOR PRINCIPAL DE 5 MINUTOS
            console.log('⏰[STARTUP] INICIANDO TEMPORIZADOR PRINCIPAL DE 5 MINUTOS...');
            setTimerSeconds(300);
            setIsTimerActive(true);

            // RESETA STARTUPSECONDS PARA PRÓXIMA VEZ
            setStartupSeconds(6);
        }
    }, [isStartupActive, startupSeconds]);

    // CLEANUP DOS TEMPORIZADORES QUANDO O COMPONENTE DESMONTA OU PERDE FOCO
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (timerIntervalRef.current) {
                    console.log('⏰[TIMER] LIMPANDO TEMPORIZADOR NO CLEANUP');
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
                if (pauseIntervalRef.current) {
                    console.log('⏰[PAUSE] LIMPANDO TEMPORIZADOR DE PAUSA NO CLEANUP');
                    clearInterval(pauseIntervalRef.current);
                    pauseIntervalRef.current = null;
                }
                if (startupIntervalRef.current) {
                    console.log('⏰[STARTUP] LIMPANDO TEMPORIZADOR DE INICIALIZAÇÃO NO CLEANUP');
                    clearInterval(startupIntervalRef.current);
                    startupIntervalRef.current = null;
                }
            };
        }, [])
    );

    // CLEANUP DA SUBSCRIPTION DE LOCALIZAÇÃO QUANDO A TELA PERDE FOCO
    useFocusEffect(
        React.useCallback(() => {
            return async () => {
                try {
                    if (locationSubscription.current) {
                        await locationSubscription.current.remove();
                        locationSubscription.current = null;
                        setLocation(undefined);
                    }
                } catch (error) {
                    console.log('🛑[STOP] ❌ ERRO AO REMOVER SUBSCRIPTION: ', error);
                }
            };
        }, [])
    );

    // FUNÇÃO PARA TOCAR SOM DE NOTIFICAÇÃO USANDO EXPO-AUDIO
    const playNotificationSound = async () => {
        try {
            // GARANTE QUE O SOM SEMPRE COMECE DO INÍCIO
            player.seekTo(0);

            // REPRODUZ O SOM
            await player.play();
        } catch (error) {
            console.error('❌ ERRO AO TOCAR SOM DE NOTIFICAÇÃO: ', error);
            // FALLBACK: USA VIBRAÇÃO SE O SOM FALHAR
            if (Platform.OS === 'android') {
                // VIBRAÇÃO COMO ALTERNATIVA
                try {
                    const { Vibration } = require('react-native');
                    Vibration.vibrate([0, 500, 200, 500]); // PADRÃO DE VIBRAÇÃO
                } catch (vibError) {
                    console.error('❌ ERRO NA VIBRAÇÃO TAMBÉM: ', vibError);
                }
            }
        }
    };

    const saveMapTheme = async (theme: 'dark' | 'orange') => {
        try {
            await AsyncStorage.setItem('mapTheme', theme);
        } catch (error) {
            Alert.alert('ERRO', 'NÃO FOI POSSÍVEL SALVAR O TEMA DO MAPA.');
        }
    };

    const loadMapTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('mapTheme');
            if (savedTheme && ['dark', 'orange'].includes(savedTheme)) {
                setMapTheme(savedTheme as 'dark' | 'orange');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar o tema do mapa.');
        }
    };

    const handleZoom = (type: 'in' | 'out') => {
        animateZoom();
        if (mapRef.current) {
            mapRef.current.getCamera().then((camera: Camera) => {
                let newZoom = camera.zoom ?? 15;
                if (type === 'in') newZoom += 1;
                if (type === 'out') newZoom -= 1;
                mapRef.current?.animateCamera({ ...camera, zoom: newZoom }, { duration: 300 });
            });
        }
    };

    const hasCpf = (): boolean => {
        return !!(authResponse?.user.cpf &&
            authResponse.user.cpf !== null &&
            authResponse.user.cpf !== undefined &&
            authResponse.user.cpf.trim() !== '');
    };

    const hasCredits = (): boolean => {
        return creditos > 0;
    };

    const handleCreateDriverPosition = async (currentLocation?: Region) => {
        console.log('🎯[DRIVER_MAP] VALOR DO TRACKING: ', tracking);

        if (!tracking) {
            console.log('🎯[DRIVER_MAP] 🛑 handleCreateDriverPosition BLOQUEADO - tracking DESATIVADO');
            return;
        }

        const locationToUse = currentLocation || location;

        console.log('🎯[DRIVER_MAP] POSIÇÃO PARA ENVIAR AO SERVIDOR: ', locationToUse);

        if (authResponse?.user !== null && authResponse?.user !== undefined && locationToUse !== null && locationToUse !== undefined) {
            console.log('🎯[DRIVER_MAP] ✅ NOVA LOCALIZAÇÃO PARA ENVIAR AO SERVIDOR: ', locationToUse);

            await viewModel.createDriverPosition({
                id_driver: authResponse.user.id!,
                lat: locationToUse.latitude!,
                lng: locationToUse.longitude!
            });
        } else {
            console.log('🎯[DRIVER_MAP] ❌ NÃO FOI POSSÍVEL CRIAR POSIÇÃO - DADOS FALTANDO:', {
                user: !!authResponse?.user,
                location: !!locationToUse
            });
        }
    }

    const startRealTimeLocation = async () => {
        // SE JÁ ESTÁ RODANDO, NÃO FAZ NADA
        if (!locationSubscription.current) {
            // ATIVA A FLAG GLOBAL DE GPS
            isGPSActive.current = true;

            console.log('🚀[START] ✅ isGPSActive = true');

            // INICIA O TEMPORIZADOR DE 5 MINUTOS
            console.log('🚀[AUTO_START] ⏰ INICIANDO TEMPORIZADOR DE 5 MINUTOS...');

            if (!isTimerInitialized.current) {
                console.log('⏰ INICIANDO TEMPORIZADOR PELA PRIMEIRA VEZ');
                setTimerSeconds(300);
                setIsTimerActive(true);
                isTimerInitialized.current = true;
            }

            // INICIALIZA O socket ANTES DE COMEÇAR O tracking
            console.log('🎯[DRIVER_MAP] 🚀 INICIALIZANDO LOCATION SOCKET ANTES DO TRACKING...');

            viewModel.initLocationSocket();

            // AGUARDA A CONEXÃO DO socket ANTES DE PROSSEGUIR
            const isConnected = await viewModel.waitForLocationConnection(5000); // 5 segundos de timeout

            if (!isConnected) {
                console.log('🎯[DRIVER_MAP] ❌ TIMEOUT AGUARDANDO CONEXÃO DO LOCATION SOCKET');
                Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Tente novamente.');
                return;
            }

            console.log('🎯[DRIVER_MAP] ✅ LOCATION SOCKET CONECTADO, INICIANDO TRACKING...');

            // INICIALIZA O LISTENER DE NOVAS SOLICITAÇÕES QUANDO O TRACKING COMEÇAR
            try {
                // BUSCA A POSIÇÃO ATUAL DO MOTORISTA PARA INICIAR O LISTENER
                const driverPosition = await driverClientRequestViewModel.getDriverPosition(authResponse?.user.id!);

                if ('id_driver' in driverPosition) {
                    console.log('🎯[DRIVER_MAP] INICIALIZANDO LISTENER DE NOVAS SOLICITAÇÕES...');
                    console.log('🎯[DRIVER_MAP] POSIÇÃO DO MOTORISTA PARA LISTENER: ', driverPosition);
                    // CONFIGURA O LISTENER DE NOVAS SOLICITAÇÕES
                    handleListenerNewClientRequest(driverPosition);
                    // CONFIGURA O LISTENER DE ATRIBUIÇÃO DE CORRIDA
                    handleListenerNewDriverAssigned();
                } else {
                    Alert.alert('Erro', 'Não foi possível obter sua posição. O listener de solicitações não foi iniciado.');
                    console.error('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ❌ NÃO FOI POSSÍVEL OBTER POSIÇÃO DO MOTORISTA, LISTENER DE SOLICITAÇÕES NÃO INICIADO: ', driverPosition);
                }
            } catch (error) {
                console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ERRO AO INICIALIZAR LISTENER DE SOLICITAÇÕES: ', error);
                Alert.alert('Erro', 'Ocorreu um erro ao iniciar o listener de solicitações.');
            }

            if (!locationSubscription.current) {
                locationSubscription.current = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 9000, // ATUALIZA A CADA 9 SEGUNDOS
                        distanceInterval: 1
                    },
                    async (newLocation) => {
                        // VERIFICAÇÃO CRÍTICA #0: FLAG GLOBAL GPS ATIVA?
                        if (!isGPSActive.current) {
                            console.log('📍[GPS_CALLBACK] 🛑 GPS DESATIVADO GLOBALMENTE - IGNORANDO CALLBACK');
                            return;
                        }

                        // VERIFICAÇÃO CRÍTICA #1: SUBSCRIPTION AINDA EXISTE?
                        if (!locationSubscription.current) {
                            console.log('📍[GPS_CALLBACK] 🛑 SUBSCRIPTION FOI REMOVIDA - IGNORANDO CALLBACK');
                            return;
                        }

                        // VERIFICAÇÃO CRÍTICA #2: TRACKING AINDA ESTÁ ATIVO?
                        if (!tracking) {
                            console.log('📍[GPS_CALLBACK] 🛑 TRACKING DESATIVADO - IGNORANDO CALLBACK');
                            return;
                        }

                        console.log('📍[GPS_CALLBACK] ✅ NOVA LOCALIZAÇÃO RECEBIDA: ', newLocation);

                        const newLocationData = {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                            latitudeDelta: 0.005,  // ZOOM 17-18 (ESTILO UBER/WAZE/99)
                            longitudeDelta: 0.005
                        };

                        // ANIMA O MAPA PARA SEGUIR O VEÍCULO AUTOMATICAMENTE (ESTILO WAZE)
                        // SÓ CENTRALIZA SE O USUÁRIO NÃO ARRASTOU O MAPA MANUALMENTE
                        if (mapRef.current && !isUserDragging) {
                            mapRef.current.animateToRegion(newLocationData, 500);
                        }

                        console.log('🚀[AUTO_START] ✅ TEMPORIZADOR INICIADO!');

                        setLocation(newLocationData);
                        handleCreateDriverPosition(newLocationData);
                    }
                );
            }
        }
    }

    const emitPosition = async (currentLocation?: Region) => {
        console.log('============================================');
        console.log('FILE: DriverMyLocationMapScreen.tsx, METHOD: emitPosition');
        console.log('🎯[DRIVER_MAP] TENTANDO EMITIR POSIÇÃO VIA SOCKET...');
        console.log('============================================');
        const locationToUse = currentLocation || location;

        if (authResponse?.user != null && locationToUse !== undefined) {
            // VERIFICA SE O SOCKET ESTÁ CONECTADO ANTES DE EMITIR
            if (viewModel.isLocationConnected()) {
                console.log('🎯[DRIVER_MAP] 📡 EMITINDO POSIÇÃO DO MOTORISTA VIA SOCKET...');
                try {
                    viewModel.emitDriverPosition(
                        authResponse?.user.id!,
                        locationToUse.latitude,
                        locationToUse.longitude,
                        authResponse?.user.car!
                    );
                } catch (error) {
                    console.error('🎯[DRIVER_MAP] ❌ ERRO AO EMITIR POSIÇÃO: ', error);
                }
            } else {
                console.log('🎯[DRIVER_MAP] ❌ LOCATION SOCKET DESCONECTADO, TENTANDO RECONECTAR...');

                // DEBOUNCE: EVITA MÚLTIPLAS RECONEÇÕES EM MENOS DE 5 SEGUNDOS
                const now = Date.now();

                if (isReconnecting.current || (now - lastReconnectAttempt.current < 5000)) {
                    console.log('🎯[DRIVER_MAP] 🔄 RECONEXÃO JÁ EM ANDAMENTO OU MUITO RECENTE, PULANDO...');
                    return;
                }

                isReconnecting.current = true;
                lastReconnectAttempt.current = now;

                try {
                    viewModel.initLocationSocket();
                    const isReconnected = await viewModel.waitForLocationConnection(3000);

                    if (isReconnected) {
                        console.log('🎯[DRIVER_MAP] ✅ RECONECTADO! ENVIANDO POSIÇÃO...');

                        viewModel.emitDriverPosition(
                            authResponse?.user.id!,
                            locationToUse.latitude,
                            locationToUse.longitude,
                            authResponse?.user.car!
                        );
                    } else {
                        console.log('🎯[DRIVER_MAP] ⏰ TIMEOUT NA RECONEÇÃO - POSIÇÃO PERDIDA');
                    }
                } catch (error) {
                    console.error('🎯[DRIVER_MAP] 💥 ERRO NA RECONEÇÃO: ', error);
                } finally {
                    isReconnecting.current = false;
                }
            }
        }
    }

    const stopRealTimeLocation = async () => {
        console.log('🛑[STOP] ========== PARANDO TRACKING ==========');
        console.log('🛑[STOP] locationSubscription.current exists:', !!locationSubscription.current);

        // DESATIVA A FLAG GLOBAL PRIMEIRO (BLOQUEIA TODOS OS CALLBACKS IMEDIATAMENTE)
        isGPSActive.current = false;
        console.log('🛑[STOP] 🚫 isGPSActive = false (TODOS callbacks bloqueados)');

        isTimerInitialized.current = false;

        if (locationSubscription.current) {
            console.log('🎯[DRIVER_MAP] 🛑 PARANDO TRACKING DE LOCALIZAÇÃO 2...');

            try {
                // CRÍTICO: REMOVE A SUBSCRIPTION DE FORMA SÍNCRONA E IMEDIATA
                await locationSubscription.current.remove();
                console.log('🛑[STOP] ✅ subscription.remove() EXECUTADO');
            } catch (error) {
                console.error('🛑[STOP] ❌ ERRO AO REMOVER SUBSCRIPTION: ', error);
            }

            // CRÍTICO: LIMPA A REFERÊNCIA IMEDIATAMENTE
            locationSubscription.current = null;
            console.log('🛑[STOP] ✅ locationSubscription.current = null');

            // DESCONECTA O LOCATION SOCKET (MAS MANTÉM PAYMENT SOCKET)
            viewModel.disconnectLocationSocket();

            // LIMPA O ESTADO DE LOCALIZAÇÃO
            setLocation(undefined);
            console.log('🛑[STOP] ✅ LOCATION STATE CLEARED');

            // VERIFICA SE PAYMENT SOCKET AINDA ESTÁ ATIVO
            if (!viewModel.isPaymentConnected()) {
                console.log('🎯[DRIVER_MAP] 🔄 RECONECTANDO PAYMENT SOCKET...');
                viewModel.initPaymentSocket();
            }

            console.log('🎯[DRIVER_MAP] ✅ LOCATION TRACKING PARADO COM SUCESSO 4');
        } else {
            console.log('🛑[STOP] ⚠️ NENHUMA SUBSCRIPTION ATIVA PARA PARAR');
        }

        console.log('🛑[STOP] ========== FIM STOP TRACKING ==========');
    }

    const toggleModal = () => {
        const willClose = isModalVisible;

        setModalVisible(!isModalVisible);

        if (willClose) {
            setInputValue('');
            setIsAddingBalance(false);
            setGeneratedCode('');
            setShowCode(false);
            setQrCode('');
            setQrCodeBase64('');
            setTicketUrl('');
            setIsLoadingPix(false);
        }
    };

    // ========================================================
    // ========== FUNÇÃO PARA GERAR O PAGAMENTO PIX ===========
    // ========================================================
    const handleGeneratePixPayment = async () => {
        if (!authResponse?.user?.id) {
            Alert.alert('Erro', 'Usuário não identificado');
            return;
        }

        setIsLoadingPix(true);

        try {
            const statusData = {
                name: authResponse.user.name!,
                email: authResponse.user.email!,
                id_user: authResponse.user.id,
                amount: parseFloat(inputValue),
                cpf: authResponse.user.cpf
            };

            const result = await viewModel.generatePixPayment(statusData);

            if ('id' in result) {
                setQrCode(result.qr_code || '');
                setQrCodeBase64(result.qr_code_base64 || '');
                setTicketUrl(result.ticket_url || '');
                setShowCode(true);
                setGeneratedCode('');
            } else {
                Alert.alert('Erro', 'Não foi possível gerar o PIX. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
        } finally {
            setIsLoadingPix(false);
        }
    };

    const handleCopy = async () => {
        await Clipboard.setStringAsync(generatedCode);
        if (Platform.OS === 'android') {
            ToastAndroid.show("Código copiado com sucesso!", ToastAndroid.SHORT);
            setModalVisible(false);
        } else {
            Alert.alert("Copiado", "Código copiado com sucesso!");
        }
    };

    const animateZoom = () => {
        scaleAnim.setValue(1);
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    };

    const handleLogout = () => {
        removeAuthSession();
        rootNavigation.replace('SplashScreen');
        setShowLogoutModal(false);
    };

    // FUNÇÃO PARA RECARREGAR O BALANCE DO USUÁRIO
    const reloadUserBalance = async () => {
        console.log('🎯[DRIVER_MAP] === INÍCIO RELOAD BALANCE ===');
        console.log('🎯[DRIVER_MAP] User ID:', authResponse?.user?.id);

        if (authResponse?.user?.id) {
            setIsLoadingBalance(true);
            try {
                console.log('🎯[DRIVER_MAP] CHAMANDO viewModel.getBalanceByUserId...');
                const balance = await viewModel.getBalanceByUserId(authResponse.user.id);
                console.log('🎯[DRIVER_MAP] RESPOSTA DO BALANCE: ', balance);

                if ('id' in balance) {
                    console.log('🎯[DRIVER_MAP] BALANCE RECARREGADO COM SUCESSO: ', balance);
                    console.log('🎯[DRIVER_MAP] VALORES - balance_out:', balance.balance_out, 'balance_in:', balance.balance_in);

                    const newCreditos = balance.balance_out || 0;
                    const newGanhos = balance.balance_in || 0;

                    console.log('🎯[DRIVER_MAP] ATUALIZANDO ESTADOS - CRÉDITOS: ', newCreditos, 'GANHOS:', newGanhos);
                    setCreditos(newCreditos);
                    setGanhos(newGanhos);

                    console.log('🎯[DRIVER_MAP] ESTADOS ATUALIZADOS COM SUCESSO!');
                } else {
                    console.log('🎯[DRIVER_MAP] ERRO AO RECARREGAR BALANCE - RESPOSTA INVÁLIDA:', balance);
                    // EM CASO DE ERRO, MANTÉM OS VALORES ATUAIS
                    console.log('🎯[DRIVER_MAP] MANTENDO VALORES ATUAIS DE CRÉDITOS E GANHOS');
                }
            } catch (error) {
                console.error('🎯[DRIVER_MAP] ERRO AO RECARREGAR BALANCE (CATCH): ', error);
                // EM CASO DE ERRO DE REDE, MANTÉM OS VALORES ATUAIS
                console.log('🎯[DRIVER_MAP] ERRO DE REDE - MANTENDO VALORES ATUAIS');
            } finally {
                setIsLoadingBalance(false);
                console.log('🎯[DRIVER_MAP] === FIM RELOAD BALANCE ===');
            }
        } else {
            console.log('🎯[DRIVER_MAP] USER ID NÃO DISPONÍVEL PARA RELOAD BALANCE');
        }
    };

    // FUNÇÃO PARA TENTAR RECARREGAR O BALANCE COM RETRY
    const reloadBalanceWithRetry = async (maxRetries = 3, delay = 2000) => {
        console.log('🎯[DRIVER_MAP] === INICIANDO RELOAD COM RETRY ===');

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`🎯[DRIVER_MAP] Tentativa ${attempt} de ${maxRetries}`);

            const currentCreditos = creditos;
            await reloadUserBalance();

            // AGUARDA UM POUCO PARA VERIFICAR SE O ESTADO FOI ATUALIZADO
            await new Promise(resolve => setTimeout(resolve, 500));

            // VERIFICA SE O BALANCE FOI REALMENTE ATUALIZADO (VALOR DIFERENTE DO ANTERIOR)
            if (creditos !== currentCreditos) {
                console.log(`🎯[DRIVER_MAP] ✅ BALANCE ATUALIZADO COM SUCESSO NA TENTATIVA ${attempt}!`);
                return;
            }

            if (attempt < maxRetries) {
                console.log(`🎯[DRIVER_MAP] ❌ TENTATIVA ${attempt} FALHOU, AGUARDANDO ${delay} MS...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log('🎯[DRIVER_MAP] ❌ TODAS AS TENTATIVAS DE RELOAD FALHARAM');
        console.log('🎯[DRIVER_MAP] === FIM RELOAD COM RETRY ===');
    };

    const showErrorMessage = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert("Erro", message);
        }
    };

    const showSuccessMessage = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert("Sucesso", message);
        }
    };

    // ================================================================================
    // ============ LISTENER PARA NOVAS SOLICITAÇÕES DE CLIENTES PRÓXIMOS =============
    // ================================================================================
    const handleListenerNewClientRequest = async (driverPosition: DriverPosition) => {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] CONFIGURANDO LISTENER PARA NOVAS SOLICITAÇÕES...');
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        driverClientRequestViewModel.listenerNewClientRequestSocket(async (data: any) => {
            console.log('=====================================================================');
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] 🚨 NOVA SOLICITAÇÃO DE CLIENTE RECEBIDA! 🚨');
            console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] DADOS DA SOLICITAÇÃO:', data);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

            try {
                const response = await driverClientRequestViewModel.getNearbyTripRequest({
                    latitude: driverPosition.lat,
                    longitude: driverPosition.lng,
                }, authResponse?.user.id!, authResponse?.user.car ? 'car' : 'motorcycle');

                console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] RESPOSTA DAS SOLICITAÇÕES PRÓXIMAS: ', response);

                if (Array.isArray(response)) {
                    setClientRequestResponse(response); // ATUALIZA O ESTADO DAS SOLICITAÇÕES COM AS NOVAS SOLICITAÇÕES
                    console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] TOTAL DE SOLICITAÇÕES ENCONTRADAS: ', response.length);

                    if (response.length > 0) { // ABRE AUTOMATICAMENTE O MODAL SE HOUVER SOLICITAÇÕES
                        console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] 🔔 ABRINDO MODAL AUTOMATICAMENTE - NOVA SOLICITAÇÃO DISPONÍVEL! 🔔');

                        await playNotificationSound(); // 🔊 TOCA SOM DE NOTIFICAÇÃO IMEDIATAMENTE

                        if (isClientRequestsModalVisible) { // SE JÁ ESTIVER ABERTO, NÃO FAZ NADA
                            console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] MODAL JÁ ESTÁ ABERTO, NÃO ABRINDO NOVAMENTE.');
                            return;
                        }

                        setClientRequestsModalVisible(true);
                    }
                } else {
                    console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ❌ ERRO AO BUSCAR SOLICITAÇÕES PRÓXIMAS: ', response);
                    showErrorMessage('Não foi possível atualizar as solicitações. Tente novamente mais tarde.');
                }
            } catch (error) {
                console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ❌ ERRO NO PROCESSAMENTO DA NOVA SOLICITAÇÃO: ', error);
                showErrorMessage('Ocorreu um erro ao processar a nova solicitação. Tente novamente mais tarde.');
            }
        });

        console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ✅ LISTENER DE NOVAS SOLICITAÇÕES CONFIGURADO COM SUCESSO.');
    }

    // LISTENER PARA NOVAS ATRIBUIÇÕES DE MOTORISTA
    const handleListenerNewDriverAssigned = async () => {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        driverClientRequestViewModel.listenerNewDriverAssignedSocket(authResponse?.user.id!, async (data: any) => {
            const idClientRequest = data.id_client_request;
            const clientRequestType = data.client_request_type;
            console.log('🎯[DRIVER_MAP] 🚗 MOTORISTA ATRIBUÍDO À SOLICITAÇÃO! 🚗');
            console.log('🎯[DRIVER_MAP] ID da solicitação:', idClientRequest);
            console.log('🎯[DRIVER_MAP] Fechando modal e navegando para DriverTripMapScreen...');
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
            try {
                // FECHA O MODAL DE SOLICITAÇÕES
                setClientRequestsModalVisible(false);

                // AGUARDA UM POUCO PARA GARANTIR QUE O MODAL FOI FECHADO
                setTimeout(() => {
                    console.log('🎯[DRIVER_MAP] EXECUTANDO NAVEGAÇÃO PARA DRIVERTRIPMAPSCREEN...');
                    console.log('🎯[DRIVER_MAP] VERIFICANDO rootNavigation: ', !!rootNavigation);
                    console.log('🎯[DRIVER_MAP] PARÂMETROS DA NAVEGAÇÃO: ', { idClientRequest });
                    console.log('TIPO DA SOLICITAÇÃO DO CLIENTE: ', clientRequestType);
                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');

                    if (clientRequestType === 'scheduled') {
                        Alert.alert('Corrida Agendada', 'Você foi atribuído a uma corrida agendada. A tela de corrida será aberta no horário marcado.');
                        return;
                    }

                    rootNavigation.navigate('DriverMapStackNavigator', {
                        screen: 'DriverTripMapScreen',
                        params: { idClientRequest: idClientRequest }
                    } as any);
                }, 300);

            } catch (error) {
                console.error('🎯[DRIVER_MAP] ❌ ERRO GERAL NA NAVEGAÇÃO: ', error);
                Alert.alert('Erro de Navegação', `Não foi possível abrir a tela de corrida. ID: ${idClientRequest}`);
            }
        });
    }

    // OBTÉM AS SOLICITAÇÕES DE VIAGEM PRÓXIMAS
    const handleGetNearbyTripRequest = async () => {
        if (authResponse?.user !== null) {
            setIsLoadingRequests(true);

            try {
                const driverPosition = await driverClientRequestViewModel.getDriverPosition(authResponse?.user.id!);

                if ('id_driver' in driverPosition) {
                    console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] POSIÇÃO DO MOTORISTA: ', driverPosition);
                    const response = await driverClientRequestViewModel.getNearbyTripRequest({
                        latitude: driverPosition.lat,
                        longitude: driverPosition.lng,
                    }, authResponse?.user.id!, authResponse?.user.car ? 'car' : 'motorcycle');

                    setClientRequestResponse(response as ClientRequestResponse[]);
                    handleListenerNewClientRequest(driverPosition);
                }
            } catch (error) {
                console.log('🎯[DRIVER_MY_LOCATION_MAP_SCREEN] ERRO AO BUSCAR SOLICITAÇÕES PRÓXIMAS: ', error);
            } finally {
                setIsLoadingRequests(false);
            }
        }
    }

    // ATUALIZA A LISTA DE SOLICITAÇÕES AO PUXAR PARA ATUALIZAR
    const handleRefreshRequests = async () => {
        setIsRefreshingRequests(true);
        await handleGetNearbyTripRequest();
        setIsRefreshingRequests(false);
    }

    // REMOVE UMA SOLICITAÇÃO DA LISTA APÓS O ENVIO DE UMA OFERTA
    const handleRemoveClientRequest = (clientRequestId: number) => {
        setClientRequestResponse(prev => {
            const newRequests = prev.filter(item => item.id !== clientRequestId);

            // FECHA O MODAL SE NÃO HOUVER MAIS SOLICITAÇÕES
            if (newRequests.length === 0) {
                setClientRequestsModalVisible(false);
            }

            return newRequests;
        });
    }

    // FECHA O MODAL E RESETA O ESTADO QUANDO ACEITA UMA CORRIDA AGENDADA
    const handleCloseModalAndReset = () => {
        console.log('🎯[DRIVER_MAP] FECHANDO MODAL E RESETANDO ESTADO PARA CORRIDA AGENDADA...');
        setClientRequestsModalVisible(false);
        setClientRequestResponse([]);
        setIsTimerActive(false);
        setTimerSeconds(300);
        setTracking(false); // DESATIVA O TRACKING TAMBÉM
        console.log('🎯[DRIVER_MAP] ✅ MODAL FECHADO, ESTADO RESETADO E TRACKING DESATIVADO');
    }

    const handleUpdateUser = async (cpf: string) => {
        const response = await profileViewModel.update({
            id: authResponse?.user.id,
            name: authResponse!.user.name,
            lastname: authResponse!.user.lastname,
            phone: authResponse!.user.phone,
            email: authResponse?.user.email!,
            cpf: cpf
        });

        if ('id' in response) {
            Alert.alert('Sucesso', 'Seu CPF foi atualizado com sucesso.');
            saveAuthSession({
                user: { ...response, roles: authResponse?.user.roles },
                token: authResponse?.token!,
                session_id: authResponse?.session_id!,
                refresh_token: authResponse?.refresh_token!
            });

            setModalCPFVisible(false);
        } else {
            throw new Error('Não foi possível atualizar os dados');
        }
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>

            {/* BARRA DE AVISO - SEM INTERNET */}
            {!isOnline && (
                <View style={styles.offlineBar}>
                    <Ionicons name="cloud-offline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.offlineBarText}>
                        ⚠️ Sem conexão com a internet
                    </Text>
                </View>
            )}

            {/* BARRA DE AVISO - CONEXÃO INSTÁVEL */}
            {isOnline && connectionQuality === 'poor' && (
                <View style={[styles.offlineBar, { backgroundColor: '#FF9800' }]}>
                    <Ionicons name="warning" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.offlineBarText}>
                        ⚠️ Conexão instável
                    </Text>
                </View>
            )}

            {/* 🚦 SEMÁFORO DE STATUS - PROFISSIONAL */}
            {isOnline && (
                <View style={styles.trafficLight}>
                    {/* LUZ VERDE - CONECTADO */}
                    <View style={[
                        styles.trafficLightBulb,
                        isSocketConnected && styles.trafficLightGreenActive,
                        !isSocketConnected && styles.trafficLightInactive
                    ]} />

                    {/* LUZ AMARELA - RECONECTANDO */}
                    <View style={[
                        styles.trafficLightBulb,
                        !isSocketConnected && styles.trafficLightYellowActive,
                        isSocketConnected && styles.trafficLightInactive
                    ]} />
                </View>
            )}

            <CPFModal
                visible={isModalCPFVisible}
                onClose={() => setModalCPFVisible(false)}
                onSubmit={handleUpdateUser}
                styles={styles}
            />

            {/* HEADER COM TOGGLE */}
            <View style={styles.headerContainer}>
                <View style={styles.toggleWrapper}>
                    <ToggleSwitch
                        isOn={tracking && hasCpf() && hasCredits()}
                        onColor="#FC7700"
                        offColor="#ccc"
                        label={tracking && hasCpf() && hasCredits() ? "Ficar Offline" : "Ficar Online"}
                        onToggle={(isOn) => {
                            if (!hasCpf()) {
                                Alert.alert(
                                    "CPF Obrigatório",
                                    "Para ativar a localização em tempo real, é necessário cadastrar seu CPF primeiro.",
                                    [{ text: "OK" }]
                                );
                            } else if (!hasCredits()) {
                                Alert.alert(
                                    "Créditos Insuficientes",
                                    "Para ativar a localização em tempo real, você precisa ter créditos disponíveis. Adicione créditos para continuar.",
                                    [{ text: "OK" }]
                                );
                            } else {
                                if (isOn) {
                                    // USUÁRIO QUER ATIVAR - MOSTRA TEMPORIZADOR DE 6 SEGUNDOS
                                    console.log('⏰[STARTUP] INICIANDO TEMPORIZADOR DE INICIALIZAÇÃO DE 6 SEGUNDOS (TOGGLE)...');
                                    setStartupSeconds(6);
                                    setIsStartupActive(true);
                                } else {
                                    // DESATIVA O TRACKING E PARA TODOS OS TEMPORIZADORES
                                    console.log('🚀[AUTO_START] 🛑 DESATIVANDO TEMPORIZADOR (TOGGLE)...');
                                    setTracking(false);
                                    setIsTimerActive(false);
                                    setTimerSeconds(300);
                                    setIsStartupActive(false);
                                    setStartupSeconds(6);
                                }
                            }
                        }}
                        size="medium"
                        disabled={!hasCpf() || !hasCredits()}
                    />
                </View>

                {/* BOTÃO DE RELOAD */}
                <TouchableOpacity
                    onPress={() => {
                        rootNavigation.replace('DriverHomeScreen');
                    }}
                    style={[styles.settingsButton, { backgroundColor: '#2196F3', marginRight: 8 }]}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="reload"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* CONTAINER DE SALDOS */}
            <View style={styles.balanceHeaderContainer}>
                {/* SALDO GANHO (RECEITA) */}
                <View style={styles.earnedBalanceContainer}>
                    <View style={styles.balanceIconContainer}>
                        <Ionicons name="trending-up" size={16} color="#4CAF50" />
                    </View>
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>Ganhos</Text>
                        <Text style={styles.earnedBalanceValue}>
                            {isLoadingBalance ? 'Carregando...' : `R$ ${ganhos.toFixed(2).replace('.', ',')}`}
                        </Text>
                    </View>
                </View>

                {/* Saldo de Créditos (Para Tarifas) */}
                <View style={styles.creditBalanceContainer}>
                    <View style={styles.balanceIconContainer}>
                        <Ionicons name="card" size={16} color="#FC7700" />
                    </View>
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>Créditos</Text>
                        <Text style={styles.creditBalanceValue}>
                            {isLoadingBalance ? 'Carregando...' : `R$ ${creditos.toFixed(2).replace('.', ',')}`}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={toggleModal}
                        style={styles.addCreditButton}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={14} color="#FC7700" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            reloadBalanceWithRetry();
                        }}
                        style={[styles.addCreditButton, { marginLeft: 5, backgroundColor: '#e53935' }]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={14} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODAL DE SELEÇÃO DE TEMA DO MAPA */}
            <MapThemeModal
                visible={isMapThemeModalVisible}
                onClose={() => setMapThemeModalVisible(false)}
                currentTheme={mapTheme}
                onThemeSelect={(theme) => {
                    setMapTheme(theme);
                    saveMapTheme(theme);
                }}
            />

            {/* MODAL DE SOLICITAÇÕES DE SALDO */}
            <BalanceRequestsModal
                visible={isBalanceRequestsModalVisible}
                onClose={() => setBalanceRequestsModalVisible(false)}
                styles={styles}
            />

            {/* MAPA */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    customMapStyle={getMapStyle()}
                    style={styles.mapViewStyle}
                    initialRegion={initialRegion}
                    zoomControlEnabled={false}
                    onPanDrag={() => {
                        // SÓ PERMITE ARRASTO SE TRACKING ESTIVER ATIVO
                        if (!tracking) {
                            console.log('📍[MAP] TRACKING DESATIVADO, BOTÃO DE RECENTRALIZAR NÃO SERÁ MOSTRADO');
                            return;
                        }

                        // USUÁRIO COMEÇOU A ARRASTAR O MAPA
                        if (!isUserDragging) {
                            setIsUserDragging(true);
                            setShowRecenterButton(true);
                            console.log('📍[MAP] USUÁRIO ARRASTOU O MAPA, DESATIVANDO auto-follow');
                        }

                        // LIMPA TIMEOUT ANTERIOR
                        if (autoFollowTimeoutRef.current) {
                            clearTimeout(autoFollowTimeoutRef.current);
                        }

                        // REATIVA AUTO-FOLLOW APÓS 10 SEGUNDOS DE INATIVIDADE
                        autoFollowTimeoutRef.current = setTimeout(() => {
                            setIsUserDragging(false);
                            setShowRecenterButton(false);
                            console.log('📍[MAP] 10 SEGUNDOS SEM INTERAÇÃO, REATIVANDO auto-follow');
                        }, 10000);
                    }}
                >
                    {
                        location && (
                            <Marker
                                coordinate={{
                                    latitude: location!.latitude,
                                    longitude: location!.longitude
                                }}
                                title="Minha Localização"
                                anchor={{ x: 0.5, y: 0.5 }}
                            >
                                <View style={{ width: 30, height: 30 }}>
                                    {authResponse?.user.car ? (
                                        <Image
                                            source={require('../../../../assets/car.png')}
                                            style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../../../../assets/motorcycle.png')}
                                            style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                        />
                                    )}
                                </View>
                            </Marker>
                        )
                    }
                </MapView>

                {/* BOTÕES CUSTOMIZADOS DE ZOOM */}
                <View style={styles.mapFloatingButtonsContainer}>
                    <TouchableOpacity
                        onPress={() => handleZoom('in')}
                        style={styles.mapZoomInButton}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name='add-outline' size={25} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleZoom('out')}
                        style={styles.mapZoomOutButton}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name='remove-outline' size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.mapLocationButtonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            if (mapRef.current && location) {
                                // SE USUÁRIO ARRASTOU, DESATIVA O ESTADO DE ARRASTO E VOLTA A SEGUIR
                                if (isUserDragging) {
                                    setIsUserDragging(false);
                                    setShowRecenterButton(false);
                                    if (autoFollowTimeoutRef.current) {
                                        clearTimeout(autoFollowTimeoutRef.current);
                                    }
                                    console.log('📍[MAP] USUÁRIO CLICOU EM RECENTRALIZAR, REATIVANDO auto-follow');
                                }

                                mapRef.current.animateCamera({
                                    center: {
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                    },
                                    zoom: 18, // ZOOM ESTILO UBER/WAZE
                                });
                            }
                        }}
                        style={[
                            styles.mapLocationButton,
                            // MUDA PARA BRANCO QUANDO USUÁRIO ARRASTOU (ESTILO WAZE)
                            isUserDragging && tracking && { backgroundColor: '#FFFFFF', elevation: 8 }
                        ]}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name='locate-outline'
                            size={25}
                            color={isUserDragging && tracking ? '#FC7700' : 'white'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapTrackingOffContainer}>
                    <TouchableOpacity
                        onPress={async () => {
                            if (!hasCpf()) {
                                Alert.alert(
                                    "CPF Obrigatório",
                                    "Para ativar a localização em tempo real, é necessário cadastrar seu CPF primeiro.",
                                    [{ text: "OK" }]
                                );
                            } else if (!hasCredits()) {
                                Alert.alert(
                                    "Créditos Insuficientes",
                                    "Para ativar a localização em tempo real, você precisa ter créditos disponíveis. Adicione créditos para continuar.",
                                    [{ text: "OK" }]
                                );
                            } else {
                                const currentTrackingState = tracking;

                                if (!currentTrackingState) {
                                    // USUÁRIO QUER INICIAR - MOSTRA TEMPORIZADOR DE 6 SEGUNDOS

                                    if (!authResponse?.user?.id) {
                                        console.warn('🎯[DRIVER_MAP] USUÁRIO NÃO AUTENTICADO.');
                                        return;
                                    }

                                    try {
                                        const vehicle = await vehicleRegisterViewModel.getMainVehicleByUserId(
                                            authResponse.user.id
                                        );

                                        if (vehicle && 'statusCode' in vehicle) {
                                            console.error('🎯[DRIVER_MAP] ERRO AO BUSCAR VEÍCULO: ', vehicle);
                                            Alert.alert(
                                                'Erro',
                                                'Não foi possível verificar seu veículo principal. Tente novamente mais tarde.'
                                            );
                                            return;
                                        }

                                        if (vehicle?.id) {
                                            console.log('🎯[DRIVER_MAP] VEÍCULO PRINCIPAL DO USUÁRIO:', vehicle.id);
                                            console.log('⏰[STARTUP] INICIANDO TEMPORIZADOR DE INICIALIZAÇÃO DE 6 SEGUNDOS...');
                                            setStartupSeconds(6);
                                            setIsStartupActive(true);
                                            return;
                                        }

                                        Alert.alert(
                                            'Atenção',
                                            'Você ainda não tem um veículo principal definido, ou a documentação do veículo está incompleta. Defina um para começar a receber corridas e verifique se todos os documentos estão atualizados.',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => rootNavigation.navigate('VehiclesScreen')
                                                }
                                            ]
                                        );

                                    } catch (error) {
                                        console.error('🎯[DRIVER_MAP] ERRO AO CARREGAR VEÍCULO PRINCIPAL: ', error);

                                        Alert.alert(
                                            'Erro',
                                            'Não foi possível verificar seu veículo principal. Tente novamente mais tarde.'
                                        );

                                    } finally {
                                        console.log('🎯[DRIVER_MAP] VERIFICAÇÃO DE VEÍCULO PRINCIPAL CONCLUÍDA.');
                                    }

                                } else {
                                    // USUÁRIO QUER PARAR - DESATIVA TUDO IMEDIATAMENTE
                                    console.log('⏰[TIMER] PARANDO TRACKING MANUALMENTE...');
                                    setTracking(false);
                                    setIsTimerActive(false);
                                    setTimerSeconds(300);
                                    setIsStartupActive(false);
                                    setStartupSeconds(6);
                                }
                            }
                        }}
                        activeOpacity={0.85}
                        style={[
                            styles.mapTrackingButton,
                            (!hasCpf() || !hasCredits()) && { opacity: 0.5 }
                        ]}
                        disabled={!hasCpf() || !hasCredits()}
                    >
                        <Ionicons
                            name={tracking ? 'pause' : 'play'}
                            size={26}
                            color="#fff"
                            style={styles.mapTrackingButtonIcon}
                        />
                        <Text style={styles.mapTrackingButtonText}>
                            {!hasCpf() ? 'CPF Necessário' :
                                !hasCredits() ? 'Créditos Necessários' :
                                    (tracking ? 'Parar' : 'Iniciar')}
                        </Text>
                    </TouchableOpacity>

                    {/* TEMPORIZADOR DE 5 MINUTOS */}
                    {isTimerActive && (
                        <View style={styles.mainTimerContainer}>
                            <Ionicons name="timer-outline" size={20} color="#fff" style={styles.mainTimerIcon} />
                            <Text style={styles.mainTimerText}>
                                {formatTime(timerSeconds)} Procurando corridas...
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* MODAL DE LOGOUT */}
            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirmLogout={handleLogout}
                styles={styles}
            />

            {/* MODAL DE DOCUMENTOS */}
            <DocumentsModal
                visible={isDocumentsModalVisible}
                onClose={() => setDocumentsModalVisible(false)}
                styles={styles}
            />

            {/* MODAL DE SOLICITAÇÕES PRÓXIMAS */}
            <Modal
                visible={isClientRequestsModalVisible}
                animationType="fade"
                onRequestClose={() => setClientRequestsModalVisible(false)}
                transparent={true}
            >
                <FlatList
                    data={clientRequestResponse}
                    keyExtractor={(item: ClientRequestResponse) => item.id.toString()}
                    renderItem={({ item }: { item: ClientRequestResponse }) => (
                        <DriverClientRequestItemToDriverMyLocation
                            clientRequestResponse={item}
                            viewModel={driverClientRequestViewModel}
                            authResponse={authResponse}
                            onOfferSent={handleRemoveClientRequest}
                            onScheduledAccepted={handleCloseModalAndReset}
                        />
                    )}
                    contentContainerStyle={{ paddingTop: 50, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={3}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshingRequests}
                            onRefresh={handleRefreshRequests}
                            colors={['#FC7700']}
                            tintColor="#FC7700"
                            title="Atualizando solicitações..."
                            titleColor="#666"
                        />
                    }
                />
            </Modal>

            {/* MODAL DE INICIALIZAÇÃO - TEMPORIZADOR DE 6 SEGUNDOS */}
            {isStartupActive && (
                <View style={styles.startupModalOverlay}>
                    <View style={styles.startupModalContainer}>
                        <Ionicons name="rocket-outline" size={80} color="#fff" style={styles.startupModalIcon} />
                        <Text style={styles.startupModalTitle}>
                            Iniciando...
                        </Text>
                        <Text style={styles.startupModalTimer}>
                            {startupSeconds}
                        </Text>
                        <Text style={styles.startupModalSubtitle}>
                            Preparando para buscar corridas...
                        </Text>
                    </View>
                </View>
            )}

            {/* MODAL DE PAUSA - TEMPORIZADOR DE 10 SEGUNDOS */}
            {isPauseActive && (
                <View style={styles.pauseModalOverlay}>
                    <View style={styles.pauseModalContainer}>
                        <Ionicons name="time-outline" size={80} color="#fff" style={styles.pauseModalIcon} />
                        <Text style={styles.pauseModalTitle}>
                            Procurando novos clientes
                        </Text>
                        <Text style={styles.pauseModalTimer}>
                            {pauseSeconds}
                        </Text>
                        <Text style={styles.pauseModalSubtitle}>
                            Aguarde a busca...
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.bottomBar} />
        </View>
    );
}