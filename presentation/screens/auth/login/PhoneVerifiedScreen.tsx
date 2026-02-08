import { Text, View, Image, StatusBar, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Alert, Modal } from 'react-native';
import DefaultRoundedButton from '../../../components/DefaultRoundedButton';
import CustomAlert from '../../../components/CustomAlert';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/MainStackNavigator';
import styles from './PhoneVerifiedStyles';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { LoginViewModel } from './LoginViewModel';
import { container } from '../../../../di/container';
import { ProfileUpdateViewModel } from '../../profile/update/ProfileUpdateViewModel';

// Componente LogoutButton movido para fora para evitar re-renderizações
const LogoutButton = ({ visible, onClose, onConfirm }: { visible: boolean; onClose: () => void; onConfirm: () => void }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
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
                        onPress={onClose}
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
                        onPress={onConfirm}
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

interface Props extends StackScreenProps<RootStackParamList, 'PhoneVerifiedScreen'> { };
export default function PhoneVerifiedScreen({ navigation, route }: Props) {

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);
    const loginViewModel: LoginViewModel = container.resolve('loginViewModel');
    const profileViewModel: ProfileUpdateViewModel = container.resolve('profileUpdateViewModel');
    const { authResponse, removeAuthSession, saveAuthSession } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Função para formatar o telefone brasileiro para exibição
    const formatPhoneNumber = (phone: string): string => {
        if (!phone) return '+55 (11) 99999-9999';

        // Remove todos os caracteres não numéricos
        const cleanPhone = phone.replace(/\D/g, '');

        // Se começar com 55 (código do Brasil), remove
        let phoneDigits = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;

        // Se não tiver 11 dígitos (com o 9), adiciona o 9 se necessário
        if (phoneDigits.length === 10) {
            // Adiciona o 9 no celular se não tiver
            phoneDigits = phoneDigits.substring(0, 2) + '9' + phoneDigits.substring(2);
        }

        // Formatar no padrão +55 (XX) 9XXXX-XXXX
        if (phoneDigits.length >= 11) {
            const ddd = phoneDigits.substring(0, 2);
            const firstPart = phoneDigits.substring(2, 7);
            const secondPart = phoneDigits.substring(7, 11);
            return `+55 (${ddd}) ${firstPart}-${secondPart}`;
        }

        return '+55 (11) 99999-9999'; // Fallback
    };

    // Função para formatar o telefone para API (formato +5591985552791)
    const formatPhoneForAPI = (phone: string): string => {
        if (!phone) return '';

        // Remove todos os caracteres não numéricos
        const cleanPhone = phone.replace(/\D/g, '');

        // Se começar com 55 (código do Brasil), remove
        let phoneDigits = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;

        // Se não tiver 11 dígitos (com o 9), adiciona o 9 se necessário
        if (phoneDigits.length === 10) {
            // Adiciona o 9 no celular se não tiver
            phoneDigits = phoneDigits.substring(0, 2) + '9' + phoneDigits.substring(2);
        }

        // Retornar no formato +55XXXXXXXXXXX
        return `+55${phoneDigits}`;
    };

    // Pegar o telefone formatado do usuário logado
    const phoneNumber = formatPhoneNumber(authResponse?.user.phone || '');

    // Estados para o modal customizado
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    // Função para mostrar o modal customizado
    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    // Função para verificar se o código está completo
    const isCodeComplete = () => {
        return code.every(digit => digit !== '');
    };

    // Função para lidar com mudança no input do código
    const handleCodeChange = (value: string, index: number) => {
        // Apenas números são aceitos
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue.length <= 1) {
            const newCode = [...code];
            newCode[index] = numericValue;
            setCode(newCode);

            // Auto-avançar para o próximo input
            if (numericValue && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Função para lidar com backspace
    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Função para reenviar código
    const handleResendCode = async () => {
        if (!canResend) return;

        setIsResending(true);
        try {
            if (authResponse?.user?.phone) {
                const formattedPhone = formatPhoneForAPI(authResponse.user.phone);
                console.log('Reenviando SMS para:', formattedPhone);
                await loginViewModel.sendPhoneVerification(formattedPhone);
            }

            showAlert('Código Reenviado', 'Um novo código foi enviado para seu telefone.');
            setTimer(60);
            setCanResend(false);
        } catch (error) {
            showAlert('Erro', 'Não foi possível reenviar o código. Tente novamente.');
        } finally {
            setIsResending(false);
        }
    };

    // Timer para reenvio do código
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, canResend]);

    useFocusEffect(
        React.useCallback(() => {
            const sendVerificationIfNeeded = async () => {
                if (authResponse?.user) {
                    if (!authResponse.user.phone_verified) {
                        const formattedPhone = formatPhoneForAPI(authResponse.user.phone!);
                        console.log('Enviando SMS para:', formattedPhone);
                        await loginViewModel.sendPhoneVerification(formattedPhone);
                    }
                }
            };
            sendVerificationIfNeeded();
        }, [authResponse?.user?.phone_verified])
    );


    const handleVerifyCode = async () => {
        if (!isCodeComplete()) {
            showAlert('Código Incompleto', 'Digite todos os 6 dígitos do código.');
            return;
        }

        setIsLoading(true);
        const fullCode = code.join('');

        try {
            if (authResponse?.user?.phone) {
                const formattedPhone = formatPhoneForAPI(authResponse.user.phone);
                console.log('Verificando código:', fullCode);
                console.log('Para o telefone:', formattedPhone);

                const response = await loginViewModel.verifyPhoneCode(formattedPhone, fullCode);
                console.log('Response da verificação:', response);

                // Verificar se a resposta é um erro
                if ('success' in response && response.success === false) {
                    // É um ErrorResponse
                    const errorMessage = Array.isArray(response.message)
                        ? response.message.join(', ')
                        : response.message || 'Erro na verificação do código';
                    showAlert('Erro', errorMessage);
                    // Limpar o código em caso de erro
                    setCode(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                } else if ('verified' in response) {
                    // É uma resposta de verificação válida
                    if (response.verified) {

                        let response = null;

                        response = await profileViewModel.update({
                            id: authResponse?.user.id,
                            name: authResponse!.user.name,
                            lastname: authResponse!.user.lastname,
                            phone: authResponse!.user.phone,
                            email: authResponse?.user.email!,
                            cpf: authResponse?.user.cpf!,
                            phone_verified: true
                        });

                        if ('id' in response) {
                            showAlert('Sucesso', 'Telefone verificado com sucesso!');

                            saveAuthSession({
                                user: { ...response, roles: authResponse?.user.roles },
                                token: authResponse?.token!,
                                refresh_token: authResponse!.refresh_token,
                                session_id: authResponse!.session_id
                            });

                        } else {
                            Alert.alert('Erro', 'Não foi possível atualizar seus dados. Tente novamente mais tarde.');
                        }

                        // Navegar para a próxima tela (pode ser login ou home dependendo do fluxo)
                        setTimeout(() => {
                            navigation.replace('RolesScreen');
                            return;
                        }, 1500);
                    } else {
                        showAlert('Código Inválido', 'O código digitado está incorreto. Verifique e tente novamente.');
                        // Limpar o código em caso de erro
                        setCode(['', '', '', '', '', '']);
                        inputRefs.current[0]?.focus();
                    }
                } else {
                    // Resposta inesperada
                    showAlert('Erro', 'Resposta inesperada do servidor.');
                    setCode(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                }
            }

        } catch (error) {
            console.error('Erro na verificação do código:', error);
            showAlert('Erro de Conexão', 'Não foi possível verificar o código. Verifique sua conexão e tente novamente.');
            // Limpar o código em caso de erro
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        removeAuthSession();
        rootNavigation.replace('SplashScreen');
        setShowLogoutModal(false);
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>

                <Image
                    style={styles.imageBackground}
                    source={require('../../../../assets/city.jpg')}
                />

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        setShowLogoutModal(true);
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FC7700" />
                </TouchableOpacity>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.form}>
                            <View style={styles.phoneVerificationIcon}>
                                <Ionicons name="phone-portrait" size={80} color="#FC7700" />
                            </View>

                            <Text style={styles.textLogin}>VERIFICAÇÃO</Text>
                            <Text style={styles.textSubtitle}>
                                Digite o código de 6 dígitos enviado para:
                            </Text>
                            <Text style={styles.textPhoneNumber}>{phoneNumber}</Text>

                            {/* Campos de input para o código de 6 dígitos */}
                            <View style={styles.codeInputContainer}>
                                {code.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => {
                                            if (ref) {
                                                inputRefs.current[index] = ref;
                                            }
                                        }}
                                        style={[
                                            styles.codeInput,
                                            digit ? styles.codeInputFilled : null
                                        ]}
                                        value={digit}
                                        onChangeText={(value) => handleCodeChange(value, index)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        textAlign="center"
                                        selectTextOnFocus
                                        editable={!isLoading}
                                    />
                                ))}
                            </View>

                            <DefaultRoundedButton
                                text={isLoading ? 'VERIFICANDO...' : 'VERIFICAR CÓDIGO'}
                                onPress={handleVerifyCode}
                                disabled={!isCodeComplete() || isLoading}
                            />

                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#FC7700" />
                                </View>
                            )}

                            {/* Botão para reenviar código */}
                            <View style={styles.resendContainer}>
                                {!canResend ? (
                                    <Text style={styles.timerText}>
                                        Reenviar código em {timer}s
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleResendCode}
                                        style={styles.resendButton}
                                        disabled={isResending}
                                    >
                                        <Text style={styles.resendButtonText}>
                                            {isResending ? 'Reenviando...' : 'Reenviar código'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Botão para voltar */}
                            {/* <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                                disabled={isLoading}
                            >
                                <Ionicons name="arrow-back" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.backButtonText}>Alterar número</Text>
                            </TouchableOpacity> */}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Modal customizado para alertas */}
                <CustomAlert
                    visible={alertVisible}
                    title={alertTitle}
                    message={alertMessage}
                    onClose={closeAlert}
                />

                {/* Modal de logout */}
                <LogoutButton 
                    visible={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                />
            </View>
        </>
    )
}