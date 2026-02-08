// ARQUIVO: presentation/screens/driver/tripMap/DriverTripMapScreen.tsx
// AUTOR: PARTIU DEV TEAM | HUGO PORTO
// DATA: 18-12-2025
// DESCRIÇÃO: TELA DE MAPA DA VIAGEM DO MOTORISTA COM FUNCIONALIDADES DE TRACKING, CHAT E UPLOAD DE IMAGENS

// IMPORTAÇÕES ORGANIZADAS POR CATEGORIAS

// 1️⃣ REACT (SEMPRE PRIMEIRO)
import React, { useEffect, useRef, useState } from "react";

// 2️⃣ REACT NATIVE CORE (COMPONENTES NATIVOS)
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    Modal,
    PixelRatio,
    Platform,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from "react-native";

// 2️⃣.1️⃣ DETECÇÃO DE REDE
import NetInfo from '@react-native-community/netinfo';

// 3️⃣ BIBLIOTECAS DE TERCEIROS - NAVEGAÇÃO
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenProps } from "@react-navigation/stack";

// 4️⃣ BIBLIOTECAS DE TERCEIROS - MAPAS
import MapView, { Camera, LatLng, Marker, Polyline, Region } from "react-native-maps";

// 5️⃣ BIBLIOTECAS DE TERCEIROS - OUTRAS
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { decode } from "@googlemaps/polyline-codec";
import Toast from 'react-native-toast-message';

// 6️⃣ BIBLIOTECAS DE TERCEIROS - ÍCONES
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// 7️⃣ TIPOS/NAVEGADORES LOCAIS
import { DriverMapStackParamList } from "../../../navigator/DriverMapStackNavigator";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";

// 8️⃣ CONTEXTS/HOOKS LOCAIS
import { useAuth } from "../../../hooks/useAuth";
import { useUserRole } from "../../../context/UserRoleContext";

// 9️⃣ MODELS/TYPES LOCAIS
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { Status } from "../../../../domain/repository/ClientRequestRepository";

// 🔟 VIEWMODELS/SERVICES/CONTAINER DI
import { container } from "../../../../di/container";
import { DriverTripMapViewModel } from "./DriverTripMapViewModel";

// 1️⃣1️⃣ COMPONENTES LOCAIS
import { DateSeparator } from "../../chat/ChatComponents";
import { ModalSecurity } from './components/ModalSecurity';

// 1️⃣2️⃣ ESTILOS
import styles from './Styles';
import { darkMapStyle } from '../myLocationMap/Styles';
import { orangeMapStyle } from '../../client/searchMap/Styles';
import { styles as chatStyles } from '../../chat/ChatScreenStyles';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";

import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends StackScreenProps<DriverMapStackParamList, 'DriverTripMapScreen'> { };

interface Message {
    id: string;
    text: string;
    timestamp: Date;
    isMe: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'audio';
}

export function DriverTripMapScreen({ navigation, route }: Props) {
    // 1️⃣ PROPS/PARAMS (VALORES QUE VÊM DE FORA)
    const { idClientRequest } = route.params;

    // 2️⃣ HOOKS DE CONTEXTO/NAVEGAÇÃO (useAuth, useNavigation, useUserRole)
    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();
    const { userRole } = useUserRole();
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // 3️⃣ DEPENDÊNCIAS INJETADAS (ViewModels, SERVICES VIA DI)
    const viewModel: DriverTripMapViewModel = container.resolve('driverTripMapViewModel');

    // 4️⃣ ESTADOS (useState) - AGRUPADOS POR CATEGORIA
    // ESTADOS DO MAPA
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [mapTheme, setMapTheme] = useState<'dark' | 'orange'>('orange');

    // 5️⃣ ESTADOS DA VIAGEM
    const [clientRequest, setClientRequest] = useState<ClientRequestResponse | null>(null);
    const [currentStatus, setCurrentStatus] = useState(Status.ACCEPTED);
    const [tracking] = useState<boolean>(true);

    // 6️⃣ ESTADOS DO CHAT
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardEverOpened, setIsKeyboardEverOpened] = useState(false);

    // 7️⃣ ESTADOS DE IMAGEM DO PACOTE
    const [packageImage, setPackageImage] = useState<string | null>(null);
    const [packageImageEnd, setPackageImageEnd] = useState<string | null>(null);
    const [showImageOptionsModal, setShowImageOptionsModal] = useState(false);
    const [showImageEndOptionsModal, setShowImageEndOptionsModal] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
    const [isUploadingImageEnd, setIsUploadingImageEnd] = useState(false);
    const [imageEndUploadSuccess, setImageEndUploadSuccess] = useState(false);

    // 8️⃣ ESTADOS DO CÓDIGO DE SEGURANÇA
    const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
    const [securityCode, setSecurityCode] = useState('');
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);

    // 9️⃣ ESTADOS DE CONEXÃO COM INTERNET E SOCKET
    const [isOnline, setIsOnline] = useState(true);
    const [showOfflineAlert, setShowOfflineAlert] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

    // 🔟 REFS (useRef)
    const animatedValue = useRef(new Animated.Value(0)).current;
    const mapRef = useRef<MapView>(null);
    let locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const socketInitialized = useRef<boolean>(false); // Controle para evitar múltiplas inicializações
    const flatListRef = useRef<FlatList>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // 🔹 CONTROLE DE RECONEXÃO
    const isReconnecting = useRef<boolean>(false);
    const lastReconnectAttempt = useRef<number>(0);
    const reconnectAttempts = useRef<number>(0);
    const reconnectionTimeout = useRef<NodeJS.Timeout | null>(null);
    const socketHealthCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000; // 3 segundos

    // REANIMATED SHARED VALUES PARA CONTROLE GESTUAL DO PAINEL
    const panelTranslateY = useSharedValue(0); // POSIÇÃO Y ATUAL DO PAINEL
    const panelHeight = useSharedValue(0.45); // ALTURA INICIAL: 45% DA TELA
    const panelContext = useSharedValue({ y: 0 }); // CONTEXTO PARA GESTOS

    // Calcula os 3 estados do painel
    const screenHeight = Dimensions.get('window').height; // ALTURA DA TELA
    console.log('screenHeight:', screenHeight);
    const PANEL_STATE_EXPANDED_FULL = -(screenHeight * 0.01);
    console.log('PANEL_STATE_EXPANDED_FULL:', PANEL_STATE_EXPANDED_FULL);
    const PANEL_STATE_NORMAL = 0; // ESTADO NORMAL (45% DA TELA)
    console.log('PANEL_STATE_NORMAL:', PANEL_STATE_NORMAL);
    const PANEL_STATE_COLLAPSED = (screenHeight * 0.45) - 150; // COLAPSADO (DEIXA 100PX VISÍVEL)
    console.log('PANEL_STATE_COLLAPSED:', PANEL_STATE_COLLAPSED);

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
        // INICIAR RENOVAÇÃO PREVENTIVA A CADA 45 MINUTOS
        const refreshInterval = setInterval(async () => {
            console.log('🔄 Renovação preventiva de token...');
            await viewModel.refreshSocketToken();
        }, 45 * 60 * 1000); // 45 MINUTOS

        return () => clearInterval(refreshInterval);
    }, []);

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
            // DESCONECTA SOCKET EXISTENTE
            console.log('🔄[RECONNECT] 🔌 Desconectando socket antigo...');
            if (socketInitialized.current) {
                viewModel.disconnectSocket();
                socketInitialized.current = false;
            }

            // AGUARDA UM POUCO ANTES DE RECONECTAR
            await new Promise(resolve => setTimeout(resolve, 1000));

            // RECONECTA SOCKET SE TRACKING ESTIVER ATIVO E TIVER CLIENT REQUEST
            if (tracking && clientRequest) {
                console.log('🔄[RECONNECT] 📡 Reconectando Socket...');
                viewModel.initSocket();
                socketInitialized.current = true;
                console.log('🔄[RECONNECT] ✅ Socket reconectado');
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
    }, [tracking, clientRequest, viewModel]);

    // ==========================================================================
    // ============ useEffect PARA CARREGAR A SOLICITAÇÃO DO CLIENTE ============
    // ==========================================================================
    useEffect(() => {
        handleGetClientRequestById();
    }, []);

    // =======================================================================
    // ============ useEffect PARA CARREGAR O TEMA DO MAPA SALVO =============
    // =======================================================================
    useEffect(() => {
        loadMapTheme();
    }, []);

    // ==================================================================
    // ============ EFEITO PARA GERENCIAR EVENTOS DO TECLADO ============
    // ==================================================================
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    // ============================================================================
    // ============ USEEFFECT PARA MONITORAR STATUS DA CONEXÃO COM INTERNET =======
    // ====================== E QUALIDADE DA CONEXÃO ==============================
    // ============================================================================
    useEffect(() => {
        console.log('🌐[TRIP_MAP] 📡 INICIALIZANDO LISTENER DE CONEXÃO E HEALTH CHECK');

        // SUBSCREVE AO STATUS DA CONEXÃO
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('🌐[TRIP_MAP] 📶 STATUS DA CONEXÃO:', {
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
                console.log('🌐[TRIP_MAP] ❌ INTERNET CAIU!');
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
                console.log('🌐[TRIP_MAP] ✅ INTERNET RECONECTADA! Iniciando reconexão de sockets...');
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
                console.log('🌐[TRIP_MAP] ⚠️ QUALIDADE DA CONEXÃO DEGRADOU');
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
            if (isOnline && tracking && socketInitialized.current) {
                // VERIFICA STATUS DO SOCKET (assumindo que existe um método no viewModel)
                console.log('🏥[HEALTH_CHECK] Verificando status do socket...');

                // SE INTERNET OK MAS SOCKET DESCONECTADO, TENTA RECONECTAR
                if (!socketInitialized.current) {
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
            console.log('🌐[TRIP_MAP] 🧹 REMOVENDO LISTENER DE CONEXÃO E HEALTH CHECK');
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

    // ============================================================================
    // ============ useEffect PARA GERENCIAR LOCALIZAÇÃO EM TEMPO REAL ============
    // ============================================================================
    useEffect(() => {
        if (clientRequest !== null) {
            (async () => {
                // 1. SOLICITAR PERMISSÃO DE FOREGROUND
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert(
                        'Permissão Negada',
                        'O aplicativo precisa de permissão para acessar a localização.'
                    );
                    return;
                }

                // 2. SOLICITAR PERMISSÃO DE BACKGROUND (ANDROID E iOS)
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

                // 3. INICIAR <tracking> IMEDIATAMENTE (NÃO ESPERA <getCurrentPositionAsync>).
                if (tracking) {
                    startRealTimeLocation();
                } else {
                    stopRealTimeLocation();
                }

                // 3. BUSCAR LOCALIZAÇÃO ATUAL DO MOTORISTA E DIREÇÕES EM PARALELO (NÃO BLOQUEIA <tracking>).
                try {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced, // MAIS RÁPIDO QUE High/BestForNavigation.
                    });

                    if (!location) {
                        Alert.alert('Erro', 'Não foi possível obter a localização atual.');
                        return;
                    }

                    // MOVE CÂMERA PARA LOCALIZAÇÃO ATUAL DO MOTORISTA.
                    moveCameraToLocation(location.coords.latitude, location.coords.longitude);

                    // CRIA A ROTA INICIAL DO MOTORISTA ATÉ O PONTO DE EMBARQUE (NÃO BLOQUEIA NADA).
                    handleGetDirections(
                        {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        },
                        {
                            latitude: clientRequest.pickup_position.y,
                            longitude: clientRequest.pickup_position.x,
                        }
                    );
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível obter a localização atual.');
                    console.error('❌ ERRO AO OBTER LOCALIZAÇÃO: ', error);
                }
            })();
        }

        // CLEANUP: PARAR <tracking> QUANDO COMPONENTE DESMONTAR OU <clientRequest> MUDAR.
        return () => {
            if (!tracking) {
                stopRealTimeLocation();
            }
        };
    }, [clientRequest]);

    // =========================================================================
    // ============ useFocusEffect PARA GERENCIAR RECURSOS AO FOCAR ============
    // =========================================================================
    useFocusEffect(
        React.useCallback(() => {
            return async () => {
                // AÇÃO AO SAIR DA TELA (DESFOCAR)
                try {
                    // REMOVER SUBSCRIPTION DE LOCALIZAÇÃO AO SAIR DA TELA
                    if (locationSubscription.current) {
                        await locationSubscription.current.remove();
                        locationSubscription.current = null;
                        setLocation(undefined);
                    }

                    // DESCONECTAR SOCKET AO SAIR DA TELA
                    if (socketInitialized.current) {
                        viewModel.disconnectSocket();
                        socketInitialized.current = false;
                    }
                } catch (error) {
                    console.error('🛑[STOP] ❌ ERRO AO REMOVER SUBSCRIPTION: ', error);
                }
            };
        }, [])
    );

    // ==========================================================================
    // ============ useEffect PARA MONITORAR CANCELAMENTO DA CORRIDA ============
    // ==========================================================================
    useEffect(() => {
        if (currentStatus === Status.CANCELLED) {
            Alert.alert(
                'Corrida Cancelada',
                'A corrida foi cancelada pelo cliente.',
                [{ text: 'OK', onPress: () => rootNavigation.replace('DriverHomeScreen') }],
                { cancelable: false }
            );
        }
    }, [currentStatus]);

    // =========================================================================
    // ============ useFocusEffect PARA VERIFICAR STATUS DA CORRIDA ============
    // =========================================================================
    useFocusEffect(
        React.useCallback(() => {
            const checkRequestStatus = async () => {
                if (clientRequest?.id) {
                    const result = await viewModel.checkIfFinishedOrCancelled(clientRequest.id);

                    if (result && 'id' in result) {
                        Alert.alert(
                            'Corrida cancelada ou já finalizada',
                            'A corrida está indisponível no momento.',
                            [{ text: 'OK', onPress: () => rootNavigation.replace('DriverHomeScreen') }],
                            { cancelable: false }
                        );
                    }
                }
            };

            checkRequestStatus();
        }, [clientRequest?.id])
    );

    // =============================================================================
    // ============ FUNÇÃO PARA OBTER O ESTILO DO MAPA BASEADO NO TEMA =============
    // =============================================================================
    const getMapStyle = () => {
        switch (mapTheme) {
            case 'dark':
                return darkMapStyle;
            case 'orange':
                return orangeMapStyle;
            default:
                return orangeMapStyle; // LARANJA COMO PADRÃO
        }
    };

    // ==============================================================================
    // ============ FUNÇÃO PARA CARREGAR O TEMA DO MAPA DO ASYNCSTORAGE =============
    // ==============================================================================
    const loadMapTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('mapTheme');
            if (savedTheme && ['dark', 'orange'].includes(savedTheme)) {
                setMapTheme(savedTheme as 'dark' | 'orange');
            }
        } catch (error) {
            console.error('ERRO AO CARREGAR TEMA DO MAPA: ', error);
        }
    };

    // =================================================================
    // ============ FUNÇÃO PARA CONTROLAR ZOOM CUSTOMIZADO =============
    // =================================================================
    const handleZoom = (type: 'in' | 'out') => {
        animateZoom();
        if (mapRef.current && location) {
            mapRef.current.getCamera().then((camera: Camera) => {
                let newZoom = camera.zoom ?? 15;
                if (type === 'in') newZoom += 1;
                if (type === 'out') newZoom -= 1;
                mapRef.current?.animateCamera({ ...camera, zoom: newZoom }, { duration: 300 });
            });
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

    // ============================================================================
    // ============ FUNÇÃO PARA OBTER A SOLICITAÇÃO DO CLIENTE PELO ID ============
    // ============================================================================
    const handleGetClientRequestById = async () => {
        const response = await viewModel.getClientRequestById(idClientRequest);

        if ('id' in response) {
            setClientRequest(response);
        }
    }

    // ===========================================================================
    // ============ FUNÇÕES PARA TIRAR FOTO E ENVIAR IMAGEM DO PACOTE ============
    // ===========================================================================
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão necessária',
                'Precisamos de acesso à câmera para tirar a foto.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
            setPackageImage(result.assets[0].uri);
            setImageUploadSuccess(false);
            setShowImageOptionsModal(false);
        }
    };

    const takePhotoEnd = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão necessária',
                'Precisamos de acesso à câmera para tirar a foto.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
            setPackageImageEnd(result.assets[0].uri);
            setImageEndUploadSuccess(false);
            setShowImageEndOptionsModal(false);
        }
    };

    // =============================================================================
    // ============ FUNÇÕES PARA ENVIAR IMAGEM DO PACOTE PARA O BACKEND ============
    // =============================================================================
    const handleUploadPackageImage = async () => {
        if (!packageImage || !clientRequest?.id) {
            Alert.alert(
                'Erro',
                'Nenhuma imagem selecionada.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        setIsUploadingImage(true);

        try {
            const result = await viewModel.uploadPackageImage(packageImage, clientRequest.id);

            if ('success' in result && result.success) {
                setImageUploadSuccess(true);
                Alert.alert('Sucesso', 'Foto enviada com sucesso!');
            } else {
                Alert.alert('Erro', 'Falha ao enviar a foto. Tente novamente.');
            }
        } catch (error) {
            console.error('ERRO AO FAZER UPLOAD DA FOTO: ', error);
            Alert.alert('Erro', 'Ocorreu um erro ao enviar a foto.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleUploadPackageImageEnd = async () => {
        if (!packageImageEnd || !clientRequest?.id) {
            Alert.alert(
                'Erro',
                'Nenhuma imagem selecionada.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        setIsUploadingImageEnd(true);

        try {
            const result = await viewModel.uploadPackageImageEnd(packageImageEnd, clientRequest.id);

            if ('success' in result && result.success) {
                setImageEndUploadSuccess(true);
                Alert.alert('Sucesso', 'Foto final enviada com sucesso!');
            } else {
                Alert.alert('Erro', 'Falha ao enviar a foto final. Tente novamente.');
            }
        } catch (error) {
            console.error('ERRO AO FAZER UPLOAD DA FOTO FINAL: ', error);
            Alert.alert('Erro', 'Ocorreu um erro ao enviar a foto final.');
        } finally {
            setIsUploadingImageEnd(false);
        }
    };

    // ===================================================================
    // ============ FUNÇÃO PARA VERIFICAR CÓDIGO DE SEGURANÇA ============
    // ===================================================================
    const handleVerifySecurityCode = async () => {
        if (securityCode.length !== 6) {
            Alert.alert(
                'Código Inválido',
                'O código de segurança deve ter 6 dígitos.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        if (!clientRequest?.id) {
            Alert.alert('Erro', 'Solicitação não encontrada.', [{ text: 'OK' }], { cancelable: false });
            return;
        }

        setIsVerifyingCode(true);

        try {
            const result = await viewModel.validateDeliveryCode(clientRequest.id, securityCode);

            setIsVerifyingCode(false);

            if (typeof result === 'boolean') {
                if (result === true) {
                    console.log('✅ Código verificado com sucesso!');
                    Alert.alert(
                        'Código Verificado',
                        'Código de segurança confirmado com sucesso!',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    setShowSecurityCodeModal(false);
                                    setSecurityCode('');
                                    handleUpdateStatusToFinished();
                                }
                            }
                        ], { cancelable: false }
                    );
                } else {
                    await viewModel.updateInvalidCode(clientRequest.id, securityCode);

                    Alert.alert(
                        'Código Inválido',
                        'O código informado está incorreto. Tente novamente.',
                        [
                            {
                                text: 'OK',
                                onPress: () => setSecurityCode('')
                            }
                        ], { cancelable: false }
                    );
                }
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro ao verificar o código. Tente novamente.',
                    [
                        {
                            text: 'OK',
                            onPress: () => setSecurityCode('')
                        }
                    ], { cancelable: false }
                );
            }
        } catch (error) {
            setIsVerifyingCode(false);
            console.error('❌ Erro ao verificar código:', error);
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao verificar o código. Tente novamente.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }
    };

    // ==========================================================
    // ============ FUNÇÕES DE ATUALIZAÇÃO DE STATUS ============
    // ==========================================================
    const handleUpdateStatusToStarted = async () => {
        // ATUALIZA STATUS PARA INICIADO
        const response = await viewModel.updateStatus(idClientRequest, Status.STARTED);

        if (typeof response === 'boolean') {
            setCurrentStatus(Status.STARTED);

            // EMITE VIA SOCKET A ATUALIZAÇÃO DE STATUS PARA O CLIENTE
            viewModel.emitUpdateStatus(idClientRequest, Status.STARTED);

            // BUSCA LOCALIZAÇÃO ATUAL DO MOTORISTA PARA CRIAR ROTA ATÉ DESTINO FINAL
            if (!location) {
                Alert.alert('Erro', 'Não foi possível obter a localização atual do motorista.', [{ text: 'OK' }], { cancelable: false });
                return;
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Rota iniciada',
                    text2: 'Calculando rota até o destino final...',
                    position: 'bottom',
                    bottomOffset: 100,
                    visibilityTime: 3000,
                });
            }

            // CRIA ROTA DO MOTORISTA ATÉ O DESTINO FINAL
            handleGetDirections(
                {
                    latitude: location!.latitude,
                    longitude: location!.longitude
                },
                {
                    latitude: clientRequest!.destination_position.y,
                    longitude: clientRequest!.destination_position.x,
                }
            );
        }
    }

    // =====================================================================
    // ============ FUNÇÃO PARA CALCULAR DISTÂNCIA ENTRE DUAS COORDENADAS ============
    // =====================================================================
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3; // Raio da Terra em metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distância em metros
    }

    // =====================================================================
    // ============ FUNÇÃO DE ATUALIZAÇÃO DE STATUS PARA CHEGOU ============
    // =====================================================================
    const handleUpdateStatusToArrived = async () => {
        // Verificar se tem localização atual do motorista
        if (!location) {
            Alert.alert(
                'Localização Indisponível',
                'Aguarde enquanto obtemos sua localização atual.'
            );
            return;
        }

        // Verificar se tem ponto de embarque
        if (!clientRequest?.pickup_position) {
            Alert.alert('Erro', 'Ponto de embarque não encontrado.');
            return;
        }

        // Calcular distância entre motorista e ponto de embarque
        const distance = calculateDistance(
            location.latitude,
            location.longitude,
            clientRequest.pickup_position.y,
            clientRequest.pickup_position.x
        );

        // Verificar se está a pelo menos 50 metros do ponto de embarque
        if (distance > 50) {
            Alert.alert(
                'Muito Longe',
                `Você está a ${distance.toFixed(0)} metros do ponto de embarque. Aproxime-se mais para marcar como chegou (no máximo 50 metros).`
            );
            return;
        }

        const response = await viewModel.updateStatus(idClientRequest, Status.ARRIVED);

        if (typeof response === 'boolean') {
            setCurrentStatus(Status.ARRIVED);
            viewModel.emitUpdateStatus(idClientRequest, Status.ARRIVED);
        }
    }

    // ========================================================================
    // ============ FUNÇÃO DE ATUALIZAÇÃO DE STATUS PARA CANCELADO ============
    // ========================================================================
    const handleUpdateStatusToCancelled = async () => {
        const response = await viewModel.updateStatus(idClientRequest, Status.CANCELLED);

        if (typeof response === 'boolean') {
            setCurrentStatus(Status.CANCELLED);
            viewModel.emitUpdateStatus(idClientRequest, Status.CANCELLED);
            rootNavigation.replace('DriverHomeScreen');
        }
    }

    // =========================================================================
    // ============ FUNÇÃO DE ATUALIZAÇÃO DE STATUS PARA FINALIZADO ============
    // =========================================================================
    const handleUpdateStatusToFinished = async () => {
        const response = await viewModel.updateStatusFinished(idClientRequest, Status.FINISHED, clientRequest!, authResponse?.user.id!);

        if (typeof response === 'boolean') {
            setCurrentStatus(Status.FINISHED);
            viewModel.emitUpdateStatus(idClientRequest, Status.FINISHED);
            navigation.replace('DriverTripRatingScreen', {
                clientRequest: clientRequest!
            });
        }
    }

    // ===================================================================
    // ============ FUNÇÃO PARA MOVER CÂMERA PARA LOCALIZAÇÃO ============
    // ===================================================================
    const moveCameraToLocation = (lat: number, lng: number) => {
        const camera: Camera = {
            center: {
                latitude: lat,
                longitude: lng
            },
            pitch: 0,
            heading: 0,
            zoom: 15
        };
        mapRef.current?.animateCamera(camera, { duration: 1000 })
    }

    // ===================================================================
    // ============ FUNÇÃO PARA OBTER DIREÇÕES DO GOOGLE MAPS ============
    // ===================================================================
    const handleGetDirections = async (origin: LatLng, destination: LatLng) => {
        const response: GoogleDirections | null = await viewModel.getDirections(origin, destination);

        if (response !== null) {
            if (response.routes.length) {
                const points = response.routes[0].overview_polyline.points;
                const coordinates = decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

                setDirectionsRoute(coordinates);

                // AJUSTA O ZOOM PARA MOSTRAR TODA A ROTA
                setTimeout(() => {
                    if (mapRef.current && coordinates.length > 0) {
                        mapRef.current.fitToCoordinates(coordinates, {
                            edgePadding: {
                                top: 100,
                                right: 50,
                                bottom: 400,
                                left: 50
                            },
                            animated: true
                        });
                    }
                }, 300);
            }
        }
    }

    // =================================================
    // ============ ENVIA MENSAGEM NO CHAT =============
    // =================================================
    const sendMessage = async () => {
        if (inputText.trim() === '') return;
        if (clientRequest && clientRequest.id) {
            try {
                let id_receiver = 0; // DETERMINAR O RECEPTOR BASEADO NA ROLE DO USUÁRIO

                if (userRole === 'CLIENT') {
                    id_receiver = clientRequest?.id_driver_assigned || 0; // CLIENTE ENVIA PARA O MOTORISTA
                } else if (userRole === 'DRIVER') {
                    id_receiver = clientRequest?.id_client || 0; // MOTORISTA ENVIA PARA O CLIENTE
                }

                if (id_receiver === 0) {
                    console.error('❌ ID DO RECEPTOR NÃO ENCONTRADO!');
                    return;
                }

                await viewModel.sendMessage({
                    text: inputText.trim(),
                    timestamp: new Date(),
                    isMe: true,
                    status: 'read',
                    type: 'text',
                    id_user: authResponse?.user.id || 0,
                    id_sender: authResponse?.user.id || 0,
                    id_receiver: id_receiver,
                    id_client_request: clientRequest?.id || 0
                });

                setMessages(prevMessages => { // ATUALIZAR A LISTA DE MENSAGENS
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        text: inputText.trim(),
                        timestamp: new Date(),
                        isMe: true,
                        status: 'sent',
                        type: 'text',
                    };

                    return [...prevMessages, newMessage];
                });

                // LIMPAR O INPUT APÓS ENVIAR COM SUCESSO
                setInputText('');

            } catch (error) {
                console.error('❌ ERRO AO ENVIAR MENSAGEM: ', error);
            }
        } else {
            console.log('❌ NENHUMA SOLICITAÇÃO ATIVA PARA ENVIAR MENSAGEM.');
        }
    };

    const startRealTimeLocation = async () => {
        // EVITA MÚLTIPLAS INICIALIZAÇÕES
        if (locationSubscription.current) {
            console.log('⚠️ LOCATION SUBSCRIPTION JÁ EXISTE, IGNORANDO...');
            return;
        }

        try {
            // INICIA O TRACKING DE LOCALIZAÇÃO EM TEMPO REAL
            locationSubscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 2000, // PRECISO #MELHORAR ISSO
                    distanceInterval: 1
                },
                (newLocation) => {
                    setLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.0922, // VALOR PADRÃO PARA ZOOM INICIAL
                        longitudeDelta: 0.0421 // VALOR PADRÃO PARA ZOOM INICIAL
                    });

                    viewModel.emitDriverPosition(
                        clientRequest?.id_client!,
                        newLocation.coords.latitude,
                        newLocation.coords.longitude
                    );
                }
            );

            // INICIALIZAR SOCKET APENAS UMA VEZ
            if (!socketInitialized.current) {
                viewModel.initSocket();
                socketInitialized.current = true;

                // CONFIGURAR LISTENER DE CHAT APENAS UMA VEZ
                viewModel.listenerChatMessageClient((data: any) => {
                    if (userRole === 'DRIVER') {
                        if (authResponse?.user?.id === data.id_receiver) {

                            // VERIFICAR SE A MENSAGEM JÁ EXISTE
                            setMessages((prevMessages) => {
                                const messageExists = prevMessages.find(msg => msg.id === data.id.toString());
                                if (messageExists) {
                                    return prevMessages;
                                }

                                const newMessage: Message = {
                                    id: data.id.toString(),
                                    text: data.text.trim(),
                                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                                    isMe: false,
                                    status: 'delivered',
                                    type: 'text',
                                };

                                return [...prevMessages, newMessage];
                            });

                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                        }
                    }
                });

                // CONFIGURAR LISTENER DE ATUALIZAÇÃO DE STATUS
                viewModel.listenerUpdateStatusSocket(idClientRequest, (data: any) => {
                    // SE CANCELADO, ATUALIZAR ESTADO LOCAL
                    if (data.status === Status.CANCELLED) {
                        setCurrentStatus(Status.CANCELLED);
                    }
                });
            }
        } catch (error) {
            console.error('❌ ERRO AO INICIAR TRACKING:', error);
            locationSubscription.current = null;
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível iniciar o rastreamento de localização.',
                position: 'bottom',
                bottomOffset: 100,
                visibilityTime: 3000,
            });
        }
    }

    // =====================================================================
    // ============ FUNÇÃO PARA PARAR LOCALIZAÇÃO EM TEMPO REAL ============
    // =====================================================================
    const stopRealTimeLocation = async () => {
        if (locationSubscription.current) {
            try {
                await locationSubscription.current.remove();
                locationSubscription.current = null;
                console.log('✅ LOCATION SUBSCRIPTION REMOVIDA.');
            } catch (error) {
                console.error('❌ ERRO AO REMOVER LOCATION SUBSCRIPTION: ', error);
            }
        }
    }

    const toogleView = (isInteractingWithMap: boolean) => {
        setIsInteractingWithMap(isInteractingWithMap);

        Animated.timing(animatedValue, {
            toValue: isInteractingWithMap ? 1 : 0,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Gesture handler para controle do painel (3 estados: expandido, normal, colapsado)
     */
    const SPRING_CONFIG = { damping: 20, stiffness: 150 };
    const HEIGHT_NORMAL = 0.45;
    const HEIGHT_EXPANDED = 0.65;

    const panelGesture = Gesture.Pan()
        .onStart(() => {
            panelContext.value = { y: panelTranslateY.value };
        })
        .onUpdate((event) => {
            const newY = panelContext.value.y + event.translationY;
            panelTranslateY.value = Math.max(PANEL_STATE_EXPANDED_FULL, Math.min(PANEL_STATE_COLLAPSED, newY));
        })
        .onEnd((event) => {
            const velocity = event.velocityY;
            const position = panelTranslateY.value;

            // Swipe rápido para baixo -> colapsar
            if (velocity > 800) {
                panelTranslateY.value = withSpring(PANEL_STATE_COLLAPSED, SPRING_CONFIG);
                panelHeight.value = withSpring(HEIGHT_NORMAL, SPRING_CONFIG);
                runOnJS(setIsInteractingWithMap)(true);
            }
            // Swipe rápido para cima -> expandir
            else if (velocity < -800) {
                panelTranslateY.value = withSpring(PANEL_STATE_EXPANDED_FULL, SPRING_CONFIG);
                panelHeight.value = withSpring(HEIGHT_EXPANDED, SPRING_CONFIG);
                runOnJS(setIsInteractingWithMap)(false);
            }
            // Snap para estado mais próximo
            else {
                const distances = [
                    Math.abs(position - PANEL_STATE_EXPANDED_FULL),
                    Math.abs(position - PANEL_STATE_NORMAL),
                    Math.abs(position - PANEL_STATE_COLLAPSED)
                ];
                const minIndex = distances.indexOf(Math.min(...distances));

                if (minIndex === 0) {
                    panelTranslateY.value = withSpring(PANEL_STATE_EXPANDED_FULL, SPRING_CONFIG);
                    panelHeight.value = withSpring(HEIGHT_EXPANDED, SPRING_CONFIG);
                    runOnJS(setIsInteractingWithMap)(false);
                } else if (minIndex === 1) {
                    panelTranslateY.value = withSpring(PANEL_STATE_NORMAL, SPRING_CONFIG);
                    panelHeight.value = withSpring(HEIGHT_NORMAL, SPRING_CONFIG);
                    runOnJS(setIsInteractingWithMap)(false);
                } else {
                    panelTranslateY.value = withSpring(PANEL_STATE_COLLAPSED, SPRING_CONFIG);
                    panelHeight.value = withSpring(HEIGHT_NORMAL, SPRING_CONFIG);
                    runOnJS(setIsInteractingWithMap)(true);
                }
            }
        });

    const panelAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: panelTranslateY.value }],
        height: `${panelHeight.value * 100}%`
    }));

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isMe = item.isMe;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showDate = !prevMessage ||
            new Date(item.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();

        return (
            <>
                {showDate && <DateSeparator date={item.timestamp} />}
                <View style={[
                    chatStyles.messageContainer,
                    isMe ? styles.myMessageContainer : chatStyles.otherMessageContainer
                ]}>
                    {!isMe && (
                        <View style={chatStyles.avatarContainer}>
                            <View style={chatStyles.avatar}>
                                <Ionicons name="people" size={16} color="#fff" />
                            </View>
                        </View>
                    )}
                    <View style={[
                        chatStyles.messageBubble,
                        isMe ? chatStyles.myMessageBubble : chatStyles.otherMessageBubble
                    ]}>
                        <Text style={[
                            chatStyles.messageText,
                            isMe ? chatStyles.myMessageText : chatStyles.otherMessageText
                        ]}>
                            {item.text}
                        </Text>

                        <View style={chatStyles.messageFooter}>
                            <Text style={[
                                chatStyles.messageTime,
                                isMe ? chatStyles.myMessageTime : chatStyles.otherMessageTime
                            ]}>
                                {formatTime(item.timestamp)}
                            </Text>

                            {isMe && (
                                <View style={chatStyles.messageStatus}>
                                    {item.status === 'sending' && (
                                        <Ionicons name="time" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'sent' && (
                                        <Ionicons name="checkmark" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'delivered' && (
                                        <Ionicons name="checkmark-done" size={14} color="#B0BEC5" />
                                    )}
                                    {item.status === 'read' && (
                                        <Ionicons name="checkmark-done" size={14} color="#4CAF50" />
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {isMe && (
                        <View style={chatStyles.avatarContainer}>
                            <View style={chatStyles.avatar}>
                                <Ionicons name="car-sport" size={16} color="#fff" />
                            </View>
                        </View>
                    )}
                    {isMe && <View style={chatStyles.spacer} />}
                </View>
            </>
        );
    };

    if (!location) {
        return <View style={styles.container}></View>
    }

    return (
        <View style={styles.container}>
            {/* BARRA DE AVISO - SEM INTERNET */}
            {!isOnline && (
                <View style={styles.offlineBar}>
                    <Text style={styles.offlineBarText}>
                        ⚠️ Sem conexão com a internet
                    </Text>
                </View>
            )}

            {/* BARRA DE AVISO - CONEXÃO INSTÁVEL */}
            {isOnline && connectionQuality === 'poor' && (
                <View style={[styles.offlineBar, { backgroundColor: '#FF9800' }]}>
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

            <Animated.View
                style={{
                    transform: [
                        { scaleY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1] }) },
                        { translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }) },
                    ],
                    width: '100%',
                    position: 'absolute',
                    top: 0
                }}
            >
                <MapView
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: Dimensions.get('window').height * 0.95
                    }}
                    initialRegion={location}
                    zoomControlEnabled={false}
                    customMapStyle={getMapStyle()}
                    onRegionChangeComplete={(region) => {
                        toogleView(false);
                    }}
                    onPanDrag={() => toogleView(true)}
                >
                    {
                        location !== null && (
                            <Marker
                                coordinate={{
                                    latitude: location?.latitude!,
                                    longitude: location?.longitude!
                                }}
                                title="Minha Posição"
                            >
                                <View style={{
                                    backgroundColor: '#FC7700',
                                    borderRadius: Math.max(15, 45 / PixelRatio.get()),
                                    width: Math.max(30, 80 / PixelRatio.get()),
                                    height: Math.max(30, 80 / PixelRatio.get()),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: Math.max(2, 4 / PixelRatio.get()),
                                    borderColor: '#fff',
                                    overflow: 'hidden'
                                }}>
                                    {authResponse?.user.car ? (
                                        <Ionicons name="car" size={Math.max(16, 32 / PixelRatio.get())} color="#fff" />
                                    ) : (
                                        <MaterialIcons name="two-wheeler" size={Math.max(16, 32 / PixelRatio.get())} color="#fff" />
                                    )}
                                </View>
                            </Marker>
                        )
                    }
                    {
                        (clientRequest !== null && currentStatus === Status.ACCEPTED) && (
                            <Marker
                                coordinate={{
                                    latitude: clientRequest.pickup_position.y,
                                    longitude: clientRequest.pickup_position.x
                                }}
                                title="Origem"
                                anchor={{ x: 0.5, y: 0.5 }}
                            >
                                <View style={{
                                    backgroundColor: '#4CAF50',
                                    borderRadius: Math.max(15, 45 / PixelRatio.get()),
                                    width: Math.max(30, 80 / PixelRatio.get()),
                                    height: Math.max(30, 80 / PixelRatio.get()),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: Math.max(2, 4 / PixelRatio.get()),
                                    borderColor: '#fff',
                                    overflow: 'hidden'
                                }}>
                                    <Ionicons name="pin" size={Math.max(16, 32 / PixelRatio.get())} color="#fff" />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        (clientRequest !== null && currentStatus === Status.STARTED) && (
                            <Marker
                                coordinate={{
                                    latitude: clientRequest.destination_position.y,
                                    longitude: clientRequest.destination_position.x
                                }}
                                title="Destino"
                            >
                                <View style={{ width: 30, height: 30 }}>
                                    <Image
                                        source={require('../../../../assets/pin.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        directionsRoute.length > 0 && (
                            <>
                                <Polyline
                                    coordinates={directionsRoute}
                                    strokeWidth={8}
                                    strokeColor="black"
                                />
                                <Polyline
                                    coordinates={directionsRoute}
                                    strokeWidth={3}
                                    strokeColor="white"
                                    lineCap="round"
                                    lineJoin="round"
                                />
                            </>
                        )
                    }
                </MapView>

                {/* BOTÕES CUSTOMIZADOS DE ZOOM */}
                <View style={{ position: 'absolute', right: 16, bottom: 450, flexDirection: 'column', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => handleZoom('in')}
                        style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 8 }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name='add-outline' size={25} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleZoom('out')}
                        style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4 }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name='remove-outline' size={25} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setChatModalVisible(true)}
                        style={styles.mapChatButton}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name='chatbubble-outline' size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <ReanimatedAnimated.View
                style={[
                    panelAnimatedStyle,
                    {
                        width: '100%',
                        position: 'absolute',
                        bottom: -30,
                        backgroundColor: '#cef4feff',
                        paddingBottom: 55,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        zIndex: 1002,
                        elevation: 10,
                    }
                ]}
            >

                {/* Indicador visual (alça) para arrastar o painel - COM GESTURE */}
                <GestureDetector gesture={panelGesture}>
                    <ReanimatedAnimated.View style={{
                        width: '100%',
                        paddingVertical: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: 40,
                            height: 4,
                            backgroundColor: '#999',
                            borderRadius: 2,
                        }} />
                    </ReanimatedAnimated.View>
                </GestureDetector>

                <ScrollView
                    style={{
                        width: '100%',
                        height: '100%',
                        paddingHorizontal: 5,
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: 15,
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    decelerationRate="normal"
                >

                    {/* CARD DO CLIENTE */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 4,
                        borderWidth: 1,
                        borderColor: '#F5F5F5'
                    }}>
                        <Text style={[styles.textTitle, {
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#FF6B35',
                            marginBottom: 12,
                            marginLeft: 0,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }]}>👤 Seu Cliente</Text>
                        <View style={[styles.rowContainer, { marginLeft: 0, marginRight: 0, marginBottom: 0 }]}>
                            <View style={styles.dataContainer}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#1A1A1A',
                                    marginBottom: 4
                                }}>{clientRequest?.client.name} {clientRequest?.client.lastname}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    fontWeight: '400'
                                }}>📞 {clientRequest?.client.phone}</Text>
                            </View>
                            <View style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}>
                                <Image
                                    style={[styles.userImage, {
                                        borderWidth: 3,
                                        borderColor: '#FF6B35',
                                    }]}
                                    source={{ uri: clientRequest?.client.image }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* CARD DOS DADOS DA VIAGEM */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 4,
                        borderWidth: 1,
                        borderColor: '#F5F5F5'
                    }}>
                        <Text style={[styles.textTitle, {
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#FF6B35',
                            marginBottom: 16,
                            marginLeft: 0,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }]}>🚗 Detalhes da Viagem</Text>

                        {/* LOCALIZAÇÕES */}
                        <View style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 16
                        }}>
                            <View style={[styles.rowContainer, { marginLeft: 0, marginRight: 0, marginBottom: 8, alignItems: 'flex-start' }]}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#4CAF50',
                                    marginTop: 6,
                                    marginRight: 12
                                }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666',
                                        fontWeight: '500',
                                        marginBottom: 4,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>Origem</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#1A1A1A',
                                        fontWeight: '400',
                                        lineHeight: 20
                                    }}>{clientRequest?.pickup_description}</Text>
                                </View>
                            </View>

                            <View style={{
                                width: 2,
                                height: 20,
                                backgroundColor: '#E0E0E0',
                                marginLeft: 3,
                                marginVertical: 4
                            }} />

                            <View style={[styles.rowContainer, { marginLeft: 0, marginRight: 0, marginBottom: 0, alignItems: 'flex-start' }]}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#F44336',
                                    marginTop: 6,
                                    marginRight: 12
                                }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666',
                                        fontWeight: '500',
                                        marginBottom: 4,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>Destino</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#1A1A1A',
                                        fontWeight: '400',
                                        lineHeight: 20
                                    }}>{clientRequest?.destination_description}</Text>
                                </View>
                            </View>
                        </View>

                        {/* VALOR DA VIAGEM */}
                        <View style={{
                            backgroundColor: '#4CAF50',
                            borderRadius: 12,
                            padding: 16,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: '500',
                                marginBottom: 4,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>💰 Valor da Corrida</Text>
                            <Text style={{
                                fontSize: 24,
                                color: '#FFFFFF',
                                fontWeight: '700'
                            }}>R$ {clientRequest?.fare_assigned}</Text>
                        </View>
                    </View>

                    {/* BOTÃO DE AÇÃO PREMIUM */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: (
                                (currentStatus === Status.ARRIVED && clientRequest?.clientRequestType === 'delivery' && !imageUploadSuccess) ||
                                (currentStatus === Status.STARTED && clientRequest?.clientRequestType === 'delivery' && !imageEndUploadSuccess)
                            )
                                ? '#CCCCCC'
                                : '#FF6B35',
                            borderRadius: 16,
                            padding: 18,
                            marginTop: 8,
                            shadowColor: '#FF6B35',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            if (currentStatus === Status.ACCEPTED) {
                                handleUpdateStatusToArrived();
                            }
                            else if (currentStatus === Status.ARRIVED) {
                                // Para delivery, só permite iniciar se a foto foi enviada
                                if (clientRequest?.clientRequestType === 'delivery' && !imageUploadSuccess) {
                                    Alert.alert('Atenção', 'Você precisa tirar e enviar a foto do pacote antes de iniciar a viagem.');
                                    return;
                                }
                                handleUpdateStatusToStarted();
                            } else if (currentStatus === Status.STARTED) {
                                // Para delivery, só permite finalizar se a foto final foi enviada
                                if (clientRequest?.clientRequestType === 'delivery' && !imageEndUploadSuccess) {
                                    Alert.alert('Atenção', 'Você precisa tirar e enviar a foto final do pacote antes de finalizar a entrega.');
                                    return;
                                }
                                // Se for delivery, mostrar modal de código de segurança
                                if (clientRequest?.clientRequestType === 'delivery') {
                                    setShowSecurityCodeModal(true);
                                } else {
                                    handleUpdateStatusToFinished();
                                }
                            }
                        }}
                        disabled={
                            (currentStatus === Status.ARRIVED && clientRequest?.clientRequestType === 'delivery' && !imageUploadSuccess) ||
                            (currentStatus === Status.STARTED && clientRequest?.clientRequestType === 'delivery' && !imageEndUploadSuccess)
                        }
                        activeOpacity={0.8}
                    >
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12
                        }}>
                            <Ionicons
                                name={currentStatus === Status.ACCEPTED ? 'location' : 'checkmark-circle'}
                                size={20}
                                color={'white'}
                            />
                        </View>
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            flex: 1,
                            textAlign: 'center'
                        }}>
                            {currentStatus === Status.ACCEPTED
                                ? '📍 Notificar Chegada'
                                : (currentStatus === Status.ARRIVED
                                    ? '🚗 Iniciar Viagem'
                                    : '✅ Finalizar Viagem')
                            }
                        </Text>
                        <Ionicons name='chevron-forward' size={20} color={'rgba(255, 255, 255, 0.8)'} />
                    </TouchableOpacity>

                    {/* Botão Tirar Foto do Pacote - apenas para delivery após notificar chegada */}
                    {clientRequest?.clientRequestType === 'delivery' && currentStatus === Status.ARRIVED && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#4CAF50',
                                borderRadius: 16,
                                padding: 18,
                                marginTop: 8,
                                shadowColor: '#4CAF50',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => setShowImageOptionsModal(true)}
                            activeOpacity={0.8}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                <Ionicons
                                    name="camera"
                                    size={20}
                                    color={'white'}
                                />
                            </View>
                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                flex: 1,
                                textAlign: 'center'
                            }}>
                                📸 Tirar Foto do Pacote
                            </Text>
                            <Ionicons name='chevron-forward' size={20} color={'rgba(255, 255, 255, 0.8)'} />
                        </TouchableOpacity>
                    )}

                    {/* Botão Tirar Foto Final do Pacote - apenas para delivery após iniciar viagem */}
                    {clientRequest?.clientRequestType === 'delivery' && currentStatus === Status.STARTED && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#2196F3',
                                borderRadius: 16,
                                padding: 18,
                                marginTop: 8,
                                shadowColor: '#2196F3',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => setShowImageEndOptionsModal(true)}
                            activeOpacity={0.8}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12
                            }}>
                                <Ionicons
                                    name="camera"
                                    size={20}
                                    color={'white'}
                                />
                            </View>
                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                flex: 1,
                                textAlign: 'center'
                            }}>
                                📸 Tirar Foto Final do Pacote
                            </Text>
                            <Ionicons name='chevron-forward' size={20} color={'rgba(255, 255, 255, 0.8)'} />
                        </TouchableOpacity>
                    )}

                    {/* Preview da imagem do pacote com botão de enviar */}
                    {packageImage && clientRequest?.clientRequestType === 'delivery' && currentStatus === Status.ARRIVED && (
                        <View style={{
                            marginTop: 12,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            padding: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>
                                Foto do Pacote:
                            </Text>
                            <Image
                                source={{ uri: packageImage }}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 8,
                                    backgroundColor: '#F5F5F5'
                                }}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                    borderRadius: 15,
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => setPackageImage(null)}
                            >
                                <Ionicons name="close" size={18} color="#FFF" />
                            </TouchableOpacity>

                            {/* Botão Enviar Foto */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: imageUploadSuccess ? '#4CAF50' : '#2196F3',
                                    borderRadius: 12,
                                    padding: 14,
                                    marginTop: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: imageUploadSuccess ? '#4CAF50' : '#2196F3',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 4,
                                    opacity: isUploadingImage ? 0.6 : 1
                                }}
                                onPress={handleUploadPackageImage}
                                disabled={isUploadingImage || imageUploadSuccess}
                                activeOpacity={0.8}
                            >
                                {isUploadingImage ? (
                                    <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                                ) : (
                                    <Ionicons
                                        name={imageUploadSuccess ? "checkmark-circle" : "send"}
                                        size={20}
                                        color="#FFF"
                                        style={{ marginRight: 8 }}
                                    />
                                )}
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {isUploadingImage ? 'Enviando...' : (imageUploadSuccess ? 'Foto Enviada ✓' : 'Enviar Foto')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Preview da imagem final do pacote com botão de enviar */}
                    {packageImageEnd && clientRequest?.clientRequestType === 'delivery' && currentStatus === Status.STARTED && (
                        <View style={{
                            marginTop: 12,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            padding: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>
                                Foto Final do Pacote:
                            </Text>
                            <Image
                                source={{ uri: packageImageEnd }}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 8,
                                    backgroundColor: '#F5F5F5'
                                }}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                    borderRadius: 15,
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => setPackageImageEnd(null)}
                            >
                                <Ionicons name="close" size={18} color="#FFF" />
                            </TouchableOpacity>

                            {/* Botão Enviar Foto Final */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: imageEndUploadSuccess ? '#4CAF50' : '#2196F3',
                                    borderRadius: 12,
                                    padding: 14,
                                    marginTop: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: imageEndUploadSuccess ? '#4CAF50' : '#2196F3',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 4,
                                    opacity: isUploadingImageEnd ? 0.6 : 1
                                }}
                                onPress={() => {
                                    console.log('🔘 BOTÃO ENVIAR FOTO FINAL CLICADO!');
                                    console.log('📊 Estados: isUploadingImageEnd:', isUploadingImageEnd, 'imageEndUploadSuccess:', imageEndUploadSuccess);
                                    handleUploadPackageImageEnd();
                                }}
                                disabled={isUploadingImageEnd}
                                activeOpacity={0.8}
                            >
                                {isUploadingImageEnd ? (
                                    <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                                ) : (
                                    <Ionicons
                                        name={imageEndUploadSuccess ? "checkmark-circle" : "send"}
                                        size={20}
                                        color="#FFF"
                                        style={{ marginRight: 8 }}
                                    />
                                )}
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {isUploadingImageEnd ? 'Enviando...' : (imageEndUploadSuccess ? 'Foto Final Enviada ✓' : 'Enviar Foto Final')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fc0f0fff',
                            borderRadius: 16,
                            padding: 18,
                            marginTop: 8,
                            shadowColor: '#fc0f0fff',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            handleUpdateStatusToCancelled();
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12
                        }}>
                            <Ionicons
                                name='close-circle'
                                size={20}
                                color={'white'}
                            />
                        </View>
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            flex: 1,
                            textAlign: 'center'
                        }}>
                            Cancelar Viagem
                        </Text>
                        <Ionicons name='chevron-forward' size={20} color={'rgba(255, 255, 255, 0.8)'} />
                    </TouchableOpacity>

                </ScrollView>
            </ReanimatedAnimated.View>

            {/* MODAL DE CHAT */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isChatModalVisible}
                onRequestClose={() => setChatModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: '#fff', marginTop: Platform.OS === 'android' ? 25 : 0 }}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={{ flex: 1 }}>
                                    {/* HEADER DO CHAT */}
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalHeaderContent}>
                                            <View style={styles.modalHeaderIcon}>
                                                <Ionicons name="chatbubble" size={20} color="#fff" />
                                            </View>
                                            <View>
                                                <Text style={styles.modalHeaderTitle}>
                                                    Chat com o Passageiro
                                                </Text>
                                                <Text style={styles.modalHeaderSubtitle}>
                                                    Online
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setChatModalVisible(false)}
                                            style={styles.modalCloseButton}
                                        >
                                            <Ionicons name="close" size={24} color="#666" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* ÁREA DE MENSAGENS */}
                                    <TouchableWithoutFeedback>
                                        <View style={styles.chatMessageArea}>

                                            <FlatList
                                                ref={flatListRef}
                                                data={messages}
                                                renderItem={renderMessage}
                                                keyExtractor={(item) => item.id}
                                                contentContainerStyle={chatStyles.messagesList}
                                                style={{ flex: 1 }}
                                                showsVerticalScrollIndicator={false}
                                                onContentSizeChange={() => {
                                                    setTimeout(() => {
                                                        flatListRef.current?.scrollToEnd({ animated: true });
                                                    }, 100);
                                                }}
                                                onLayout={() => {
                                                    setTimeout(() => {
                                                        flatListRef.current?.scrollToEnd({ animated: false });
                                                    }, 500);
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>

                                    {/* INPUT DE MENSAGENS */}
                                    <View style={[
                                        styles.chatInputContainer,
                                        {
                                            marginBottom: keyboardHeight > 0
                                                ? 25
                                                : isKeyboardEverOpened
                                                    ? 0
                                                    : 0
                                        }
                                    ]}>
                                        <TextInput
                                            style={styles.chatTextInput}
                                            placeholder="Digite sua mensagem..."
                                            multiline
                                            value={inputText}
                                            onChangeText={setInputText}
                                            maxLength={500}
                                            placeholderTextColor="#999"
                                            onFocus={() => {
                                                setTimeout(() => {
                                                    flatListRef.current?.scrollToEnd({ animated: true });
                                                }, 300);
                                            }}
                                            onBlur={() => {
                                                // Garante que o layout retorna ao normal quando o teclado fecha
                                                setKeyboardHeight(0);
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={styles.chatSendButton}
                                            onPress={sendMessage}
                                        >
                                            <Ionicons name="send" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </View>
            </Modal>

            {/* Modal de Opções de Imagem do Pacote */}
            {showImageOptionsModal && (
                <Modal
                    visible={showImageOptionsModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowImageOptionsModal(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 24,
                            width: '100%',
                            maxWidth: 400,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8
                        }}>
                            {/* Header */}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: '#333'
                                }}>
                                    📸 Foto do Pacote
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowImageOptionsModal(false)}
                                    style={{
                                        padding: 4
                                    }}
                                >
                                    <Ionicons name="close" size={28} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Descrição */}
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                marginBottom: 20,
                                lineHeight: 20
                            }}>
                                Tire uma foto do pacote para registro da entrega
                            </Text>

                            {/* Opções */}
                            <View style={{ gap: 12 }}>
                                {/* Tirar Foto */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#4CAF50',
                                        padding: 16,
                                        borderRadius: 12,
                                        shadowColor: '#4CAF50',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                    onPress={takePhoto}
                                    activeOpacity={0.8}
                                >
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12
                                    }}>
                                        <Ionicons name="camera" size={22} color="#FFF" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: '#FFF',
                                            marginBottom: 2
                                        }}>
                                            Tirar Foto
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: 'rgba(255, 255, 255, 0.8)'
                                        }}>
                                            Usar a câmera do dispositivo
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.8)" />
                                </TouchableOpacity>

                                {/* Cancelar */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#F5F5F5',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginTop: 8
                                    }}
                                    onPress={() => setShowImageOptionsModal(false)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#666'
                                    }}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Modal de Opções de Imagem Final do Pacote */}
            {showImageEndOptionsModal && (
                <Modal
                    visible={showImageEndOptionsModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowImageEndOptionsModal(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 24,
                            width: '100%',
                            maxWidth: 400,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8
                        }}>
                            {/* Header */}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: '#333'
                                }}>
                                    📸 Foto Final do Pacote
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowImageEndOptionsModal(false)}
                                    style={{
                                        padding: 4
                                    }}
                                >
                                    <Ionicons name="close" size={28} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Descrição */}
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                marginBottom: 20,
                                lineHeight: 20
                            }}>
                                Tire uma foto final do pacote após a entrega
                            </Text>

                            {/* Opções */}
                            <View style={{ gap: 12 }}>
                                {/* Tirar Foto */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#2196F3',
                                        padding: 16,
                                        borderRadius: 12,
                                        shadowColor: '#2196F3',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                    onPress={takePhotoEnd}
                                    activeOpacity={0.8}
                                >
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12
                                    }}>
                                        <Ionicons name="camera" size={22} color="#FFF" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: '#FFF',
                                            marginBottom: 2
                                        }}>
                                            Tirar Foto
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: 'rgba(255, 255, 255, 0.8)'
                                        }}>
                                            Usar a câmera do dispositivo
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.8)" />
                                </TouchableOpacity>

                                {/* Cancelar */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#F5F5F5',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginTop: 8
                                    }}
                                    onPress={() => setShowImageEndOptionsModal(false)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#666'
                                    }}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Modal de Código de Segurança para Entrega */}
            <ModalSecurity
                visible={showSecurityCodeModal}
                securityCode={securityCode}
                isVerifyingCode={isVerifyingCode}
                onChangeCode={setSecurityCode}
                onCancel={() => {
                    setShowSecurityCodeModal(false);
                    setSecurityCode('');
                }}
                onVerify={handleVerifySecurityCode}
            />
            <View style={styles.bottomBar} />
            <Toast />
        </View>
    );
}