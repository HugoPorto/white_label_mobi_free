import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import styles, { orangeMapStyle } from './Styles';
import { useEffect, useRef, useState } from "react";
import MapView, { Camera, LatLng, Marker, Polyline, Region } from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { container } from "../../../../di/container";
import { PlaceDetail } from "../../../../domain/models/PlaceDetail";
import { GoogleMapsApiKey } from "../../../../data/sources/remote/api/GoogleMapsApiKey";
import { ClientSerchMapViewModel } from "./ClientSearchMapViewModel";
import { decode } from "@googlemaps/polyline-codec";
import { TimeAndDistanceValues } from '../../../../domain/models/TimeAndDistanceValues';
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { PlaceGeocodeDetail } from "../../../../domain/models/PlaceGeocodeDetail";
import DefaultTextInput from "../../../components/DefaultTextInput";
import { useAuth } from "../../../hooks/useAuth";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { DriverOfferItem } from "./DriverOfferItem";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import * as KeepAwake from 'expo-keep-awake';
import NetInfo from '@react-native-community/netinfo';
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";
import { DrawerMenuButton } from "../../../components/DrawerMenuButton";

interface Props extends StackScreenProps<ClientMapStackParamList, 'ClientSearchMapScreen'> { };

export default function ClientSearchMapScreen({ navigation, route }: Props) {
    const viewModel: ClientSerchMapViewModel = container.resolve('clientSearchMapViewModel');
    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [shouldDrawRoute, setShouldDrawRoute] = useState<boolean>(false);
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [timeAndDistance, setTimeAndDistance] = useState<TimeAndDistanceValues>();
    const [isOriginModalVisible, setIsOriginModalVisible] = useState(false);
    const [isDestinationModalVisible, setIsDestinationModalVisible] = useState(false);
    const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
    const [isDriverOfferModalVisible, setIsDriverOfferModalVisible] = useState(false);
    const [driverTripOffers, setDriverTripOffers] = useState<DriverTripOffer[]>([]);
    const [offer, setOffer] = useState<string>('');
    const [driverMarkers, setDriverMarkers] = useState<{
        id: number,
        idSocket: string,
        lat: number,
        lng: number,
        typeVehicle: boolean
    }[]>([]);
    const [vehicleFilter, setVehicleFilter] = useState<'all' | 'car' | 'motorcycle'>('all');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'searching' | 'found'>('idle');
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutos = 300 segundos
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [idClientRequest, setIdClientRequest] = useState<number | null>(null);
    const [originPlace, setOriginPlace] = useState<{
        lat: number,
        lng: number,
        address: string
    } | undefined>(undefined);

    const [isCarType, setIsCarType] = useState<boolean>(true);

    const [originMarker, setOriginMarker] = useState<LatLng>();

    const [destinationPlace, setDestinationPlace] = useState<{
        lat: number,
        lng: number,
        address: string
    } | undefined>(undefined);

    const placeAutocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
    const placeAutocompleteDestinationRef = useRef<GooglePlacesAutocompleteRef>(null);
    const mapRef = useRef<MapView>(null);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const floatingButtonAnimated = useRef(new Animated.Value(0)).current;
    const [showLocationPulse, setShowLocationPulse] = useState(false);
    const player = useAudioPlayer(require('../../../../assets/sounds/332651__ebcrosby__notification-2.wav'));
    const locationPulseAnim = useRef(new Animated.Value(0)).current;

    // 🔹 CONEXÃO COM INTERNET E SOCKET
    const [isOnline, setIsOnline] = useState(true);
    const [showOfflineAlert, setShowOfflineAlert] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');

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

    // 🔹 CONTROLE DE RECONEXÃO
    const isReconnecting = useRef<boolean>(false);
    const lastReconnectAttempt = useRef<number>(0);
    const reconnectAttempts = useRef<number>(0);
    const reconnectionTimeout = useRef<NodeJS.Timeout | null>(null);
    const socketHealthCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000; // 3 segundos

    // ===============================
    // 2️⃣ HOOKS DE CONTEXTO / NAVEGAÇÃO
    // ===============================
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

    // Função para tocar som de notificação usando expo-audio
    const playNotificationSound = async () => {
        try {
            console.log('🔊 Tocando som de notificação...');

            // Garante que o som sempre comece do início
            player.seekTo(0);

            // Reproduz o som
            await player.play();

            console.log('✅ Som de notificação tocado com sucesso');
        } catch (error) {
            console.log('❌ Erro ao tocar som de notificação:', error);

            // Fallback: usa vibração se o som falhar
            if (Platform.OS === 'android') {
                // Vibração como alternativa
                try {
                    const { Vibration } = require('react-native');
                    Vibration.vibrate([0, 500, 200, 500]); // Padrão de vibração
                } catch (vibError) {
                    console.log('❌ Erro na vibração também:', vibError);
                }
            }
        }
    };

    /**
     * Funções de validação
     */
    const validateForm = () => {
        if (!originPlace) {
            Alert.alert("Erro de Validação", "Por favor, selecione o local de embarque");
            return false;
        }
        if (!destinationPlace) {
            Alert.alert("Erro de Validação", "Por favor, selecione o destino");
            return false;
        }
        if (!offer || parseFloat(offer) <= 0) {
            Alert.alert("Erro de Validação", "Por favor, informe uma oferta válida");
            return false;
        }
        return true;
    };

    // ============================================================================
    // ====== FUNÇÃO AUXILIAR PARA RECONECTAR SOCKETS DE FORMA INTELIGENTE =======
    // ============================================================================
    const handleReconnectSockets = React.useCallback(async () => {
        if (isReconnecting.current) {
            console.log('🟡[CLIENT_SEARCH] Reconexão já em andamento, aguardando...');
            return;
        }

        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            console.log('🔴[CLIENT_SEARCH] Máximo de tentativas de reconexão atingido');
            Alert.alert(
                'Problemas de Conexão',
                'Não foi possível restabelecer a conexão. Por favor, verifique sua internet e tente novamente.'
            );
            return;
        }

        const now = Date.now();
        if (now - lastReconnectAttempt.current < RECONNECT_DELAY) {
            console.log('🟡[CLIENT_SEARCH] Aguardando intervalo de reconexão...');
            return;
        }

        isReconnecting.current = true;
        lastReconnectAttempt.current = now;
        reconnectAttempts.current += 1;

        try {
            console.log(`🔄[CLIENT_SEARCH] Tentativa ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS} de reconexão dos sockets...`);

            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    `Reconectando... (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`,
                    ToastAndroid.SHORT
                );
            }

            // Desconecta sockets antigos
            await viewModel.disconnectAllSockets();
            console.log('🔴[CLIENT_SEARCH] Sockets antigos desconectados');

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reinicializa sockets
            await viewModel.initSocket();
            console.log('🟢[CLIENT_SEARCH] Sockets reinicializados');

            // Aguarda conexão ser estabelecida
            const connected = await viewModel.waitForLocationConnection(5000);

            if (connected) {
                console.log('✅[CLIENT_SEARCH] Reconexão bem-sucedida!');
                reconnectAttempts.current = 0;
                setIsSocketConnected(true);

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Conexão restabelecida!', ToastAndroid.SHORT);
                } else {
                    Alert.alert('Conexão Restabelecida', 'Você está online novamente.');
                }

                // Recarrega listeners de motoristas
                if (location) {
                    console.log('🔄[CLIENT_SEARCH] Recarregando listeners de motoristas...');
                    viewModel.listenerDriversPositionSocket((data: any) => {
                        console.log('🟢[CLIENT_SEARCH] Motoristas recebidos:', data.length);
                        setDriverMarkers(data);
                    });
                }
            } else {
                console.log('🔴[CLIENT_SEARCH] Falha na reconexão, tentando novamente...');
                setIsSocketConnected(false);

                if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                    reconnectionTimeout.current = setTimeout(() => {
                        handleReconnectSockets();
                    }, RECONNECT_DELAY);
                }
            }
        } catch (error) {
            console.error('❌[CLIENT_SEARCH] Erro durante reconexão:', error);
            setIsSocketConnected(false);

            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                reconnectionTimeout.current = setTimeout(() => {
                    handleReconnectSockets();
                }, RECONNECT_DELAY);
            }
        } finally {
            isReconnecting.current = false;
        }
    }, [location, viewModel]);

    useEffect(() => {
        // Configura o modo de áudio ao montar o app
        (async () => {
            try {
                await setAudioModeAsync({
                    // Permite tocar som mesmo no modo silencioso (iOS)
                    playsInSilentMode: true,
                    allowsRecording: false,
                });
                console.log('🎧 Modo de áudio configurado com sucesso');
            } catch (error) {
                console.error('Erro ao configurar modo de áudio:', error);
            }
        })();
    }, []);

    // ============================================================================
    // ============ USEEFFECT PARA MONITORAR STATUS DA CONEXÃO COM INTERNET =======
    // ====================== E QUALIDADE DA CONEXÃO ==============================
    // ============================================================================
    useEffect(() => {
        console.log('🔵[CLIENT_SEARCH] Configurando listener de conexão de rede...');

        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('🌐[CLIENT_SEARCH] Estado da conexão mudou:', {
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
                console.log('✅[CLIENT_SEARCH] Conexão restaurada!');

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Conexão com internet restaurada!', ToastAndroid.LONG);
                } else {
                    Alert.alert('Conexão Restaurada', 'Sua conexão com a internet foi restabelecida.');
                }

                setShowOfflineAlert(false);

                // Aguarda 2 segundos para estabilizar a conexão antes de reconectar
                setTimeout(() => {
                    if (viewModel) {
                        console.log('🔄[CLIENT_SEARCH] Iniciando reconexão após restauração da internet...');
                        handleReconnectSockets();
                    }
                }, 2000);
            }
            // Detecta transição de online para offline
            else if (wasOnline && !nowOnline) {
                console.log('🔴[CLIENT_SEARCH] Conexão perdida!');

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Sem conexão com a internet!', ToastAndroid.LONG);
                } else {
                    Alert.alert('Sem Conexão', 'Você está offline. Verifique sua conexão com a internet.');
                }

                setShowOfflineAlert(true);
                setIsSocketConnected(false);
            }
            // Alerta de conexão fraca
            else if (nowOnline && quality === 'poor') {
                console.log('⚠️[CLIENT_SEARCH] Conexão fraca detectada');

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Conexão fraca. Algumas funcionalidades podem ficar lentas.', ToastAndroid.SHORT);
                }
            }
        });

        // Health check periódico dos sockets (a cada 30 segundos)
        socketHealthCheckInterval.current = setInterval(() => {
            if (isOnline && viewModel) {
                console.log('🔍[CLIENT_SEARCH] Verificando saúde dos sockets...');

                // Verifica se os sockets estão realmente conectados
                const locationConnected = viewModel.isLocationConnected();

                if (!locationConnected && !isReconnecting.current) {
                    console.log('⚠️[CLIENT_SEARCH] Socket de localização desconectado, reconectando...');
                    setIsSocketConnected(false);
                    handleReconnectSockets();
                } else if (locationConnected) {
                    setIsSocketConnected(true);
                }
            }
        }, 30000); // 30 segundos

        // Cleanup
        return () => {
            console.log('🔵[CLIENT_SEARCH] Removendo listener de conexão de rede');
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

    /**
     * Verifica se todos os dados estão preenchidos para mostrar o botão flutuante
     */
    const isFormComplete = () => {
        return originPlace && destinationPlace && offer && parseFloat(offer) > 0;
    };

    // Anima o botão flutuante quando os dados estão completos
    useEffect(() => {
        Animated.timing(floatingButtonAnimated, {
            toValue: isFormComplete() ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [originPlace, destinationPlace, offer]);

    const handleCancelClientRequest = async () => {
        setIsTimerActive(false);
        setRequestStatus('idle');
        viewModel.updateStatus(idClientRequest!, Status.EXPIRED);
        setIdClientRequest(null);
    }

    // Controle do temporizador de 5 minutos
    useEffect(() => {

        const handleUpdateStatusToExpired = async (idClientRequest: number) => {
            setIsTimerActive(false);
            setRequestStatus('idle');
            viewModel.updateStatus(idClientRequest, Status.EXPIRED);
            setIdClientRequest(null);
        }

        if (isTimerActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
            setRequestStatus('idle');
            Alert.alert('Tempo Esgotado', 'O tempo para encontrar um motorista acabou.');
            console.log('🟢[CLIENT_SEARCH] IdClientRequest:', idClientRequest);
            handleUpdateStatusToExpired(idClientRequest!);
            setIdClientRequest(null);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isTimerActive, timeLeft]);

    // Cleanup do timer ao desmontar o componente
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                console.log('🟢[CLIENT_SEARCH] Limpando timer ao desmontar componente...');
                clearTimeout(timerRef.current);
                timerRef.current = null;
                setIsTimerActive(false);
            }
        };
    }, []);

    // Limpa o timer quando a tela perde o foco (navegação para outra tela)
    useFocusEffect(
        React.useCallback(() => {
            // Função executada quando a tela ganha foco
            console.log('🟢[CLIENT_SEARCH] Tela ganhou foco');

            return () => {
                // Função executada quando a tela perde o foco
                console.log('🟢[CLIENT_SEARCH] Tela perdeu foco - limpando timer...');
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                setIsTimerActive(false);
                setRequestStatus('idle');
            };
        }, [])
    );

    // Função para formatar o tempo (mm:ss)
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

    useFocusEffect(
        React.useCallback(() => {
            if (authResponse?.user) {
                if (!authResponse.user.phone_verified) {
                    navigation.getParent()?.getParent()?.navigate('PhoneVerifiedScreen');
                }
            }
        }, [authResponse?.user?.phone_verified])
    );

    // Funções para zoom customizado
    const handleZoom = (type: 'in' | 'out') => {
        if (mapRef.current && location) {
            mapRef.current.getCamera().then((camera: Camera) => {
                let newZoom = camera.zoom ?? 15;
                if (type === 'in') newZoom += 1;
                if (type === 'out') newZoom -= 1;
                mapRef.current?.animateCamera({ ...camera, zoom: newZoom }, { duration: 300 });
            });
        }
    };

    // Atualiza rota e tempo/distância quando origem e destino são definidos e deve-se desenhar a rota
    useEffect(() => {
        if (originPlace !== undefined && destinationPlace !== undefined && shouldDrawRoute) {
            console.log('🟢[CLIENT_SEARCH] Mostrando rota entre origem e destino');
            console.log('🟢[CLIENT_SEARCH] Origem', originPlace);
            console.log('🟢[CLIENT_SEARCH] Destino', destinationPlace);
            handleGetDirections();
            handleGetTimeAndDistance();
        }
    }, [originPlace, destinationPlace, shouldDrawRoute, isCarType]);

    useFocusEffect(
        React.useCallback(() => {
            const activateKeepAwake = async () => {
                try {
                    await KeepAwake.activateKeepAwakeAsync();
                    console.log('🔆 Keep Awake ativado - tela não irá escurecer');
                } catch (error) {
                    console.log('❌ Erro ao ativar Keep Awake:', error);
                }
            };

            activateKeepAwake();

            // Cleanup: Desativar Keep Awake quando a tela perde foco
            return () => {
                const deactivateKeepAwake = async () => {
                    try {
                        await KeepAwake.deactivateKeepAwake();
                        console.log('🌙 Keep Awake desativado - tela pode escurecer normalmente');
                    } catch (error) {
                        console.log('❌ Erro ao desativar Keep Awake:', error);
                    }
                };

                // deactivateKeepAwake();
            };
        }, [])
    );

    // SOLICITA PERMISSÕES, OBTÉM LOCALIZAÇÃO INICIAL, INICIALIZA SOCKET E LISTENERS DE MOTORISTAS
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert('Permissão de localização negada', 'É necessário permitir o acesso à localização para usar o mapa.');
                    return;
                }

                if (Platform.OS === 'android') {
                    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                    if (backgroundStatus !== 'granted') {
                        Alert.alert('Permissão de localização em segundo plano negada', 'Algumas funcionalidades podem não funcionar corretamente.');
                    }
                }

                let location = await Location.getCurrentPositionAsync({});

                console.log('🟢[CLIENT_SEARCH] Localização atual:', location);

                setLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                });

                setIsLocationLoading(false);

                console.log('🟢[CLIENT_SEARCH] Localização inicial establecida:', location);

                // Inicializar socket e aguardar conexão
                console.log('🟢[CLIENT_SEARCH] Inicializando sockets...');
                await viewModel.initSocket();

                // Aguardar conexão ser estabelecida
                const connected = await viewModel.waitForLocationConnection(5000);

                if (connected) {
                    console.log('✅[CLIENT_SEARCH] Socket conectado com sucesso!');

                    // Registrar listeners após conexão estabelecida
                    viewModel.listenerDriversPositionSocket((data: any) => {
                        console.log('🟢[CLIENT_SEARCH] Posição do motorista recebida via socket:', data);
                        const newMarker = {
                            id: data.id,
                            idSocket: data.id_socket,
                            lat: data.lat,
                            lng: data.lng,
                            typeVehicle: data.typeVehicle || false, // true = carro, false = moto
                        }

                        setDriverMarkers((prevMarkers) => {
                            console.log('🟢[CLIENT_SEARCH] DriverMarkers antes da atualização:', prevMarkers);
                            const markerExists = prevMarkers.some(marker => marker.idSocket === newMarker.idSocket); // MARCADOR AGREGADO
                            console.log('🟢[CLIENT_SEARCH] Marker exists:', markerExists);
                            if (!markerExists) {
                                console.log('🟢[CLIENT_SEARCH] Novo motorista adicionado:', newMarker);
                                return [...prevMarkers, newMarker];
                            }
                            else {
                                console.log('🟢[CLIENT_SEARCH] Atualizando posição do motorista:', newMarker);
                                return prevMarkers.map(marker => marker.idSocket === newMarker.idSocket ? { ...marker, ...newMarker } : marker)
                            }
                        });
                    });

                    viewModel.listenerDriversDisconnectedSocket((idSocket: string) => {
                        console.log('🟢[CLIENT_SEARCH] Motorista desconectado:', idSocket);
                        setDriverMarkers((prevMarkers) => prevMarkers.filter(marker => marker.idSocket !== idSocket));
                    });
                } else {
                    console.log('❌[CLIENT_SEARCH] Falha ao conectar socket');
                    Alert.alert(
                        'Erro de Conexão',
                        'Não foi possível conectar ao servidor. Alguns recursos podem não funcionar.'
                    );
                }
            } catch (error) {
                console.error('🔴[CLIENT_SEARCH] Erro ao inicializar mapa:', error);

                Alert.alert(
                    'Erro ao obter localização',
                    'Não foi possível iniciar o mapa. Verifique GPS e permissões.'
                );
            } finally {
                if (isMounted) {
                    setIsLocationLoading(false);
                }
            }
        })();
        return () => {
            isMounted = false;
            viewModel.disconnectAllSockets();
        };
    }, []);

    /**
     * Move a câmera do mapa para a latitude/longitude informada.
     */
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

    /**
     * Remove um item específico da lista de ofertas de motoristas.
     */
    const handleRemoveDriverOffer = (itemId: number) => {
        setDriverTripOffers(prevOffers => {
            const newOffers = prevOffers.filter(offer => offer.id !== itemId);

            // Fecha o modal se não houver mais ofertas
            if (newOffers.length === 0) {
                setIsDriverOfferModalVisible(false);
                console.log('🟢[CLIENT_SEARCH] Modal fechado - nenhuma oferta restante');
            }

            return newOffers;
        });
        console.log('🟢[CLIENT_SEARCH] Oferta do motorista removida:', itemId);
    };

    /**
     * Escuta novas ofertas de motoristas para a solicitação do cliente e exibe o modal de ofertas.
     */
    const handleGetDriverTripOffers = async (idClientRequest: number) => {
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('🟢[CLIENT_SEARCH] Escutando novas ofertas de motoristas para a solicitação:', idClientRequest);
        viewModel.listenerNewDriverOffer(idClientRequest, async (data: { idClientRequest: number, clientRequestType: string }) => {
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('Data recebida na oferta do motorista via socket:', data);
            // Busca ofertas de motoristas para a solicitação
            const response = await viewModel.getDriverTripOffers(data.idClientRequest);

            // Busca detalhes da solicitação do cliente
            const clientRequest = await viewModel.getClientRequestById(data.idClientRequest);

            // Verifica se ambas as respostas são válidas antes de comparar
            if (Array.isArray(response) && response.length > 0 &&
                clientRequest && 'fare_offered' in clientRequest) {

                const driverOffer = response[0]; // Primeira oferta do motorista
                if (driverOffer && driverOffer.fare_offered) {
                    const driverFare = typeof driverOffer.fare_offered === 'string'
                        ? parseFloat(driverOffer.fare_offered)
                        : driverOffer.fare_offered;

                    const clientFare = typeof clientRequest.fare_offered === 'string'
                        ? parseFloat(clientRequest.fare_offered)
                        : clientRequest.fare_offered;

                    if (driverFare == clientFare) {
                        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                        console.log('🟢[CLIENT_SEARCH] Oferta do motorista é igual à oferta do cliente');
                        console.log('🟢[CLIENT_SEARCH] Motorista:', driverFare, 'Cliente:', clientFare);
                        // Alert.alert('Nova Oferta', 'Um motorista aceitou sua oferta!');
                        try {
                            const response = await viewModel.updateDriverAssigned(
                                driverOffer.id_client_request,
                                driverOffer.id_driver,
                                driverOffer.fare_offered
                            );
                            if (typeof response === 'boolean') {
                                // Emite evento de nova solicitação via socket
                                viewModel.emitNewDriverAssigned(driverOffer.id_client_request, driverOffer.id_driver);
                                console.log('🟢[CLIENT_SEARCH] Condutor atribuído com sucesso!');
                                console.log('🟢[CLIENT_SEARCH] DriverOffer:', driverOffer);

                                // Limpa o timer antes de navegar
                                if (timerRef.current) {
                                    console.log('🟢[CLIENT_SEARCH] Limpando timer antes da navegação...');
                                    clearTimeout(timerRef.current);
                                    timerRef.current = null;
                                }

                                setIsTimerActive(false);
                                setRequestStatus('idle');

                                navigation.navigate('ClientTripMapScreen', {
                                    idClientRequest: driverOffer.id_client_request, vehicle: driverOffer.vehicle
                                });
                            } else {
                                console.error('🟢[CLIENT_SEARCH]  Falha ao atribuir o condutor:', response.message || response);
                            }
                        } catch (error) {
                            console.error('🟢[CLIENT_SEARCH] Erro ao atualizar o motorista atribuído:', error);
                        }
                        return;
                    }
                }
            } else {
                Alert.alert('Erro', 'Erro ao processar ofertas de motoristas. Tente novamente.');
                return;
            }

            if (response && Array.isArray(response) && response.length > 0) {
                // 🔊 TOCA SOM DE NOTIFICAÇÃO IMEDIATAMENTE
                await playNotificationSound();
                setIsDriverOfferModalVisible(true);
                setDriverTripOffers(response as DriverTripOffer[]);
                console.log('🟢[CLIENT_SEARCH] Client Search Map Screen response - DriverTripOffers', response);
            } else {
                Alert.alert('Erro', 'Erro ao obter ofertas de motoristas. Tente novamente.');
                return;
            }
        });
    }

    /**
     * Cria uma nova solicitação de corrida para o cliente, 
     * envia para o backend e abre o modal
     * de ofertas dos motoristas.
     */
    const handleCreateClientRequest = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setRequestStatus('searching');

        try {
            if (!originPlace || !originPlace.lat) {
                showErrorMessage("Selecione o ponto de origem.");
                return;
            }

            if (!originPlace || !originPlace.lng) {
                showErrorMessage("Selecione o ponto de origem.");
                return;
            }

            if (!destinationPlace || !destinationPlace.lat) {
                showErrorMessage("Selecione o ponto de destino.");
                return;
            }

            if (!destinationPlace || !destinationPlace.lng) {
                showErrorMessage("Selecione o ponto de destino.");
                return;
            }

            if (originPlace.address === undefined) {
                showErrorMessage("Endereço de origem inválido.");
                return;
            }

            if (destinationPlace.address === undefined) {
                showErrorMessage("Endereço de destino inválido.");
                return;
            }

            if (!timeAndDistance) {
                showErrorMessage("Não foi possível obter tempo e distância. Tente novamente.");
                return;
            }

            if (!offer || isNaN(Number(offer)) || Number(offer) <= 0) {
                showErrorMessage("Informe uma oferta válida.");
                return;
            }

            const response: number | ErrorResponse = await viewModel.createClientRequest({ // Cria a solicitação de corrida
                id_client: authResponse?.user.id!,
                pickup_lat: originPlace.lat, // Latitude de origem
                pickup_lng: originPlace.lng, // Longitude de origem
                pickup_description: originPlace.address,
                destination_lat: destinationPlace.lat, // Latitude de destino
                destination_lng: destinationPlace.lng, // Longitude de destino
                destination_description: destinationPlace.address,
                fare_offered: Number(offer),
                vehicle_type: isCarType ? 'car' : 'motorcycle',
                distance_text: timeAndDistance.distance.text,
                distance_value: timeAndDistance.distance.value,
                duration_text: timeAndDistance.duration.text,
                duration_value: timeAndDistance.duration.value,
                recommended_value: timeAndDistance.recommended_value,
                km_value: timeAndDistance.km_value,
                min_value: timeAndDistance.min_value
            });

            // Verifica se a resposta é um ID válido
            if (typeof response === 'number') {
                // Emite evento de nova solicitação via socket
                viewModel.emitNewClientRequest(response);
                // Escuta ofertas de motoristas para essa solicitação
                handleGetDriverTripOffers(response);
                setRequestStatus('found');
                // Inicia o temporizador de 5 minutos
                setIsTimerActive(true);
                setTimeLeft(300);
                showSuccessMessage('Solicitação enviada! Aguardando motoristas...');
                setIdClientRequest(response);
            } else {
                setRequestStatus('idle');
                showErrorMessage('Erro ao enviar solicitação. Tente novamente.');
            }
        } catch (error) {
            setRequestStatus('idle');
            showErrorMessage('Erro de conexão. Verifique sua internet.');
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Busca tempo e distância estimados entre origem e destino usando a API do backend.
     */
    const handleGetTimeAndDistance = async () => {
        console.log('Auth Response Car:', authResponse!.user!.car!);
        const response: TimeAndDistanceValues | ErrorResponse = await viewModel.getTimeAndDistance(
            {
                latitude: originPlace!.lat,
                longitude: originPlace!.lng
            },
            {
                latitude: destinationPlace!.lat,
                longitude: destinationPlace!.lng
            },
            isCarType
        );

        if ('distance' in response) {
            const result = response as TimeAndDistanceValues;
            setTimeAndDistance(result);
            setOffer(result.recommended_value.toFixed(2).toString());
        }
        else {
            const error = response as ErrorResponse;
        }
    }

    /**
     * Busca e desenha a rota (direções) entre origem e destino no mapa.
     */
    const handleGetDirections = async () => {
        const response: GoogleDirections | null = await viewModel.getDirections(
            {
                latitude: originPlace!.lat,
                longitude: originPlace!.lng
            },
            {
                latitude: destinationPlace!.lat,
                longitude: destinationPlace!.lng
            }
        );

        if (response !== null) {
            if (response.routes.length) {
                const points = response.routes[0].overview_polyline.points;
                const coordinates = decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
                setDirectionsRoute(coordinates);
                setOriginMarker({ latitude: originPlace!.lat, longitude: originPlace!.lng });

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

    /**
     * Busca detalhes de um local pelo placeId (Google Places), define origem ou destino e move a câmera.
     */
    const handleGetPlaceDetails = async (placeId: string, isOrigin: boolean) => {
        const response: PlaceDetail | null = await viewModel.getPlaceDetails(placeId);
        if (response !== null) {
            const lat = response!.result.geometry.location.lat;
            const lng = response!.result.geometry.location.lng;
            const address = response!.result.formatted_address;
            if (isOrigin) {
                moveCameraToLocation(lat, lng);
                setOriginPlace({
                    lat: lat,
                    lng: lng,
                    address: address
                });
                setIsOriginModalVisible(false);
            }
            else {
                setDestinationPlace({
                    lat: lat,
                    lng: lng,
                    address: address
                });
                setIsDestinationModalVisible(false);
            }
            setShouldDrawRoute(true);
        }
    }

    /**
     * Busca detalhes de um local a partir de coordenadas (lat/lng) e define como origem.
     */
    const handleGetPlaceDetailsByCoords = async (lat: number, lng: number) => {
        console.log('🟢[CLIENT_SEARCH] Buscando detalhes do local por coordenadas:', lat, lng);
        const response: PlaceGeocodeDetail | null = await viewModel.getPlaceDetailsByCoords(lat, lng);
        if (response !== null) {
            console.log('🟢[CLIENT_SEARCH] Detalhes do local obtidos:', response);
            const address = response.results[0].formatted_address;
            placeAutocompleteRef.current?.setAddressText(address);
            if (originPlace === undefined) {
                setShouldDrawRoute(true);
            }
            else {
                setShouldDrawRoute(false);
            }
            setOriginPlace({
                lat: lat,
                lng: lng,
                address: address
            });
        }
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

    // Função para filtrar os motoristas com base no tipo de veículo
    const getFilteredDrivers = () => {
        if (vehicleFilter === 'all') {
            return driverMarkers;
        } else if (vehicleFilter === 'car') {
            return driverMarkers.filter(driver => driver.typeVehicle === true);
        } else if (vehicleFilter === 'motorcycle') {
            return driverMarkers.filter(driver => driver.typeVehicle === false);
        }
        return driverMarkers;
    };

    if (!location || isLocationLoading) {
        return (
            <View style={[styles.container, { backgroundColor: '#f8f9fa' }]}>
                <Image
                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.3 }}
                    source={require('../../../../assets/city.jpg')}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FC7700" />
                    <Text style={styles.loadingText}>
                        {isLocationLoading ? '📍 Obtendo sua localização...' : '🗺️ Carregando mapa...'}
                    </Text>
                    <Text style={styles.loadingSubtext}>
                        Isso pode levar alguns segundos
                    </Text>
                </View>
            </View>
        );
    }

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

            {/* BARRA DE FILTROS DE VEÍCULOS */}
            <View style={styles.vehicleFilterBar}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        vehicleFilter === 'all' && styles.filterButtonActive
                    ]}
                    onPress={() => { setVehicleFilter('all'); setIsCarType(true); }}
                >
                    <Ionicons
                        name="apps"
                        size={24}
                        color={vehicleFilter === 'all' ? '#FFFFFF' : '#666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        vehicleFilter === 'car' && styles.filterButtonActive
                    ]}
                    onPress={() => { setVehicleFilter('car'); setIsCarType(true); }}
                >
                    <Ionicons
                        name="car"
                        size={24}
                        color={vehicleFilter === 'car' ? '#FFFFFF' : '#666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        vehicleFilter === 'motorcycle' && styles.filterButtonActive
                    ]}
                    onPress={() => { setVehicleFilter('motorcycle'); setIsCarType(false); }}
                >
                    <MaterialIcons
                        name="two-wheeler"
                        size={24}
                        color={vehicleFilter === 'motorcycle' ? '#FFFFFF' : '#666'}
                    />
                </TouchableOpacity>
            </View>

            <Animated.View
                style={{
                    transform: [
                        { scaleY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1] }) },
                        { translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }) },
                    ],
                    width: '100%',
                    position: 'absolute',
                    top: 0
                }}>
                <MapView
                    customMapStyle={orangeMapStyle}
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: Dimensions.get('window').height * 0.95
                    }}
                    initialRegion={location}
                    zoomControlEnabled={false}
                    // ATUALIZA LOCAL DE ORIGEM AO MOVER O MAPA, SE A ROTA NÃO ESTIVER DESENHADA
                    onRegionChangeComplete={(region) => {
                        // Desativa a atualização do local de origem se a rota já estiver desenhada
                        if (directionsRoute.length === 0) {
                            handleGetPlaceDetailsByCoords(region.latitude, region.longitude);
                        }
                    }}>
                    {
                        getFilteredDrivers().map(driver => (
                            <Marker
                                key={driver.idSocket}
                                coordinate={{
                                    latitude: driver.lat,
                                    longitude: driver.lng
                                }}
                                title={`Condutor: ${driver.id} (${driver.typeVehicle ? 'Carro' : 'Moto'})`}>

                                <View style={{ width: 30, height: 30 }}>

                                    {driver.typeVehicle ? (
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
                        ))
                    }
                    {
                        originMarker && (
                            <Marker
                                coordinate={{
                                    latitude: originMarker!.latitude,
                                    longitude: originMarker!.longitude
                                }}
                                title="Origem"
                                anchor={{ x: 0.5, y: 0.5 }}
                            >
                                <View style={{ width: 30, height: 30 }}>
                                    <Image
                                        source={require('../../../../assets/map.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        destinationPlace && (
                            <Marker
                                coordinate={{
                                    latitude: destinationPlace!.lat,
                                    longitude: destinationPlace!.lng
                                }}
                                title="Destino"
                                anchor={{ x: 0.5, y: 0.5 }}
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
                                {/* Sombra da rota para dar profundidade */}
                                <Polyline
                                    coordinates={directionsRoute}
                                    strokeWidth={8}
                                    strokeColor="black"
                                />
                                {/* Rota principal com gradiente visual */}
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

            </Animated.View>

            {/* Botão Cancelar - aparece acima do temporizador */}
            {isTimerActive && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 280,
                        left: '50%',
                        transform: [{ translateX: -83 }],
                        backgroundColor: '#e74c3c',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 25,
                        zIndex: 1001,
                        elevation: 6,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}
                    onPress={() => {
                        // Sem funcionalidade por enquanto
                        handleCancelClientRequest();
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Cancelar Solicitação
                    </Text>
                </TouchableOpacity>
            )}

            {/* Temporizador - aparece quando está ativo */}
            {isTimerActive && (
                <View style={{
                    position: 'absolute',
                    top: 330,
                    left: '50%',
                    transform: [{ translateX: -137 }],
                    backgroundColor: '#FC7700',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                    zIndex: 1000,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {formatTime(timeLeft)} - Procurando motoristas...
                    </Text>
                </View>
            )}

            {/* BOTÃO FLUTUANTE NO TOPO PARA SOLICITAR MOTORISTA - SÓ APARECE QUANDO TODOS OS DADOS ESTÃO PREENCHIDOS */}
            {isFormComplete() && !isOriginModalVisible && !isDestinationModalVisible && !isOfferModalVisible && !isDriverOfferModalVisible && !isTimerActive && (
                <Animated.View
                    style={[
                        styles.floatingRequestButton,
                        {
                            opacity: floatingButtonAnimated,
                            transform: [
                                {
                                    translateY: floatingButtonAnimated.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-50, 0]
                                    })
                                },
                                {
                                    scale: floatingButtonAnimated.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1]
                                    })
                                }
                            ]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        onPress={handleCreateClientRequest}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <MaterialIcons name="directions-car" size={22} color="#fff" />
                        )}
                        <Text style={styles.floatingRequestButtonText}>
                            {isLoading ? "Enviando..." : "Solicitar Motorista"}
                        </Text>
                        {!isLoading && (
                            <MaterialIcons name="send" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </Animated.View>
            )}

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
                    style={styles.bottomPanel}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >

                    {/* Seção de informações da viagem */}
                    <View style={styles.tripInfoSection}>
                        <Text style={styles.sectionTitle}>Detalhes da Viagem</Text>

                        {/* Seletor de tipo de veículo */}
                        <View style={styles.vehicleTypeSelector}>
                            <Text style={styles.vehicleTypeSelectorLabel}>Tipo de Veículo</Text>
                            <View style={styles.vehicleTypeButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.vehicleTypeButton,
                                        isCarType && styles.vehicleTypeButtonActive
                                    ]}
                                    onPress={() => setIsCarType(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="car"
                                        size={20}
                                        color={isCarType ? '#FFFFFF' : '#666'}
                                    />
                                    <Text style={[
                                        styles.vehicleTypeButtonText,
                                        isCarType && styles.vehicleTypeButtonTextActive
                                    ]}>
                                        Carro
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.vehicleTypeButton,
                                        !isCarType && styles.vehicleTypeButtonActive
                                    ]}
                                    onPress={() => setIsCarType(false)}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons
                                        name="two-wheeler"
                                        size={20}
                                        color={!isCarType ? '#FFFFFF' : '#666'}
                                    />
                                    <Text style={[
                                        styles.vehicleTypeButtonText,
                                        !isCarType && styles.vehicleTypeButtonTextActive
                                    ]}>
                                        Moto
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Local de embarque */}
                        <TouchableOpacity
                            style={styles.originContainer}
                            onPress={() => setIsOriginModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.originIconContainer}>
                                <MaterialIcons name="my-location" size={18} color="#ffffff" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Embarque</Text>
                                <Text style={styles.infoText} numberOfLines={2}>
                                    {originPlace?.address ?? 'Toque para selecionar o local de embarque'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color="#FC7700" />
                        </TouchableOpacity>

                        {/* Destino */}
                        <TouchableOpacity
                            style={styles.destinationContainer}
                            onPress={() => setIsDestinationModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.destinationIconContainer}>
                                <MaterialIcons name="place" size={18} color="#ffffff" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Destino</Text>
                                <Text style={styles.infoText} numberOfLines={2}>
                                    {destinationPlace?.address ?? 'Toque para selecionar o destino'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color="#e74c3c" />
                        </TouchableOpacity>

                        {/* Oferta */}
                        <TouchableOpacity
                            style={styles.offerContainerInfo}
                            onPress={() => setIsOfferModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.offerIconContainer}>
                                <FontAwesome5 name="money-bill-wave" size={16} color="#ffffff" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Sua Oferta</Text>
                                <Text style={styles.infoText}>
                                    {offer ? `R$ ${parseFloat(offer).toFixed(2)}` : 'Toque para definir sua oferta'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color="#27ae60" />
                        </TouchableOpacity>
                    </View>

                    {/* Informações de tempo e distância */}
                    {timeAndDistance && (
                        <View style={styles.tripEstimateSection}>
                            <View style={styles.estimateRow}>
                                <View style={styles.estimateItem}>
                                    <MaterialIcons name="attach-money" size={16} color="#27ae60" />
                                    <Text style={styles.estimateLabel}>Preço sugerido</Text>
                                    <Text style={styles.estimateValue}>R$ {timeAndDistance.recommended_value.toFixed(2)}</Text>
                                </View>
                                <View style={styles.estimateDivider} />
                                <View style={styles.estimateItem}>
                                    <MaterialIcons name="schedule" size={16} color="#3498db" />
                                    <Text style={styles.estimateLabel}>{timeAndDistance.duration.text}</Text>
                                    <Text style={styles.estimateValue}>{timeAndDistance.distance.text}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </ReanimatedAnimated.View>

            {/* Modais */}
            <Modal
                visible={isOriginModalVisible}
                animationType="slide"
                onRequestClose={() => setIsOriginModalVisible(false)}
                transparent={true}
                onShow={() => {
                    placeAutocompleteRef.current?.setAddressText('');
                    setTimeout(() => {
                        placeAutocompleteRef.current?.focus();
                    }, 200);
                }}>
                <Pressable style={styles.modalOverlay} onPress={() => setIsOriginModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <View style={styles.viewDecoration}>
                            <Text style={styles.textDecoration}>📍 Selecione o local de embarque</Text>
                            <TouchableOpacity
                                onPress={() => setIsOriginModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: '43%',
                                    transform: [{ translateY: -12 }],
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.autocompleteContainer}>
                            <GooglePlacesAutocomplete
                                ref={placeAutocompleteRef}
                                styles={{
                                    container: { width: '100%' },
                                    textInput: styles.autocompleteInput,
                                    listView: styles.autocompleteList
                                }}
                                placeholder="Digite o endereço de embarque"
                                fetchDetails={true}
                                keepResultsAfterBlur={true}
                                keyboardShouldPersistTaps='handled'
                                onPress={(data, details = null) => {
                                    console.log('🟢[CLIENT_SEARCH] 🎯 Item selecionado (embarque):', { data, details });
                                    if (details !== null) {
                                        console.log('🟢[CLIENT_SEARCH] ✅ Detalhes do local de embarque:', details);
                                        handleGetPlaceDetails(details!.place_id, true);
                                    } else {
                                        console.log('🟢[CLIENT_SEARCH] ⚠️ Details é null, usando dados do data');
                                        if (data.place_id) {
                                            handleGetPlaceDetails(data.place_id, true);
                                        }
                                    }
                                }}
                                query={{
                                    key: GoogleMapsApiKey,
                                    language: 'pt-BR'
                                }}
                                debounce={300}
                                textInputProps={{
                                    onFocus: () => console.log('🟢[CLIENT_SEARCH] Input de embarque focado'),
                                    onBlur: () => console.log('🟢[CLIENT_SEARCH] Input de embarque desfocado')
                                }}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={isDestinationModalVisible}
                animationType="slide"
                onRequestClose={() => setIsDestinationModalVisible(false)}
                transparent={true}
                onShow={() => {
                    placeAutocompleteDestinationRef.current?.setAddressText('');
                    setTimeout(() => {
                        placeAutocompleteDestinationRef.current?.focus();
                    }, 200);
                }}>
                <Pressable style={styles.modalOverlay} onPress={() => setIsDestinationModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <View style={styles.viewDecoration}>
                            <Text style={styles.textDecoration}>🎯 Selecione o destino</Text>
                            <TouchableOpacity
                                onPress={() => setIsDestinationModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: '43%',
                                    transform: [{ translateY: -12 }],
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.autocompleteContainer}>
                            <GooglePlacesAutocomplete
                                ref={placeAutocompleteDestinationRef}
                                styles={{
                                    container: { width: '100%' },
                                    textInput: styles.autocompleteInput,
                                    listView: styles.autocompleteList
                                }}
                                placeholder="Digite o endereço de destino"
                                fetchDetails={true}
                                keepResultsAfterBlur={true}
                                keyboardShouldPersistTaps='handled'
                                onPress={(data, details = null) => {
                                    console.log('🟢[CLIENT_SEARCH] 🎯 Item selecionado (destino):', { data, details });
                                    if (details !== null) {
                                        console.log('🟢[CLIENT_SEARCH] ✅ Detalhes do destino:', details);
                                        handleGetPlaceDetails(details!.place_id, false);
                                    } else {
                                        console.log('🟢[CLIENT_SEARCH] ⚠️ Details é null, usando dados do data');
                                        if (data.place_id) {
                                            handleGetPlaceDetails(data.place_id, false);
                                        }
                                    }
                                }}
                                query={{
                                    key: GoogleMapsApiKey,
                                    language: 'pt-BR'
                                }}
                                debounce={300}
                                textInputProps={{
                                    onFocus: () => console.log('🟢[CLIENT_SEARCH] Input de destino focado'),
                                    onBlur: () => console.log('🟢[CLIENT_SEARCH] Input de destino desfocado')
                                }}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={isOfferModalVisible}
                animationType="slide"
                onRequestClose={() => setIsOfferModalVisible(false)}
                transparent={true}>
                <Pressable style={styles.modalOverlay} onPress={() => setIsOfferModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <View style={styles.viewDecoration}>
                            <Text style={styles.textDecoration}>💰 Defina sua oferta</Text>
                            <TouchableOpacity
                                onPress={() => setIsOfferModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: '43%',
                                    transform: [{ translateY: -12 }],
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.offerContainer}>
                            <Text style={styles.offerDescription}>
                                Você pode enviar uma oferta maior para aumentar suas chances de conseguir um motorista. O valor máximo permitido é 30% acima do preço recomendado.
                            </Text>
                            {timeAndDistance && (
                                <View>
                                    <Text style={styles.recommendedPrice}>
                                        💡 Valor da viagem: R$ {timeAndDistance.recommended_value.toFixed(2)}
                                    </Text>
                                    <Text style={styles.recommendedPrice}>
                                        💡 Valor máximo permitido: R$ {(timeAndDistance.recommended_value * 1.3).toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <DefaultTextInput
                                icon={require('../../../../assets/dolar.png')}
                                placeholder='Exemplo: 15.00'
                                onChangeText={setOffer}
                                value={offer}
                                keyboardType="numeric"
                                textColor="black"
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity
                                style={styles.confirmOfferButton}
                                onPress={() => {
                                    if (!timeAndDistance) {
                                        showErrorMessage("Valor recomendado não disponível.");
                                        return;
                                    }

                                    const offerValue = parseFloat(offer);
                                    const recommendedValue = timeAndDistance.recommended_value;
                                    const maxValue = recommendedValue * 1.3; // 30% a mais

                                    if (isNaN(offerValue) || offerValue <= 0) {
                                        showErrorMessage("Digite um valor válido.");
                                        setOffer(recommendedValue.toFixed(2).toString());
                                        return;
                                    }

                                    if (offerValue < recommendedValue) {
                                        showErrorMessage(`O valor deve ser maior ou igual ao recomendado: R$ ${recommendedValue.toFixed(2)}`);
                                        setOffer(recommendedValue.toFixed(2).toString());
                                        return;
                                    }

                                    if (offerValue > maxValue) {
                                        showErrorMessage(`O valor não pode ser mais de 30% superior ao recomendado: R$ ${maxValue.toFixed(2)}`);
                                        setOffer(recommendedValue.toFixed(2).toString());
                                        return;
                                    }

                                    setIsOfferModalVisible(false);
                                }}
                            >
                                <Text style={styles.confirmOfferText}>Confirmar Oferta</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Círculo de pulso atrás do pin */}
            {showLocationPulse && location && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: '#FC7700',
                        marginLeft: -40,
                        marginTop: -40,
                        opacity: locationPulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 0]
                        }),
                        transform: [{
                            scale: locationPulseAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 2]
                            })
                        }],
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* Pin com animação de escala */}
            <Animated.Image
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    height: 50,
                    width: 50,
                    marginTop: -25,
                    marginLeft: -25,
                    transform: showLocationPulse ? [
                        {
                            scale: locationPulseAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [1, 1.2, 1]
                            })
                        }
                    ] : []
                }}
                source={require('../../../../assets/pin_red.png')}
            />

            <Modal
                visible={isDriverOfferModalVisible}
                animationType="fade"
                onRequestClose={() => setIsDriverOfferModalVisible(false)}
                transparent={true}>
                <FlatList
                    data={driverTripOffers}
                    keyExtractor={(item: DriverTripOffer) => item.id!.toString()}
                    renderItem={({ item }: { item: DriverTripOffer }) =>
                        <DriverOfferItem
                            viewModel={viewModel}
                            driverTripOffer={item}
                            navigation={navigation}
                            onReject={() => {
                                // onReject mantido para compatibilidade, mas a lógica de fechamento
                                // agora está na função handleRemoveDriverOffer
                            }}
                            onRemove={handleRemoveDriverOffer}
                        />
                    }
                />
            </Modal>

            {/* Botão customizado de reload */}
            {/* <View style={{ position: 'absolute', left: 16, bottom: 350, flexDirection: 'column', gap: 12 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.replace('ClientSearchMapScreen');
                    }}
                    style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name='reload-outline' size={25} color={'white'} />
                </TouchableOpacity>
            </View> */}

            {/* Botões customizados de zoom e centralização */}
            <View style={{ position: 'absolute', right: 16, bottom: 350, flexDirection: 'column', gap: 12 }}>
                <TouchableOpacity
                    onPress={() => {
                        if (mapRef.current && location) {
                            mapRef.current.animateCamera({
                                center: {
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                },
                                zoom: 15,
                            });

                            // Iniciar animação de pulso
                            setShowLocationPulse(true);
                            locationPulseAnim.setValue(0);

                            Animated.loop(
                                Animated.sequence([
                                    Animated.timing(locationPulseAnim, {
                                        toValue: 1,
                                        duration: 1000,
                                        useNativeDriver: true,
                                    }),
                                    Animated.timing(locationPulseAnim, {
                                        toValue: 0,
                                        duration: 1000,
                                        useNativeDriver: true,
                                    }),
                                ]),
                                { iterations: 3 } // 3 ciclos de pulsação = 6 segundos
                            ).start(() => {
                                setShowLocationPulse(false);
                            });
                        }
                    }}
                    style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 8 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name='locate-outline' size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleZoom('in')}
                    style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 8 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name='add-outline' size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleZoom('out')}
                    style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name='remove-outline' size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.replace('ClientSearchMapScreen');
                    }}
                    style={{ backgroundColor: '#FC7700', borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 4 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name='reload-outline' size={25} color={'white'} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 48, backgroundColor: '#000', position: 'absolute', bottom: 0, width: '100%', zIndex: 1003 }} />
        </View>
    );
}