import { Text, View, Image, ToastAndroid, ScrollView, StatusBar, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/MainStackNavigator';
import DefaultTextInput from '../../../components/DefaultTextInput';
import { useEffect, useState } from 'react';
import { ProfileStackParamList } from '../../../navigator/ProfileStackNavigator';
import * as ImagePicker from 'expo-image-picker';
import { container } from '../../../../di/container';
import { ProfileUpdateViewModel } from './ProfileUpdateViewModel';

const { width, height } = Dimensions.get('window');

interface Props extends StackScreenProps<ProfileStackParamList, 'ProfileUpdateScreen'> { };

export default function ProfileUpdateScreen({ navigation, route }: Props) {
    const viewModel: ProfileUpdateViewModel = container.resolve('profileUpdateViewModel');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const showImagePickerAlert = () => {
        Alert.alert(
            'Selecionar Foto',
            'Escolha uma opção para atualizar sua foto de perfil',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Câmera',
                    onPress: takePhoto,
                },
                {
                    text: 'Galeria',
                    onPress: pickImage,
                },
            ]
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        } else {
            console.log('Usuário cancelou a captura da foto.');
        }
    };

    useEffect(() => {
        if (authResponse !== null) {
            setName(authResponse!.user!.name!);
            setLastname(authResponse!.user!.lastname!);
            setPhone(authResponse!.user!.phone!);
        }
    }, [authResponse]);

    const handleUpdateUser = async () => {
        if (!name.trim() || !lastname.trim() || !phone.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            let response = null;

            if (image !== null) {
                response = await viewModel.updateWithImage({
                    id: authResponse?.user.id,
                    name: name,
                    lastname: lastname,
                    phone: phone,
                    email: authResponse?.user.email!
                }, image);
            } else {
                response = await viewModel.update({
                    id: authResponse?.user.id,
                    name: name,
                    lastname: lastname,
                    phone: phone,
                    email: authResponse?.user.email!
                });
            }

            if ('id' in response) {
                ToastAndroid.show("Perfil atualizado com sucesso!", ToastAndroid.LONG);
                saveAuthSession({
                    user: { ...response, roles: authResponse?.user.roles },
                    token: authResponse?.token!,
                    session_id: authResponse?.session_id!,
                    refresh_token: authResponse?.refresh_token!
                });

                navigation.navigate('ProfileInfoScreen');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={updateStyles.container}>
            {/* <StatusBar barStyle="light-content" backgroundColor="#2196F3" /> */}

            <ScrollView
                style={updateStyles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Premium */}
                <View style={updateStyles.headerContainer}>
                    <View style={updateStyles.headerBackground}>
                        <TouchableOpacity
                            style={updateStyles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={updateStyles.headerContent}>
                            <Text style={updateStyles.headerTitle}>Editar Perfil</Text>
                            <Text style={updateStyles.headerSubtitle}>
                                Atualize suas informações pessoais
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Profile Photo Section */}
                <View style={updateStyles.photoSection}>
                    <Text style={updateStyles.sectionTitle}>Foto de Perfil</Text>

                    <TouchableOpacity
                        style={updateStyles.photoContainer}
                        onPress={showImagePickerAlert}
                        activeOpacity={0.8}
                    >
                        {image ? (
                            <Image style={updateStyles.profileImage} source={{ uri: image }} />
                        ) : authResponse?.user.image ? (
                            <Image style={updateStyles.profileImage} source={{ uri: authResponse.user.image }} />
                        ) : (
                            <View style={updateStyles.placeholderImage}>
                                <Ionicons name="person" size={48} color="#CCCCCC" />
                            </View>
                        )}

                        <View style={updateStyles.cameraIcon}>
                            <Ionicons name="camera" size={20} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    <Text style={updateStyles.photoHint}>
                        Toque para alterar sua foto de perfil
                    </Text>
                </View>

                {/* Form Section */}
                <View style={updateStyles.formSection}>
                    <Text style={updateStyles.sectionTitle}>Informações Pessoais</Text>

                    <View style={updateStyles.inputContainer}>
                        <Text style={updateStyles.inputLabel}>Nome *</Text>
                        <View style={updateStyles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#666666" style={updateStyles.inputIcon} />
                            <TextInput
                                style={updateStyles.textInput}
                                placeholder="Seu nome"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#AAAAAA"
                            />
                        </View>
                    </View>

                    <View style={updateStyles.inputContainer}>
                        <Text style={updateStyles.inputLabel}>Sobrenome *</Text>
                        <View style={updateStyles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#666666" style={updateStyles.inputIcon} />
                            <TextInput
                                style={updateStyles.textInput}
                                placeholder="Seu sobrenome"
                                value={lastname}
                                onChangeText={setLastname}
                                placeholderTextColor="#AAAAAA"
                            />
                        </View>
                    </View>

                    <View style={updateStyles.inputContainer}>
                        <Text style={updateStyles.inputLabel}>Telefone *</Text>
                        <View style={updateStyles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#666666" style={updateStyles.inputIcon} />
                            <TextInput
                                style={updateStyles.textInput}
                                placeholder="(00) 00000-0000"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#AAAAAA"
                            />
                        </View>
                    </View>

                    <View style={updateStyles.inputContainer}>
                        <Text style={updateStyles.inputLabel}>E-mail</Text>
                        <View style={[updateStyles.inputWrapper, updateStyles.disabledInput]}>
                            <Ionicons name="mail-outline" size={20} color="#CCCCCC" style={updateStyles.inputIcon} />
                            <Text style={updateStyles.disabledText}>{authResponse?.user.email}</Text>
                        </View>
                        <Text style={updateStyles.helperText}>
                            O e-mail não pode ser alterado por questões de segurança
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <View style={updateStyles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            updateStyles.saveButton,
                            loading && updateStyles.disabledButton
                        ]}
                        onPress={handleUpdateUser}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={updateStyles.saveButtonText}>Salvar Alterações</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={updateStyles.bottomSpacer} />
            </ScrollView>

            <View style={updateStyles.navigationBar} />
        </SafeAreaView>
    );
}

const updateStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        height: 130,
        marginBottom: -10,
    },
    headerBackground: {
        flex: 1,
        backgroundColor: '#2196F3',
        paddingTop: 20,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    headerContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textAlign: 'center',
    },
    photoSection: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 20,
        alignSelf: 'flex-start',
        width: '100%',
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        elevation: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    photoHint: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
        textAlign: 'center',
    },
    formSection: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        opacity: 0.7,
    },
    disabledText: {
        flex: 1,
        fontSize: 16,
        color: '#888888',
        fontWeight: '500',
    },
    helperText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '400',
        marginTop: 6,
        fontStyle: 'italic',
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 32,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        elevation: 0,
        shadowOpacity: 0,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    bottomSpacer: {
        height: 32,
    },
    navigationBar: {
        height: 48,
        backgroundColor: '#000000',
    },
});