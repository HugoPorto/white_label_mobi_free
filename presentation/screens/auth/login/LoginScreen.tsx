import { Text, View, Image, StatusBar, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Modal, ScrollView, Platform, TextInput } from 'react-native';
import DefaultTextInput from '../../../components/DefaultTextInput';
import DefaultRoundedButton from '../../../components/DefaultRoundedButton';
import CustomAlert from '../../../components/CustomAlert';
import PasswordStrength from '../../../components/PasswordStrength';
import EyeIcon from '../../../components/EyeIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/MainStackNavigator';
import styles from './Styles';
import { useState } from 'react';
import EmailValidator from '../../../utils/EmailValidator';
import { LoginViewModel } from './LoginViewModel';
import { container } from '../../../../di/container';
import { useAuth } from '../../../hooks/useAuth';
import { usePushNotifications } from '../../../hooks/usePushNotifications';
import { Ionicons } from '@expo/vector-icons';
import { BalanceViewModel } from '../../balance/BalanceViewModel';
import DeviceInfo from 'react-native-device-info';

interface Props extends StackScreenProps<RootStackParamList, 'LoginScreen'> { };
export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const balanceViewModel: BalanceViewModel = container.resolve('balanceViewModel');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryPhone, setRecoveryPhone] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);
    const { getToken } = usePushNotifications();
    const loginViewModel: LoginViewModel = container.resolve('loginViewModel');
    const { saveAuthSession } = useAuth();

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    const isFormValid = () => {
        return email.trim() !== '' &&
            password.trim() !== '' &&
            EmailValidator(email.trim());
    };

    const isEmailValid = () => {
        return email.trim() !== '' && EmailValidator(email.trim());
    };

    const handleForgotPassword = () => {
        setForgotPasswordModalVisible(true);
    };

    const formatPhoneNumber = (text: string) => {
        let cleaned = text.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        if (!cleaned.startsWith('+55')) {
            cleaned = '+55' + cleaned.replace(/^\+/, '');
        }
        return cleaned;
    };

    const isPhoneValid = (phone: string) => {
        const phoneRegex = /^\+55\d{11}$/;
        return phoneRegex.test(phone);
    };

    const handlePasswordRecovery = async () => {
        if (!recoveryEmail.trim() || !EmailValidator(recoveryEmail.trim())) {
            showAlert('Erro', 'Digite um e-mail válido');
            return;
        }
        if (!recoveryPhone.trim() || !isPhoneValid(recoveryPhone)) {
            showAlert('Erro', 'Digite um telefone válido no formato +5591989898520');
            return;
        }

        setIsRecovering(true);

        try {
            const response = await loginViewModel.recoverPassword(recoveryEmail, recoveryPhone);

            if ('error' in response) {
                const errorMessage = Array.isArray(response.message)
                    ? response.message.join(', ')
                    : response.message || 'Não foi possível processar a recuperação de senha. Verifique os dados e tente novamente.';
                showAlert('Erro', errorMessage);
            } else {
                setForgotPasswordModalVisible(false);
                setRecoveryEmail('');
                setRecoveryPhone('');
                const successMessage = typeof response.message === 'string'
                    ? response.message
                    : 'Uma nova senha foi enviada para o número de telefone cadastrado. Verifique suas mensagens SMS.';
                showAlert('Sucesso', successMessage);
            }
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            showAlert('Erro', 'Ocorreu um erro ao processar a recuperação de senha. Tente novamente mais tarde.');
        } finally {
            setIsRecovering(false);
        }
    };

    const handleLogin = async () => {
        if (!isFormValid()) {
            return;
        }

        setIsLoading(true);

        try {
            const device_id = await DeviceInfo.getUniqueId();
            const response = await loginViewModel.login(email, password, device_id);

            if ('token' in response) {
                saveAuthSession(response);

                getToken().then(token => {
                    if (token) {
                        loginViewModel.updateNotificationToken(response.user.id!, token as string);
                    }
                }).catch(error => {
                    console.error('Erro ao obter token de notificação:', error);
                });

                const hasDriverRole = response.user.roles?.some(role => role.id === 'DRIVER');

                if (hasDriverRole) {
                    const balance = await balanceViewModel.getBalanceByUserId(response.user.id!);

                    if (!balance || Array.isArray(balance) && balance.length === 0 || (typeof balance === 'object' && !('id' in balance))) {

                        await balanceViewModel.create({
                            balance_in: 0,
                            balance_out: 0,
                            id_user: response.user.id!,
                        });
                    }

                    if ('vehicles' in response && (!response.vehicles || response.vehicles.length === 0)) {
                        navigation.replace('VehicleRegisterScreen');
                        return;
                    }
                } else {
                    navigation.replace('ClientHomeScreen');
                    return;
                }

                if (response.user.roles!.length > 1) {
                    navigation.replace('RolesScreen');
                    return;
                }
                else {
                    navigation.replace('ClientHomeScreen');
                    return;
                }
            } else {
                showAlert('Erro', 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
            }
        } catch (error) {
            showAlert('Erro', 'Falha na conexão. Verifique sua internet e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>

                <Image
                    style={styles.imageBackground}
                    source={require('../../../../assets/city.jpg')}/>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.form}>
                            <Image
                                source={require('../../../../assets/partiu.png')}
                                style={styles.imageLogo}/>
                            <Image
                                source={require('../../../../assets/user_2.png')}
                                style={styles.imageUser}/>

                            <Text style={styles.textLogin}>LOGIN</Text>

                            <DefaultTextInput
                                icon={require('../../../../assets/email.png')}
                                placeholder='E-mail'
                                onChangeText={setEmail}
                                value={email}
                                keyboardType='email-address'
                                showValidation={emailTouched}
                                isValid={isEmailValid()}
                                onFocus={() => setEmailTouched(true)}
                                onBlur={() => setEmailTouched(true)}/>

                            <DefaultTextInput
                                icon={require('../../../../assets/password.png')}
                                placeholder='Senha'
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry={!showPassword}
                                showValidation={passwordTouched}
                                isValid={password.length >= 4}
                                onFocus={() => setPasswordTouched(true)}
                                onBlur={() => setPasswordTouched(true)}
                                rightIconComponent={<EyeIcon isVisible={showPassword} />}
                                onRightIconPress={() => setShowPassword(!showPassword)}/>

                            <PasswordStrength
                                password={password}
                                visible={passwordTouched && password.length > 0}/>

                            <DefaultRoundedButton
                                text={isLoading ? 'ENTRANDO...' : 'ENTRAR'}
                                onPress={() => {
                                    handleLogin();
                                }}
                                disabled={!isFormValid() || isLoading}/>

                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#FC7700" />
                                </View>
                            )}

                            {/* Botão Esqueci minha senha */}
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                style={styles.forgotPasswordButton}
                                disabled={isLoading}>

                                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                            </TouchableOpacity>

                            <View style={styles.containerTextDontHaveAccount}>
                                <View style={styles.divider}></View>
                                <Text style={styles.textDontHaveAccount}>Não tem conta?</Text>
                                <View style={styles.divider}></View>
                            </View>

                            {/* Link para Políticas de Privacidade */}
                            <TouchableOpacity
                                onPress={() => setPrivacyModalVisible(true)}
                                style={styles.privacyLinkButton}
                                disabled={isLoading}>
                                <Text style={styles.privacyLinkText}>
                                    Políticas de Privacidade e Termos de Serviço
                                </Text>
                            </TouchableOpacity>

                            <DefaultRoundedButton
                                text='CADASTRE-SE'
                                onPress={() => navigation.navigate('RegisterScreen')}
                                backgroundColor='black'
                            />
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

                {/* Modal de Políticas de Privacidade e Termos de Serviço */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={privacyModalVisible}
                    onRequestClose={() => setPrivacyModalVisible(false)}>
                    <View style={styles.privacyModalOverlay}>
                        <View style={styles.privacyModalContainer}>
                            {/* Header do Modal */}
                            <View style={styles.privacyModalHeader}>
                                <TouchableOpacity
                                    onPress={() => setPrivacyModalVisible(false)}
                                    style={styles.privacyModalCloseButton}
                                    activeOpacity={0.7}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>

                                <View style={styles.privacyModalIcon}>
                                    <Ionicons name="shield-checkmark" size={30} color="#FFFFFF" />
                                </View>

                                <Text style={styles.privacyModalTitle}>
                                    Políticas de Privacidade e Termos de Serviço
                                </Text>
                                <Text style={styles.privacyModalSubtitle}>
                                    Conforme Lei Geral de Proteção de Dados (LGPD)
                                </Text>
                            </View>

                            {/* Conteúdo do Modal */}
                            <ScrollView
                                style={styles.privacyModalScrollContainer}
                                showsVerticalScrollIndicator={false}>
                                <Text style={styles.privacyModalSectionTitle}>
                                    1. Coleta e Uso de Dados Pessoais
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    O Partiu App coleta dados pessoais necessários para o funcionamento do serviço, incluindo: nome, e-mail, telefone, CPF, localização em tempo real e dados de veículos. Estes dados são utilizados exclusivamente para prestação do serviço de transporte e melhorias na plataforma.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    2. Base Legal (LGPD Art. 7º)
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    O tratamento de dados pessoais é realizado com base no consentimento do titular e na execução de contrato do qual o titular seja parte, conforme estabelecido na Lei 13.709/2018 (LGPD).
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    3. Compartilhamento de Dados
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Os dados pessoais não são vendidos ou compartilhados com terceiros para fins comerciais. Compartilhamentos ocorrem apenas quando necessário para prestação do serviço (ex: localização entre motorista e passageiro durante corrida) ou por determinação legal.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    4. Segurança dos Dados
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição não autorizada.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    5. Seus Direitos (LGPD Art. 18)
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos/inexatos; anonimizar, bloquear ou eliminar dados desnecessários; solicitar portabilidade; eliminar dados tratados com consentimento; revogar consentimento; e obter informações sobre compartilhamento.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    6. Retenção de Dados
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Os dados pessoais são mantidos pelo período necessário para cumprimento das finalidades descritas, respeitando prazos legais e regulamentares. Após esse período, os dados são eliminados ou anonimizados.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    7. Cookies e Tecnologias Similares
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    O aplicativo pode utilizar cookies e tecnologias similares para melhorar a experiência do usuário e análise de desempenho.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    8. Alterações na Política
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas através do aplicativo ou e-mail cadastrado.
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    9. Contato - Encarregado de Dados (DPO)
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail: suporte@partiu.digital
                                </Text>
                                <Text style={styles.privacyModalSectionTitle}>
                                    10. Aceite dos Termos
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    Ao utilizar o Partiu App, você declara ter lido, compreendido e concordado com esta Política de Privacidade e Termos de Serviço, bem como consente com o tratamento de seus dados pessoais conforme descrito.
                                </Text>
                                <Text style={styles.privacyModalText}>
                                    <Text style={{ fontWeight: 'bold' }}>Data de vigência:</Text> 01 de Janeiro de 2025{'\n'}
                                    <Text style={{ fontWeight: 'bold' }}>Última atualização:</Text> 01 de Janeiro de 2025
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Modal de Recuperação de Senha */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={forgotPasswordModalVisible}
                    onRequestClose={() => setForgotPasswordModalVisible(false)}
                >
                    <View style={styles.recoveryModalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View style={styles.recoveryModalContent}>
                                {/* Header */}
                                <View style={styles.recoveryModalHeader}>
                                    <Ionicons name="lock-closed" size={40} color="#FC7700" />
                                    <Text style={styles.recoveryModalTitle}>Recuperar Senha</Text>
                                    <Text style={styles.recoveryModalSubtitle}>
                                        Digite seus dados para receber uma nova senha
                                    </Text>
                                </View>

                                {/* Mensagem informativa */}
                                <View style={styles.recoveryInfoBox}>
                                    <Ionicons name="information-circle" size={20} color="#2196F3" />
                                    <Text style={styles.recoveryInfoText}>
                                        Enviaremos uma nova senha via SMS para o número cadastrado
                                    </Text>
                                </View>

                                {/* Input de E-mail */}
                                <View style={styles.recoveryInputWrapper}>
                                    <Ionicons name="mail" size={20} color="#FC7700" style={styles.recoveryInputIcon} />
                                    <TextInput
                                        style={styles.recoveryInput}
                                        placeholder='Digite seu e-mail'
                                        placeholderTextColor="#999"
                                        onChangeText={setRecoveryEmail}
                                        value={recoveryEmail}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                                </View>

                                {/* Input de Telefone */}
                                <View style={styles.recoveryInputWrapper}>
                                    <Ionicons name="call" size={20} color="#FC7700" style={styles.recoveryInputIcon} />
                                    <TextInput
                                        style={styles.recoveryInput}
                                        placeholder='Telefone (+5591989898520)'
                                        placeholderTextColor="#999"
                                        onChangeText={(text) => setRecoveryPhone(formatPhoneNumber(text))}
                                        value={recoveryPhone}
                                        keyboardType='phone-pad'
                                    />
                                </View>

                                {/* Botões */}
                                <TouchableOpacity
                                    style={[
                                        styles.recoveryButton,
                                        (!EmailValidator(recoveryEmail) || !isPhoneValid(recoveryPhone) || isRecovering) &&
                                        styles.recoveryButtonDisabled
                                    ]}
                                    onPress={handlePasswordRecovery}
                                    disabled={!EmailValidator(recoveryEmail) || !isPhoneValid(recoveryPhone) || isRecovering}
                                >
                                    {isRecovering ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.recoveryButtonText}>RECUPERAR SENHA</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setForgotPasswordModalVisible(false);
                                        setRecoveryEmail('');
                                        setRecoveryPhone('');
                                    }}
                                    style={styles.recoveryCancelButton}
                                    disabled={isRecovering}
                                >
                                    <Text style={styles.recoveryCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
                <View style={styles.bottomBar} />
            </View>
        </>
    )
}