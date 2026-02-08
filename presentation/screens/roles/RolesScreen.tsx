import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigator/MainStackNavigator";
import { Text, FlatList, Image, StatusBar, View, BackHandler, TouchableOpacity, Modal } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import styles from './Styles';
import RolesItem from "./RolesItem";
import { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { SocketService } from "../../../data/sources/remote/services/SocketService";
import { Ionicons } from "@expo/vector-icons";

interface Props extends StackScreenProps<RootStackParamList, 'RolesScreen'> { };

export default function RolesScreen({ navigation, route }: Props) {

    const { authResponse, removeAuthSession } = useAuth();
    const socketService = new SocketService();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    // Impede que o usuário volte usando o botão físico do Android e verifica telefone
    useFocusEffect(
        React.useCallback(() => {
            console.log('Auth Response no RolesScreen:', authResponse?.token);
            console.log('useFocusEffect em RolesScreen acionado');

            socketService.disconnect();
            // Verificar se o telefone está verificado
            if (authResponse?.user) {
                console.log('Phone Verified:', authResponse.user.phone_verified);
                if (!authResponse.user.phone_verified) {
                    console.log('Navegando para PhoneVerifiedScreen porque o telefone não está verificado.');
                    navigation.navigate('PhoneVerifiedScreen');
                    return; // Sai da função se precisar navegar para verificação
                }
            }

            const onBackPress = () => {
                // Retorna true para interceptar o evento e não permitir voltar
                return true;
            };

            // Adiciona o listener quando a tela ganha foco
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // Remove o listener quando a tela perde foco
            return () => backHandler.remove();
        }, [authResponse?.user?.phone_verified])
    );

    const handleLogout = () => {
        removeAuthSession();
        rootNavigation.replace('SplashScreen');
        setShowLogoutModal(false);
    };

    const LogoutButton = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showLogoutModal}
            onRequestClose={() => setShowLogoutModal(false)}
            statusBarTranslucent={true}
        >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.75)" barStyle="light-content" />
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
    );

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                <Image
                    style={styles.imageBackground}
                    source={require('../../../assets/city.jpg')}
                />

                {/* Botão de Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        setShowLogoutModal(true);
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FC7700" />
                </TouchableOpacity>

                <FlatList
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingTop: 150 }}
                    data={authResponse?.user.roles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <RolesItem role={item} navigation={navigation} authResponse={authResponse} removeAuthSession={removeAuthSession} />}
                />

                <LogoutButton />
                <View style={styles.bottomBar} />
            </View>
        </>
    );
}