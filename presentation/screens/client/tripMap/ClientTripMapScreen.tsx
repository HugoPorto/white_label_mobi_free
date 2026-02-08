// ARQUIVO: presentation/screens/client/tripMap/ClientTripMapScreen.tsx
// AUTOR: PARTIU DEV TEAM | HUGO PORTO
// DATA: 17-12-2025
// DESCRIÇÃO: TELA DE MAPA DA VIAGEM DO CLIENTE COM FUNCIONALIDADES DE CHAT E RASTREAMENTO EM TEMPO REAL

// IMPORTAÇÕES ORGANIZADAS POR CATEGORIAS

// 1️⃣ REACT (SEMPRE PRIMEIRO)
import React from "react";
import { useEffect, useRef, useState } from "react";

// 2️⃣ REACT NATIVE CORE (COMPONENTES NATIVOS)
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    PixelRatio,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

// 3️⃣ BIBLIOTECAS DE TERCEIROS - NAVEGAÇÃO
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackScreenProps } from "@react-navigation/stack";

// 4️⃣ BIBLIOTECAS DE TERCEIROS - MAPAS
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";

// 5️⃣ BIBLIOTECAS DE TERCEIROS - OUTRAS
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from "@googlemaps/polyline-codec";
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import NetInfo from '@react-native-community/netinfo';

// 6️⃣ BIBLIOTECAS DE TERCEIROS - ÍCONES
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// 7️⃣ TIPOS/NAVEGADORES LOCAIS (MAIS DISTANTES NA HIERARQUIA)
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";

// 8️⃣ CONTEXTS/HOOKS LOCAIS
import { useAuth } from "../../../hooks/useAuth";
import { useUserRole } from "../../../context/UserRoleContext";

// 9️⃣ MODELS/TYPES LOCAIS
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { Status } from "../../../../domain/repository/ClientRequestRepository";

// 🔟 VIEWMODELS/SERVICES/CONTAINER DI
import { container } from "../../../../di/container";
import { ClientTripMapViewModel } from "./ClientTripMapViewModel";

// 1️⃣1️⃣ COMPONENTES LOCAIS
import { DateSeparator } from "../../chat/ChatComponents";
import { DrawerMenuButton } from '../../../components/DrawerMenuButton';

// 1️⃣2️⃣ ESTILOS (SEMPRE POR ÚLTIMO)
import styles from './Styles';
import { styles as chatStyles } from '../../chat/ChatScreenStyles';
import { darkMapStyle } from '../../driver/myLocationMap/Styles';
import { orangeMapStyle } from '../searchMap/Styles';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";

import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends StackScreenProps<ClientMapStackParamList, 'ClientTripMapScreen'> { };

interface Message {
    id: string;
    text: string;
    timestamp: Date;
    isMe: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'audio';
}

export function ClientTripMapScreen({ navigation, route }: Props) {

    // 1️⃣ PROPS/PARAMS (VALORES QUE VÊM DE FORA)
    const { idClientRequest, vehicle } = route.params;

    // 2️⃣ HOOKS DE CONTEXTO/NAVEGAÇÃO (useAuth, useNavigation, useUserRole)
    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();
    const { userRole } = useUserRole();
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // 3️⃣ DEPENDÊNCIAS INJETADAS (ViewModels, SERVICES VIA DI)
    const viewModel: ClientTripMapViewModel = container.resolve('clientTripMapViewModel');

    // 4️⃣ ESTADOS (useState) - AGRUPADOS POR CATEGORIA
    // ESTADOS DO MAPA
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [driverPosition, setDriverPosition] = useState<LatLng | null>(null);
    const [isDriverPositionSet, setIsDriverPositionSet] = useState(false);
    const [mapTheme, setMapTheme] = useState<'dark' | 'orange'>('orange');

    // ESTADOS DA VIAGEM
    const [clientRequest, setClientRequest] = useState<ClientRequestResponse>();
    const [currentStatus, setCurrentStatus] = useState(Status.ACCEPTED);

    // ESTADOS DO CHAT
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardEverOpened, setIsKeyboardEverOpened] = useState(false);

    // 🔹 CONEXÃO COM INTERNET E SOCKET
    const [isOnline, setIsOnline] = useState(true);
    const [showOfflineAlert, setShowOfflineAlert] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

    // 5️⃣ REFS (useRef)
    const animatedValue = useRef(new Animated.Value(0)).current;
    const mapRef = useRef<MapView>(null);
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

    // 6️⃣ HOOKS ESPECIAIS (useAudioPlayer, useForm, ETC)
    const player = useAudioPlayer(require('../../../../assets/sounds/332651__ebcrosby__notification-2.wav'));

    // REANIMATED SHARED VALUES PARA CONTROLE GESTUAL DO PAINEL
    const panelTranslateY = useSharedValue(0); // POSIÇÃO Y ATUAL DO PAINEL
    const panelHeight = useSharedValue(0.45); // ALTURA INICIAL: 45% DA TELA
    const panelContext = useSharedValue({ y: 0 }); // CONTEXTO PARA GESTOS

    // CALCULA OS 3 ESTADOS DO PAINEL
    const screenHeight = Dimensions.get('window').height; // ALTURA DA TELA
    // console.log('screenHeight:', screenHeight);
    const PANEL_STATE_EXPANDED_FULL = -(screenHeight * 0.01);
    // console.log('PANEL_STATE_EXPANDED_FULL:', PANEL_STATE_EXPANDED_FULL);
    const PANEL_STATE_NORMAL = 0; // ESTADO NORMAL (45% DA TELA)
    // console.log('PANEL_STATE_NORMAL:', PANEL_STATE_NORMAL);
    const PANEL_STATE_COLLAPSED = (screenHeight * 0.45) - 150; // COLAPSADO (DEIXA 100PX VISÍVEL)
    // console.log('PANEL_STATE_COLLAPSED:', PANEL_STATE_COLLAPSED);

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
            console.log('🟡[CLIENT_TRIP] Reconexão já em andamento, aguardando...');
            return;
        }

        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            console.log('🔴[CLIENT_TRIP] Máximo de tentativas de reconexão atingido');
            Alert.alert(
                'Problemas de Conexão',
                'Não foi possível restabelecer a conexão. Por favor, verifique sua internet e tente novamente.'
            );
            return;
        }

        const now = Date.now();
        if (now - lastReconnectAttempt.current < RECONNECT_DELAY) {
            console.log('🟡[CLIENT_TRIP] Aguardando intervalo de reconexão...');
            return;
        }

        isReconnecting.current = true;
        lastReconnectAttempt.current = now;
        reconnectAttempts.current += 1;

        try {
            console.log(`🔄[CLIENT_TRIP] Tentativa ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS} de reconexão dos sockets...`);

            if (Platform.OS === 'android') {
                const { ToastAndroid } = require('react-native');
                ToastAndroid.show(
                    `Reconectando... (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`,
                    ToastAndroid.SHORT
                );
            }

            // Desconecta sockets antigos
            await viewModel.disconnectSocket();
            console.log('🔴[CLIENT_TRIP] Sockets antigos desconectados');

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reinicializa sockets
            await viewModel.initSocket();
            console.log('🟢[CLIENT_TRIP] Sockets reinicializados');

            // Aguarda um pouco para a conexão se estabilizar
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('✅[CLIENT_TRIP] Reconexão bem-sucedida!');
            reconnectAttempts.current = 0;
            setIsSocketConnected(true);

            if (Platform.OS === 'android') {
                const { ToastAndroid } = require('react-native');
                ToastAndroid.show('Conexão restabelecida!', ToastAndroid.SHORT);
            } else {
                Alert.alert('Conexão Restabelecida', 'Você está online novamente.');
            }

            // Recarrega dados da corrida
            if (clientRequest) {
                console.log('🔄[CLIENT_TRIP] Recarregando dados da corrida...');
                await handleGetClientRequestById();
            }
        } catch (error) {
            console.error('❌[CLIENT_TRIP] Erro durante reconexão:', error);
            setIsSocketConnected(false);

            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                reconnectionTimeout.current = setTimeout(() => {
                    handleReconnectSockets();
                }, RECONNECT_DELAY);
            }
        } finally {
            isReconnecting.current = false;
        }
    }, [clientRequest, viewModel]);

    // ============================================================================
    // ============ USEEFFECT PARA MONITORAR STATUS DA CONEXÃO COM INTERNET =======
    // ====================== E QUALIDADE DA CONEXÃO ==============================
    // ============================================================================
    useEffect(() => {
        console.log('🔵[CLIENT_TRIP] Configurando listener de conexão de rede...');

        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('🌐[CLIENT_TRIP] Estado da conexão mudou:', {
                type: state.type,
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                details: state.details
            });

            const wasOnline = isOnline;
            const nowOnline = state.isConnected ?? false;

            setIsOnline(nowOnline);

            // Determina qualidade da conexão
            let quality: 'good' | 'poor' | 'offline' = 'offline';

            if (nowOnline) {
                if (state.type === 'wifi') {
                    quality = 'good';
                } else if (state.type === 'cellular' && state.details) {
                    const cellularGeneration = (state.details as any).cellularGeneration;
                    if (cellularGeneration === '4g' || cellularGeneration === '5g') {
                        quality = 'good';
                    } else {
                        quality = 'poor';
                    }
                } else {
                    quality = 'poor';
                }
            }

            setConnectionQuality(quality);

            // Detecta transição de offline para online
            if (!wasOnline && nowOnline) {
                console.log('✅[CLIENT_TRIP] Conexão restaurada!');

                if (Platform.OS === 'android') {
                    const { ToastAndroid } = require('react-native');
                    ToastAndroid.show('Conexão com internet restaurada!', ToastAndroid.LONG);
                } else {
                    Alert.alert('Conexão Restaurada', 'Sua conexão com a internet foi restabelecida.');
                }

                setShowOfflineAlert(false);

                // Aguarda 2 segundos para estabilizar a conexão antes de reconectar
                setTimeout(() => {
                    if (viewModel) {
                        console.log('🔄[CLIENT_TRIP] Iniciando reconexão após restauração da internet...');
                        handleReconnectSockets();
                    }
                }, 2000);
            }
            // Detecta transição de online para offline
            else if (wasOnline && !nowOnline) {
                console.log('🔴[CLIENT_TRIP] Conexão perdida!');

                if (Platform.OS === 'android') {
                    const { ToastAndroid } = require('react-native');
                    ToastAndroid.show('Sem conexão com a internet!', ToastAndroid.LONG);
                } else {
                    Alert.alert('Sem Conexão', 'Você está offline. Verifique sua conexão com a internet.');
                }

                setShowOfflineAlert(true);
                setIsSocketConnected(false);
            }
            // Alerta de conexão fraca
            else if (nowOnline && quality === 'poor') {
                console.log('⚠️[CLIENT_TRIP] Conexão fraca detectada');

                if (Platform.OS === 'android') {
                    const { ToastAndroid } = require('react-native');
                    ToastAndroid.show('Conexão fraca. Algumas funcionalidades podem ficar lentas.', ToastAndroid.SHORT);
                }
            }
        });

        // Health check periódico dos sockets (a cada 30 segundos)
        socketHealthCheckInterval.current = setInterval(() => {
            if (isOnline && viewModel) {
                console.log('🔍[CLIENT_TRIP] Verificando saúde dos sockets...');
                // Assume que o socket está conectado se estamos online
                // Poderia adicionar um método isConnected() no viewModel se necessário
                setIsSocketConnected(true);
            }
        }, 30000); // 30 segundos

        // Cleanup
        return () => {
            console.log('🔵[CLIENT_TRIP] Removendo listener de conexão de rede');
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
    }, [isOnline, handleReconnectSockets]);

    // ======================================================================================
    // ============ SERVE PARA CONFIGURAR O MODO DE ÁUDIO AO MONTAR O COMPONENTE ============
    // ======================================================================================
    useEffect(() => {
        let isMounted = true;

        const configureAudioMode = async () => {
            try {
                if (!isMounted) return;

                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: false,
                });
            } catch (error) {
                console.error('Erro ao configurar modo de áudio:', error);
            }
        };

        configureAudioMode();

        return () => {
            isMounted = false;
            setAudioModeAsync({
                playsInSilentMode: false,
                allowsRecording: false,
            }).catch(() => {
                console.error('Erro ao restaurar modo de áudio.');
            });
        };
    }, []);

    // ==================================================================
    // ============ EFEITO PARA GERENCIAR EVENTOS DO TECLADO ============
    // ==================================================================
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setIsKeyboardEverOpened(true);
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        const timeoutId = setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
            clearTimeout(timeoutId);
        };
    }, []);

    // ==============================================================================================
    // ============ EFEITO PARA INICIALIZAR O SOCKET E CARREGAR A SOLICITAÇÃO DO CLIENTE ============
    // ==============================================================================================
    useEffect(() => {
        try {
            viewModel.initSocket();
            handleGetClientRequestById();
        } catch (error) {
            console.error('Erro ao inicializar socket ou buscar requisição:', error);
        }

        return () => {
            try {
                viewModel.disconnectSocket();
            } catch (error) {
                console.error('Erro ao desconectar socket:', error);
            }
        };
    }, []);

    // ====================================================================================
    // ============ EFEITO PARA CARREGAR O TEMA DO MAPA AO MONTAR O COMPONENTE ============
    // ====================================================================================
    useEffect(() => {
        loadMapTheme();
    }, []);

    // ======================================================================
    // ============ EFEITO PARA VERIFICAR A POSIÇÃO DO MOTORISTA ============
    // ======================================================================
    useEffect(() => {
        if (isDriverPositionSet === true) {
            handleGetDirections(
                {
                    latitude: driverPosition!.latitude,
                    longitude: driverPosition!.longitude,
                },
                {
                    latitude: clientRequest?.pickup_position.y!,
                    longitude: clientRequest?.pickup_position.x!,
                }
            );
        }
    }, [isDriverPositionSet]);


    // ===================================================================
    // ============ EFEITO PARA VERIFICAR O STATUS DA CORRIDA ============
    // ===================================================================
    useEffect(() => {
        const handleStatusChange = async () => {
            if (currentStatus === Status.ARRIVED) {
                await playNotificationSound();
                Alert.alert('Chegada', 'O motorista chegou ao local de embarque.');
            } else if (currentStatus === Status.STARTED) {
                // DESENHA A ROTA ATÉ O DESTINO
                handleGetDirections(
                    {
                        latitude: driverPosition!.latitude,
                        longitude: driverPosition!.longitude,
                    },
                    {
                        latitude: clientRequest?.destination_position.y!,
                        longitude: clientRequest?.destination_position.x!,
                    }
                );
            } else if (currentStatus === Status.FINISHED) {
                navigation.replace('ClientTripRatingScreen', { clientRequest: clientRequest! });
            } else if (currentStatus === Status.CANCELLED) {
                Alert.alert('Corrida Cancelada', 'A corrida foi cancelada pelo motorista.');

                if (clientRequest?.clientRequestType === 'delivery') {
                    rootNavigation.replace('DeliveryPackageClientSearchMapScreen');
                } else {
                    navigation.replace('ClientSearchMapScreen');
                }
            }
        }

        handleStatusChange();
    }, [currentStatus]);

    // ======================================================================
    // ============ EFEITO PARA VERIFICAR A POSIÇÃO DO MOTORISTA ============
    // ======================================================================
    useEffect(() => {
        if (driverPosition !== null) {
            setIsDriverPositionSet(true);
        }
    }, [driverPosition]);

    // ===================================================================
    // ============ FUNÇÕES AUXILIARES DO COMPONENTE =====================
    // ===================================================================
    // ========================================================================================================
    // ============ FUNÇÃO PARA OBTER O ESTILO DO MAPA BASEADO NO TEMA SELECIONADO ============================
    // ========================================================================================================
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

    // ===================================================================================
    // ============ FUNÇÃO PARA CARREGAR O TEMA DO MAPA SALVO NO ASYNCSTORAGE ============
    // ===================================================================================
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

    // =======================================================================
    // ============ FUNÇÃO PARA TRATAR ZOOM IN E ZOOM OUT NO MAPA ============
    // =======================================================================
    const handleZoom = (type: 'in' | 'out') => {
        animateZoom();
        if (mapRef.current && location) {
            mapRef.current.getCamera().then((camera: any) => {
                let newZoom = camera.zoom ?? 15;
                if (type === 'in') newZoom += 1;
                if (type === 'out') newZoom -= 1;
                mapRef.current?.animateCamera({ ...camera, zoom: newZoom }, { duration: 300 });
            });
        }
    };

    // ====================================================================
    // ============ FUNÇÃO DE ANIMAÇÃO DE ZOOM NO MAPA ====================
    // ====================================================================
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

    // ====================================================================
    // ============ FUNÇÃO DE FORMATAÇÃO DE HORA DAS MENSAGENS ============
    // ====================================================================
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // ====================================================================
    // ============ FUNÇÃO DE ENVIO DE MENSAGENS NO CHAT ==================
    // ====================================================================
    const sendMessage = async () => {
        if (inputText.trim() === '') return;
        if (clientRequest && clientRequest.id) {
            try {
                let id_receiver = 0;

                if (userRole === 'CLIENT') {
                    id_receiver = clientRequest?.id_driver_assigned || 0;
                } else {
                    console.error('❌ APENAS CLIENTES PODEM ENVIAR MENSAGENS NESTA TELA.');
                    return;
                }

                if (id_receiver === 0) {
                    console.error('❌ ID DO RECEPTOR NÃO ENCONTRADO!');
                    return;
                }

                // ENVIAR A MENSAGEM VIA VIEWMODEL
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

                // ATUALIZAR A LISTA DE MENSAGENS
                setMessages(prevMessages => {
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
        }
    };

    // ========================================================================
    // ============ FUNÇÃO DE ATUALIZAÇÃO DE STATUS PARA CANCELADO ============
    // ========================================================================
    const handleUpdateStatusToCancelled = async () => {
        const response = await viewModel.updateStatus(idClientRequest, Status.CANCELLED);

        // VERIFICA SE A VIAGEM JÁ FOI FINALIZADA
        if (typeof response === 'object' && response?.success === false && response?.message === 'FINISHED') {
            Alert.alert(
                'Viagem Finalizada',
                'Não é possível cancelar uma viagem que já foi finalizada.',
                [{
                    text: 'OK', onPress: () => {
                        if (clientRequest?.clientRequestType === 'delivery') {
                            rootNavigation.replace('DeliveryPackageClientSearchMapScreen');
                        } else {
                            navigation.replace('ClientSearchMapScreen');
                        }
                    }
                }],
                { cancelable: false }
            );

            return;
        }

        if (typeof response === 'boolean') {
            setCurrentStatus(Status.CANCELLED);

            viewModel.emitUpdateStatus(idClientRequest, Status.CANCELLED);

            if (clientRequest?.clientRequestType === 'delivery') {
                rootNavigation.replace('DeliveryPackageClientSearchMapScreen');
            } else {
                navigation.replace('ClientSearchMapScreen');
            }
        }


    };

    // ============================================================================
    // ============ FUNÇÃO PARA OBTER A SOLICITAÇÃO DO CLIENTE PELO ID ============
    // ============================================================================
    const handleGetClientRequestById = async () => {
        const response = await viewModel.getClientRequestById(idClientRequest);

        if ('id' in response) {
            setClientRequest(response);

            // CENTRALIZAR O MAPA NA POSIÇÃO DE EMBARQUE DO CLIENTE
            setLocation({
                latitude: response.pickup_position.y,
                longitude: response.pickup_position.x,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            });

            // CONFIGURAR LISTENER PARA POSIÇÃO DO MOTORISTA
            viewModel.listenerDriversPositionSocket(authResponse?.user.id!, (data: any) => {
                console.log('🟢 [CLIENT_TRIP_MAP] POSIÇÃO DO MOTORISTA RECEBIDA: ', data);

                // VERIFICA SE OS DADOS ESTÃO VÁLIDOS
                if (data && data.lat && data.lng) {
                    // ATUALIZA A POSIÇÃO DO MOTORISTA EM TEMPO REAL
                    setDriverPosition({
                        latitude: data.lat,
                        longitude: data.lng
                    });

                } else {
                    console.warn('⚠️ [CLIENT_TRIP_MAP] DADOS DE POSIÇÃO INVÁLIDOS: ', data);
                }
            });

            // CONFIGURAR LISTENER PARA ATUALIZAÇÃO DE STATUS DA CORRIDA
            viewModel.listenerUpdateStatusSocket(idClientRequest, (data: any) => {
                if (data.status === Status.ARRIVED) {
                    setCurrentStatus(Status.ARRIVED);
                }
                else if (data.status === Status.STARTED) {
                    setCurrentStatus(Status.STARTED);
                }
                else if (data.status === Status.FINISHED) {
                    setCurrentStatus(Status.FINISHED);
                } else if (data.status === Status.CANCELLED) {
                    setCurrentStatus(Status.CANCELLED);
                }
            });

            // CONFIGURAR LISTENER PARA NOVAS MENSAGENS DE CHAT
            viewModel.listenerChatMessageDriver((data: any) => {
                if (userRole === 'CLIENT') {
                    // CLIENTE RECEBE MENSAGEM DO MOTORISTA
                    if (authResponse?.user?.id === data.id_receiver) {
                        // VERIFICAR SE A MENSAGEM JÁ EXISTE
                        setMessages((prevMessages) => {
                            const messageExists = prevMessages.find(msg => msg.id === data.id.toString());

                            if (messageExists) {
                                console.log('⚠️ MENSAGEM DUPLICADA DETECTADA, IGNORANDO...');
                                return prevMessages;
                            }

                            console.log('➕ ADICIONANDO NOVA MENSAGEM À LISTA DO CLIENTE.');

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

                        // SCROLL PARA BAIXO AO RECEBER NOVA MENSAGEM
                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    } else {
                        console.error('❌ CLIENTE NÃO DEVE RECEBER ESTA MENSAGEM.');
                    }
                }
            });
        }
    }

    // ==============================================================
    // ============ FUNÇÃO PARA TOCAR SOM DE NOTIFICAÇÃO ============
    // ==============================================================
    const playNotificationSound = async () => {
        try {
            player.seekTo(0);
            await player.play();
        } catch (error) {
            if (Platform.OS === 'android') {
                try {
                    const { Vibration } = require('react-native');
                    Vibration.vibrate([0, 500, 200, 500]);
                } catch (vibError) {
                    console.error('❌ ERRO NA VIBRAÇÃO TAMBÉM: ', vibError);
                }
            }
        }
    };

    // ======================================================================
    // ============ FUNÇÃO PARA OBTER DIREÇÕES ENTRE DOIS PONTOS ============
    // ======================================================================
    // ===========================================================================
    // ==== SERVE PARA OBTER AS DIREÇÕES DO MOTORISTA ATÉ O LOCAL DE EMBARQUE ====
    // ===========================================================================
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

    // ===============================================================================
    // ============ FUNÇÃO PARA ALTERNAR O ESTADO DE INTERAÇÃO COM O MAPA ============
    // ===============================================================================
    const toggleView = (isInteractingWithMap: boolean) => {
        setIsInteractingWithMap(isInteractingWithMap);
        Animated.timing(animatedValue, {
            toValue: isInteractingWithMap ? 1 : 0,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

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

    if (!location) {
        return <View style={styles.container}></View>
    }

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isMe = item.isMe;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showDate = !prevMessage || new Date(item.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();

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
                                <Ionicons name="car-sport" size={16} color="#fff" />
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
                                <Ionicons name="person" size={16} color="#fff" />
                            </View>
                        </View>
                    )}

                    {isMe && <View style={chatStyles.spacer} />}
                </View>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

            {/* BOTÃO PARA ABRIR O DRAWER */}
            <DrawerMenuButton />

            {/* BARRA DE AVISO DE OFFLINE */}
            {!isOnline && (
                <View style={styles.offlineBar}>
                    <Ionicons name="cloud-offline" size={20} color="#fff" />
                    <Text style={styles.offlineBarText}>SEM CONEXÃO COM A INTERNET</Text>
                </View>
            )}

            {/* BARRA DE AVISO DE CONEXÃO FRACA */}
            {isOnline && connectionQuality === 'poor' && (
                <View style={[styles.offlineBar, { backgroundColor: '#FF9800' }]}>
                    <Ionicons name="warning" size={20} color="#fff" />
                    <Text style={styles.offlineBarText}>CONEXÃO FRACA</Text>
                </View>
            )}

            {/* 🚦 SEMÁFORO DE STATUS - PROFISSIONAL */}
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

            {/* MAPA */}
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
                    onRegionChangeComplete={() => { // QUANDO PARA DE ARRASTAR → PAINEL SOBE
                        toggleView(false);
                    }}
                    onPanDrag={() => toggleView(true)} // QUANDO ARRASTA O MAPA → PAINEL DESCE
                >
                    {
                        driverPosition !== null && (
                            <Marker
                                coordinate={{
                                    latitude: driverPosition?.latitude!,
                                    longitude: driverPosition?.longitude!
                                }}
                                title="Seu Motorista"
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

                                    {vehicle?.typeVehicle === 'car' ? (
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
                                    latitude: clientRequest!.pickup_position.y,
                                    longitude: clientRequest!.pickup_position.x
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
                                    latitude: clientRequest!.destination_position.y,
                                    longitude: clientRequest!.destination_position.x
                                }}
                                title="Destino"
                            >
                                <View style={{
                                    backgroundColor: '#f70f0fff',
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
                        directionsRoute.length > 0 && (
                            <>
                                {/* SOMBRA DA ROTA PARA DAR PROFUNDIDADE */}
                                <Polyline
                                    coordinates={directionsRoute}
                                    strokeWidth={8}
                                    strokeColor="black"
                                />
                                {/* ROTA PRINCIPAL COM GRADIENTE VISUAL */}
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

                {/* INDICADOR VISUAL (ALÇA) PARA ARRASTAR O PAINEL - COM GESTURE */}
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
                        paddingBottom: 70,
                    }}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    decelerationRate="normal"
                >

                    {/* CARD DO MOTORISTA */}
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
                        }]}>🚗 Seu Motorista</Text>
                        <View style={[styles.rowContainer, { marginLeft: 0, marginRight: 0, marginBottom: 12 }]}>
                            <View style={styles.dataContainer}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#1A1A1A',
                                    marginBottom: 4
                                }}>{clientRequest?.driver.name} {clientRequest?.driver.lastname}</Text>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#e10d0dff',
                                    marginBottom: 4
                                }}>Código: {clientRequest?.code}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    fontWeight: '400'
                                }}>📞 {clientRequest?.driver.phone}</Text>
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
                                    source={{ uri: clientRequest?.driver.image }}
                                />
                            </View>
                        </View>

                        {/* INFORMAÇÕES DO VEÍCULO */}
                        <View style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Image
                                style={{
                                    width: 60,
                                    height: 40,
                                    resizeMode: 'contain',
                                    marginRight: 16
                                }}
                                source={require('../../../../assets/suv.png')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: '#1A1A1A',
                                    marginBottom: 2
                                }}>{vehicle?.model} {vehicle?.brand}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#666'
                                }}>Placa: {vehicle?.licensePlate}</Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#4CAF50',
                                    fontWeight: '500',
                                    marginTop: 4
                                }}>⏱️ Chegada em ~5 mins</Text>
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
                        }]}>🗺️ Detalhes da Viagem</Text>

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
                                    }}>{clientRequest ? clientRequest.pickup_description : 'Descrição não disponível'}</Text>
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
                transparent={false}
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
                                                    Chat com o Motorista
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

                                    {/* INPUT DE MENSAGEM */}
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

            {/* BARRA INFERIOR CUSTOMIZADA */}
            <View style={styles.bottomBar} />
        </View >
    );
}