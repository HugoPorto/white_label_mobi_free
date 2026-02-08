import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import { AuthProvider } from "../context/AuthContext";
import { container } from "../../di/container";
import RolesScreen from "../screens/roles/RolesScreen";
import SplashScreen from "../screens/splash/SplashScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomDrawerContent } from "./CustomDrawerContent";
import DriverMyLocationMapScreen from "../screens/driver/myLocationMap/DriverMyLocationMapScreen";
import { ProfileStackNavigator, ProfileStackParamList } from "./ProfileStackNavigator";
import { ClientMapStackNavigator } from "./ClientMapStackNavigator";
import { DriverMapStackNavigator } from "./DriverMapStackNavigator";
import { ClientTripHistoryScreen } from "../screens/client/tripHistory/ClientTripHistoryScreen";
import { DriverTripHistoryScreen } from "../screens/driver/tripHistory/DriverTripHistoryScreen";
import VehicleRegisterScreen from "../screens/vehicle/VehicleRegisterScreen";
import { VehiclesScreen } from "../screens/vehicle/VehiclesScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import { TouchableOpacity, Modal, View, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigatorScreenParams } from "@react-navigation/native";
import { ClientMapStackParamList } from "./ClientMapStackNavigator";
import { DriverMapStackParamList } from "./DriverMapStackNavigator";
import { useState } from "react";
import { BalanceScreen } from "../screens/balance/BalanceScreen";
import PhoneVerifiedScreen from "../screens/auth/login/PhoneVerifiedScreen";
import SelectClientScreen from "../screens/selectClientScreen/SelectClientScreen";
import PendingScreen from "../screens/pending/PendingScreen";
import { DocsScreen } from "../screens/docs/DocsScreen";

export type RootStackParamList = {
    SplashScreen: undefined,
    LoginScreen: undefined,
    RegisterScreen: undefined,
    RolesScreen: undefined,
    ClientHomeScreen: undefined,
    DriverHomeScreen: undefined,
    DriverMyLocationMapScreen: undefined,
    ClientSearchMapScreen: undefined,
    ProfileStackNavigator: NavigatorScreenParams<ProfileStackParamList>,
    DriverClientRequestScreen: undefined,
    ClientMapStackNavigator: NavigatorScreenParams<ClientMapStackParamList>,
    DriverMapStackNavigator: NavigatorScreenParams<DriverMapStackParamList>,
    ClientTripHistoryScreen: undefined,
    DriverTripHistoryScreen: undefined,
    VehicleRegisterScreen: undefined,
    VehiclesScreen: undefined,
    ChatScreen: { comeFrom: string, id_receiver: number, id_client_request?: number },
    BalanceScreen: undefined,
    PhoneVerifiedScreen: undefined,
    PendingScreen: { documents: any[] },
    PrivacyScreen: undefined,
    HelpScreen: undefined,
    AdminScreen: undefined,
    MessagesScreen: undefined,
    CallsScreen: undefined,
    ListChatsScreen: undefined,
    SelectClientScreen: undefined,
    TripScheduleClientSearchMapScreen: undefined,
    DeliveryPackageClientSearchMapScreen: undefined,
    FreightClientSearchMapScreen: undefined,
    DriverSchedulesScreen: undefined,
    DriverClientRequestTripScheduleScreen: undefined,
    DocsScreen: undefined,
    ClientTripScheduledHistoryScreen: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();


export const MainStackNavigator = () => {
    const authUseCases = container.resolve('authUseCases');

    return (
        <AuthProvider authUseCases={authUseCases}>
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="PhoneVerifiedScreen"
                    component={PhoneVerifiedScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        headerLeft: () => null,
                    }}
                    name="PendingScreen"
                    component={PendingScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="SplashScreen"
                    component={SplashScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="LoginScreen"
                    component={LoginScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="RegisterScreen"
                    component={RegisterScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        headerLeft: () => null,
                    }}
                    name="RolesScreen"
                    component={RolesScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ClientHomeScreen"
                    component={ClientDrawerNavigator}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="DriverHomeScreen"
                    component={DriverDrawerNavigator}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        headerLeft: () => null,
                    }}
                    name="VehicleRegisterScreen"
                    component={VehicleRegisterScreen}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="SelectClientScreen"
                    component={SelectClientScreen}
                />
            </Stack.Navigator>
        </AuthProvider>
    )
}

const ClientDrawerNavigator = () => {
    const getClientStackTitle = (state: any) => {
        if (!state) return "Mapa do Cliente";

        const route = state.routes[state.index];

        if (route.name === 'ClientMapStackNavigator' && route.state) {
            const stackRoute = route.state.routes[route.state.index];

            switch (stackRoute.name) {
                case 'ClientSearchMapScreen':
                    return "Buscar Corrida";
                case 'ClientTripMapScreen':
                    return "Corrida em Andamento";
                case 'ClientTripRatingScreen':
                    return "Avaliar Motorista";
                default:
                    return "Mapa do Cliente";
            }
        }
        return "Mapa do Cliente";
    };

    const LogoutButton = () => {
        const { removeAuthSession } = useAuth();
        const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
        const [showLogoutModal, setShowLogoutModal] = useState(false);

        const handleLogout = () => {
            removeAuthSession();
            navigation.replace('SplashScreen');
            setShowLogoutModal(false);
        };

        return (
            <>
                <TouchableOpacity
                    onPress={() => setShowLogoutModal(true)}
                    style={{
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        marginRight: 10
                    }}
                >
                    <Ionicons name="log-out" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showLogoutModal}
                    onRequestClose={() => setShowLogoutModal(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            width: '90%',
                            maxWidth: 350,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 24,
                            padding: 0,
                            elevation: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                        }}>
                            <View style={{
                                alignItems: 'center',
                                paddingTop: 32,
                                paddingHorizontal: 24,
                                paddingBottom: 20
                            }}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#FFF3E0',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20,
                                    borderWidth: 3,
                                    borderColor: '#FF9800'
                                }}>
                                    <Ionicons name="log-out" size={36} color="#FF9800" />
                                </View>
                                <Text style={{
                                    fontSize: 24,
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    textAlign: 'center',
                                    marginBottom: 12
                                }}>
                                    Sair da Conta?
                                </Text>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#666666',
                                    textAlign: 'center',
                                    lineHeight: 24,
                                    paddingHorizontal: 12
                                }}>
                                    Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente.
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                borderTopWidth: 1,
                                borderTopColor: '#f0f0f0'
                            }}>
                                <TouchableOpacity
                                    onPress={() => setShowLogoutModal(false)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 18,
                                        alignItems: 'center',
                                        borderRightWidth: 1,
                                        borderRightColor: '#f0f0f0'
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: '#666666'
                                    }}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 18,
                                        alignItems: 'center',
                                        backgroundColor: '#FF5722',
                                        borderBottomRightRadius: 24
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#FFFFFF'
                                    }}>
                                        Sair
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
    };

    return (
        <Drawer.Navigator
            initialRouteName="ClientMapStackNavigator"
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#FC7700',
                drawerInactiveTintColor: '#FC7700',
                headerTintColor: '#FFFFFF'
            }}>
            <Drawer.Screen
                name="ClientMapStackNavigator"
                component={ClientMapStackNavigator}
                options={({ navigation }) => ({
                    title: getClientStackTitle(navigation.getState()),
                    headerTitleAlign: 'left',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Ionicons name="map" size={24} color={color} />
                    )
                })}
            />
            <Drawer.Screen
                name="ProfileStackNavigator"
                component={ProfileStackNavigator}
                options={{
                    title: "Perfil",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    headerRight: () => <LogoutButton />,
                    drawerIcon: ({ color }) => (
                        <Ionicons name="person" size={24} color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="ClientTripHistoryScreen"
                component={ClientTripHistoryScreen}
                options={{
                    title: "Histórico de Viagens",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    headerRight: () => <LogoutButton />,
                    drawerIcon: ({ color }) => (
                        <Ionicons name="time" size={24} color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    title: "Chat",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerItemStyle: { display: 'none' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="chatbubbles" size={24} color={color} />
                    )
                }}
            />
        </Drawer.Navigator>
    );
}

const DriverDrawerNavigator = () => {
    const getDriverStackTitle = (state: any) => {
        if (!state) return "Corridas";

        const route = state.routes[state.index];

        if (route.name === 'DriverMapStackNavigator' && route.state) {
            const stackRoute = route.state.routes[route.state.index];

            switch (stackRoute.name) {
                case 'DriverTripMapScreen':
                    return "Corrida em Andamento";
                case 'DriverTripRatingScreen':
                    return "Avaliar Cliente";
                default:
                    return "Corridas";
            }
        }
        return "Corrida em Andamento";
    };

    const TypeVehicleButton = () => {
        const { authResponse } = useAuth();

        return (
            <>
                <View
                    style={{
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        marginRight: 10
                    }}
                >
                    {authResponse?.user.car ? (
                        <Ionicons name="car" size={24} color="#fff" />
                    ) : (
                        <MaterialIcons name="two-wheeler" size={24} color="#fff" />
                    )}
                </View>
            </>
        );
    };

    return (
        <Drawer.Navigator initialRouteName="DriverMyLocationMapScreen"
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#FC7700',
                drawerInactiveTintColor: '#FC7700',
                headerTintColor: '#FFFFFF'
            }}>
            <Drawer.Screen
                name="DriverMyLocationMapScreen"
                component={DriverMyLocationMapScreen}
                options={{
                    title: "Mapa do Motorista",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    headerRight: () => <TypeVehicleButton />,
                    drawerIcon: ({ color }) => (
                        <Ionicons name="location" size={24} color={color} />
                    )
                }}
            />
            <Drawer.Screen
                name="DriverTripHistoryScreen"
                component={DriverTripHistoryScreen}
                options={{
                    title: "Histórico de Corridas",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="file-tray-full" size={24} color={color} />
                    )
                }} />
            <Drawer.Screen
                name="ProfileStackNavigator"
                component={ProfileStackNavigator}
                options={{
                    title: "Perfil",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="person" size={24} color={color} />
                    )
                }} />
            <Drawer.Screen
                name="VehiclesScreen"
                component={VehiclesScreen}
                options={{
                    title: "Veículos",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="car-sport" size={24} color={color} />
                    )
                }} />
            <Drawer.Screen
                name="DocsScreen"
                component={DocsScreen}
                options={{
                    title: "Documentação",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="car-sport" size={24} color={color} />
                    )
                }} />
            <Drawer.Screen
                name="BalanceScreen"
                component={BalanceScreen}
                options={{
                    title: "Saldo",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="wallet" size={24} color={color} />
                    )
                }} />
            <Drawer.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    title: "Chat",
                    headerTitleAlign: 'left',
                    headerStyle: { backgroundColor: '#4CAF50' },
                    headerTitleStyle: { color: '#FFFFFF' },
                    drawerItemStyle: { display: 'none' },
                    drawerIcon: ({ color }) => (
                        <Ionicons name="chatbubbles" size={24} color={color} />
                    )
                }}
            />
        </Drawer.Navigator>
    );
}