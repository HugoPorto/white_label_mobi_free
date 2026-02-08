import { View, Text, Image, TouchableOpacity, Alert, StatusBar, BackHandler, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styles from "./StylesDefault";
import DefaultTextInput from "../../components/DefaultTextInput";
import DefaultRoundedButton from "../../components/DefaultRoundedButton";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigator/MainStackNavigator";
import { useEffect, useState } from "react";
import { container } from "../../../di/container";
import { VehicleRegisterViewModel } from "./VehicleRegisterViewModel";
import { useAuth } from "../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

interface Props extends StackScreenProps<RootStackParamList, 'VehicleRegisterScreen'> { };

export default function VehicleRegisterScreen({ navigation, route }: Props) {

    const [typeVehicle, setTypeVehicle] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [year, setYear] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const { authResponse, saveAuthSession, removeAuthSession } = useAuth();
    const vehicleRegisterViewModel: VehicleRegisterViewModel = container.resolve('vehicleRegisterViewModel');

    useFocusEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                "Cadastro Obrigatório",
                "Para continuar usando o app como motorista, você precisa cadastrar um veículo.",
                [{ text: "OK" }]
            );
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription.remove();
    });

    useEffect(() => {
        console.log('===============================================');
        console.log('FILE: VehicleRegisterScreen.tsx - VERIFICANDO VEÍCULO DO USUÁRIO AUTENTICADO');
        console.log('AuthResponseVehicleCar:', authResponse?.user.car);
        console.log('===============================================');
        if (authResponse?.user.car) {
            console.log('================================================');
            console.log('FILE: VehicleRegisterScreen.tsx - USUÁRIO JÁ POSSUI CARRO CADASTRADO');
            console.log('Usuário já possui carro cadastrado, definindo typeVehicle como car automaticamente');
            console.log('================================================');
            setTypeVehicle('car');
        } else {
            console.log('================================================');
            console.log('FILE: VehicleRegisterScreen.tsx - USUÁRIO JÁ POSSUI MOTO CADASTRADA');
            console.log('Usuário já possui moto cadastrada, definindo typeVehicle como motorcycle automaticamente');
            console.log('================================================');
            setTypeVehicle('motorcycle');
        }
    }, [authResponse]);

    const handleRegister = async () => {
        if (typeVehicle === "") {
            Alert.alert("Erro", "O tipo de veículo não pode estar vazio")
            return;
        }

        if (licensePlate === "") {
            Alert.alert("Erro", "A placa não pode estar vazia")
            return;
        }

        if (typeVehicle === "CAR" && licensePlate.length !== 7) {
            Alert.alert("Erro", "A placa do carro deve ter 7 caracteres");
            return;
        }

        if (typeVehicle === "MOTO" && licensePlate.length !== 7) {
            Alert.alert("Erro", "A placa da moto deve ter 7 caracteres");
            return;
        }

        if (year === "") {
            Alert.alert("Erro", "O ano não pode estar vazio")
            return;
        }

        const currentYear = new Date().getFullYear();

        const yearNumber = Number(year);
        
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > currentYear) {
            Alert.alert("Erro", `O ano deve ser um número entre 1900 e ${currentYear}`);
            return;
        }

        const response = await vehicleRegisterViewModel.register({
            id_user: authResponse?.user.id!,
            typeVehicle: typeVehicle,
            licensePlate: licensePlate,
            year: yearNumber,
            brand: brand.trim() || undefined,
            model: model.trim() || undefined,
            color: color.trim() || undefined,
            isMain: true
        });

        if (response && 'statusCode' in response && response.statusCode === 403) {
            Alert.alert("Erro", "Você não tem permissão para cadastrar este veículo.");
            return;
        }

        if (response && authResponse) {
            if ('typeVehicle' in response && 'licensePlate' in response && 'year' in response) {
                const vehicleToAdd = { // GARANTIR QUE ISMAIN SEJA SEMPRE BOOLEAN (NÃO UNDEFINED)
                    ...response,
                    isMain: response.isMain ?? true
                };

                const updatedAuth = {
                    ...authResponse,
                    vehicles: [...(authResponse.vehicles || []), vehicleToAdd]
                };

                saveAuthSession(updatedAuth);

                Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
                    {
                        text: "OK",
                        onPress: () => navigation.replace('RolesScreen'),
                    },
                ]);
            }
        }
    }

    const handleLogout = () => {
        Alert.alert(
            "Confirmar Logout",
            "Tem certeza que deseja sair da sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        await removeAuthSession();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'LoginScreen' }],
                        });
                    }
                }
            ]
        );
    }

    const isFormValid = typeVehicle !== "" && licensePlate !== "" && year !== "";

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <View style={styles.container}>
                <Image
                    source={require('../../../assets/city.jpg')}
                    style={styles.imageBackground} />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.form}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: 20,
                                        padding: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    }}>
                                    <Ionicons name="log-out-outline" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Image
                                source={require('../../../assets/partiu.png')}
                                style={styles.imageLogo}
                            />
                            <Image
                                source={require('../../../assets/piston.png')}
                                style={styles.imageUser}
                            />
                            <Text style={styles.textRegister}>CADASTRO DO VEÍCULO {authResponse?.user.car ? '(CARRO)' : '(MOTO)'}</Text>
                            <View style={styles.inputsContainer}>
                                <DefaultTextInput
                                    placeholder="Placa"
                                    value={licensePlate}
                                    onChangeText={setLicensePlate}
                                    icon={require('../../../assets/license-plate.png')}
                                />
                                <DefaultTextInput
                                    placeholder="Ano"
                                    value={year}
                                    onChangeText={setYear}
                                    icon={
                                        typeVehicle === 'MOTO'
                                            ? require('../../../assets/motorbike.png')
                                            : require('../../../assets/car.png')
                                    }
                                />
                                <DefaultTextInput
                                    placeholder="Marca (opcional)"
                                    value={brand}
                                    onChangeText={setBrand}
                                    icon={require('../../../assets/license-plate.png')}
                                />
                                <DefaultTextInput
                                    placeholder="Modelo (opcional)"
                                    value={model}
                                    onChangeText={setModel}
                                    icon={require('../../../assets/license-plate.png')}
                                />
                                <DefaultTextInput
                                    placeholder="Cor (opcional)"
                                    value={color}
                                    onChangeText={setColor}
                                    icon={require('../../../assets/license-plate.png')}
                                />
                                <DefaultRoundedButton
                                    text="CADASTRAR"
                                    backgroundColor={isFormValid ? "black" : "gray"}
                                    onPress={isFormValid ? handleRegister : () => { }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}