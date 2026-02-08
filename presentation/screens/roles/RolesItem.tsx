import { Image, View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import { Role } from "../../../domain/models/Role";
import styles from './Styles';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigator/MainStackNavigator";
import { useUserRole } from "../../context/UserRoleContext";
import { AuthResponse } from "../../../domain/models/AuthResponse";
import { VehicleRegisterViewModel } from "../vehicle/VehicleRegisterViewModel";
import { container } from "../../../di/container";
import { DocumentsViewModel } from "../vehicle/DocumentsViewModel";
import { DriverMyLocationMapViewModel } from "../driver/myLocationMap/DriverMyLocationMapViewModel";
import { ClientSerchMapViewModel } from "../client/searchMap/ClientSearchMapViewModel";

interface Props {
    navigation: StackNavigationProp<RootStackParamList, 'RolesScreen', undefined>
    role: Role
    authResponse: AuthResponse | null,
    removeAuthSession: () => void
}

export default function RolesItem({ navigation, role, authResponse, removeAuthSession }: Props) {
    const { setUserRole } = useUserRole();
    const vehicleViewModel: VehicleRegisterViewModel = container.resolve('vehicleRegisterViewModel');
    const documentsViewModel = new DocumentsViewModel();

    const handleRoleSelection = async () => {
        try {
            if (role.id == 'CLIENT') {
                try {
                    const viewModel: ClientSerchMapViewModel = container.resolve('clientSearchMapViewModel');
                    const cleanToken = authResponse!.token.replace('Bearer ', '');
                    await viewModel.setSocketToken(cleanToken);
                    console.log('✅ Token JWT (CLIENT) atualizado nos sockets');
                } catch (error) {
                    console.log('⚠️ Aviso: Não foi possível atualizar token nos sockets:', error);
                } finally {
                    await setUserRole('CLIENT');
                    console.log('✅ Papel CLIENT selecionado e salvo');
                    navigation.navigate('SelectClientScreen');
                }
            }
            else if (role.id == 'DRIVER') {
                if (authResponse?.user && authResponse.user.id) {
                    try {
                        const driverViewModel: DriverMyLocationMapViewModel = container.resolve('driverMyLocationMapViewModel');
                        const cleanToken = authResponse.token.replace('Bearer ', '');
                        await driverViewModel.setSocketToken(cleanToken);
                        console.log('✅ Token JWT (DRIVER) atualizado nos sockets');

                        const documents = await documentsViewModel.getUserDocuments(authResponse.user.id, authResponse.session_id);

                        await setUserRole('DRIVER');

                        if (Array.isArray(documents) && documents.length > 0) {
                            navigation.navigate('PendingScreen', { documents });
                        } else if (Array.isArray(documents)) {
                            navigation.replace('DriverHomeScreen');
                        } else {
                            console.error('❌ Erro ao buscar documentos:', documents);
                        }
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            ToastAndroid.show('Sessão expirada. Faça login novamente.', ToastAndroid.LONG);
                            await removeAuthSession();
                            navigation.replace('LoginScreen');
                        }
                    }
                } else {
                    console.error('❌ ID do usuário não disponível no authResponse');
                    navigation.replace('SplashScreen');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao salvar papel do usuário:', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleRoleSelection}>
            <View style={styles.roleCard}>
                <View style={styles.roleImageWrapper}>
                    <Image
                        style={styles.roleImage}
                        source={{ uri: role.image }}
                    />
                </View>
                <Text style={styles.roleName}>{role.name}</Text>
            </View>
        </TouchableOpacity>
    );
}