import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform, Modal } from "react-native";
import styles from "./Styles";
import DefaultTextInput from "../../../components/DefaultTextInput";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal";
import LoadingModal from "../../../components/LoadingModal";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import { useState, useEffect } from "react";
import EmailValidator from "../../../utils/EmailValidator";
import { container } from "../../../../di/container";
import { RegisterViewModel } from "./RegisterViewModel";
import { useCustomModal } from "../../../hooks/useCustomModal";
import { Ionicons } from "@expo/vector-icons";
import { styles as loginStyles } from '../login/Styles';

interface Props extends StackScreenProps<RootStackParamList, 'RegisterScreen'> { };

// Função auxiliar para validar senha
const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
        return { isValid: false, message: "A senha deve ter pelo menos 6 caracteres" };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { isValid: false, message: "A senha deve conter ao menos 1 letra maiúscula, 1 minúscula e 1 número" };
    }
    return { isValid: true };
};

// Função auxiliar para validar telefone (apenas celular brasileiro)
const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Somente celular brasileiro: 11 dígitos (DDD + 9 + 8 dígitos)
    // Exemplo: (11) 99999-9999 = 11999999999
    if (cleaned.length === 11) {
        // Verifica se o terceiro dígito é 9 (obrigatório para celulares)
        return cleaned.charAt(2) === '9';
    }
    
    return false;
};

// Lista de domínios de email temporário bloqueados
const BLOCKED_EMAIL_DOMAINS = [
    'tempmail.com', 'tempmailo.com', 'tempmail.org', 'tempmail.net', 'tempmail.ws', 
    'tempmail.us', 'tempmail.email', 'tempmail.plus', 'tempmail.dev', 'tempmailbox.com',
    '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk', 
    '10minutemail.de', '10minutemail.fr', '10minutemail.us', 'guerrillamail.com',
    'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.de', 'guerrillamail.biz',
    'guerrillamail.info', 'guerrillamailblock.com', 'sharklasers.com', 'mailinator.com',
    'mailinator.net', 'mailinator.org', 'mailinator2.com', 'yopmail.com', 'yopmail.net',
    'yopmail.fr', 'yopmail.org', 'yopmail.info', 'cool.fr.nf', 'jetable.fr.nf',
    'courriel.fr.nf', 'nospam.ze.tc', 'mega.zik.dj', 'speed.1s.fr', 'getnada.com',
    'nada.ltd', 'nadaemail.net', 'maildrop.cc', 'maildrop.cf', 'maildrop.ga',
    'maildrop.gq', 'maildrop.ml', 'trashmail.com', 'trashmail.de', 'trashmail.net',
    'trashmail.me', 'dispostable.com', 'mailnesia.com', 'mailnesia.net', 'fakeinbox.com',
    'fakeinbox.org', 'fakebox.org', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
    'inboxkitten.com', 'moakt.com', 'moakt.cc', 'moakt.co', 'moakt.ws', 'tmail.ws',
    'tmail.io', 'tmail.org', 'burnermail.io', 'burnermail.com', 'burnermail.net',
    'burnermail.org', 'grr.la', 'pokemail.net', 'pokemail.com', 'pokemail.org',
    'spam4.me', 'spamdecoy.net', 'spamcero.com', 'spambox.info', 'spambox.irish',
    'spambog.com', 'spambog.de', 'spambog.ru', 'mailcatch.com', 'mailcatch.net',
    'linshi-email.com', 'linshiyouxiang.net', 'mytrashmail.com', 'my10minutemail.com',
    'mail-temporaire.fr', 'mail-temporaire.com', 'tempinbox.com', 'tempmailer.com',
    'tempmailer.net', 'tempmailer.org', 'tempmailer.de', 'tempmailer.cc', 'tempmailer.us',
    'temporarymail.com', 'temporarymail.net', 'temporarymail.org', 'temporarymail.de',
    'temporarymail.cc', 'temporarymail.us', 'mintemail.com', 'wegwerfmail.de',
    'wegwerfmail.net', 'wegwerfmail.org', 'wegwerfmail.info', 'mailde.de', 'mailde.net',
    'mailde.org', 'trashmail.ws', 'mailnull.com', 'mohmal.com', 'mohmal.in',
    'mohmal.im', 'mohmal.tech', 'mohmal.ir', 'harakirimail.com', 'anonbox.net',
    'anonmail.top', 'anonmail.xyz', 'anonmails.de', 'anonmails.net', 'tempmailaddress.com',
    'tempmailaddress.org', 'tempmailaddress.net'
];

// Função para validar se o email não é temporário
const validateEmailDomain = (email: string): boolean => {
    if (!email || !email.includes('@')) return true;
    
    const domain = email.toLowerCase().split('@')[1];
    return !BLOCKED_EMAIL_DOMAINS.includes(domain);
};

// Função para formatar telefone (apenas celular brasileiro)
const formatPhone = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    
    // Para celulares brasileiros (11 dígitos com DDD)
    if (cleaned.length === 11) {
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
    
    // Formatação parcial durante a digitação (somente celular)
    if (cleaned.length <= 11) {
        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 7) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }
    }
    
    return cleaned;
};

export default function RegisterScreen({ navigation, route }: Props) {

    const { modalConfig, isVisible, hideModal, showSuccess, showError } = useCustomModal();

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDriver, setIsDriver] = useState(false);
    const [isCar, setIsCar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    // Estados para validação em tempo real
    const [fieldValidation, setFieldValidation] = useState({
        name: { isValid: true, message: '' },
        lastname: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        phone: { isValid: true, message: '' },
        password: { isValid: true, message: '' },
        confirmPassword: { isValid: true, message: '' }
    });

    const registerViewModel: RegisterViewModel = container.resolve('registerViewModel');

    // Validação em tempo real
    useEffect(() => {
        setFieldValidation(prev => ({
            ...prev,
            name: {
                isValid: name.length === 0 || name.trim().length >= 2,
                message: name.length > 0 && name.trim().length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : ''
            }
        }));
    }, [name]);

    useEffect(() => {
        setFieldValidation(prev => ({
            ...prev,
            lastname: {
                isValid: lastname.length === 0 || lastname.trim().length >= 2,
                message: lastname.length > 0 && lastname.trim().length < 2 ? 'Sobrenome deve ter pelo menos 2 caracteres' : ''
            }
        }));
    }, [lastname]);

    useEffect(() => {
        let isValid = true;
        let message = '';

        if (email.length > 0) {
            if (!EmailValidator(email)) {
                isValid = false;
                message = 'E-mail inválido';
            } else if (!validateEmailDomain(email)) {
                isValid = false;
                message = 'Emails temporários não são permitidos. Use um email permanente.';
            }
        }

        setFieldValidation(prev => ({
            ...prev,
            email: {
                isValid: isValid,
                message: message
            }
        }));
    }, [email]);

    useEffect(() => {
        setFieldValidation(prev => ({
            ...prev,
            phone: {
                isValid: phone.length === 0 || validatePhone(phone),
                message: phone.length > 0 && !validatePhone(phone) ? 'Digite um celular válido no formato (91) 98502-0025' : ''
            }
        }));
    }, [phone]);

    useEffect(() => {
        const validation = password.length === 0 ? { isValid: true, message: '' } : validatePassword(password);
        setFieldValidation(prev => ({
            ...prev,
            password: {
                isValid: validation.isValid,
                message: validation.message || ''
            }
        }));
    }, [password]);

    useEffect(() => {
        setFieldValidation(prev => ({
            ...prev,
            confirmPassword: {
                isValid: confirmPassword.length === 0 || confirmPassword === password,
                message: confirmPassword.length > 0 && confirmPassword !== password ? 'Senhas não coincidem' : ''
            }
        }));
    }, [confirmPassword, password]);

    // Reset isCar quando isDriver é desmarcado
    useEffect(() => {
        if (!isDriver && isCar) {
            setIsCar(false);
        }
    }, [isDriver, isCar]);

    const handlePhoneChange = (text: string) => {
        const formattedPhone = formatPhone(text);
        if (formattedPhone.length <= 15) { // Limita o tamanho para (99) 99999-9999
            setPhone(formattedPhone);
        }
    };

    const validateForm = (): boolean => {
        if (name.trim().length === 0) {
            showError("Erro", "O nome é obrigatório");
            return false;
        }

        if (lastname.trim().length === 0) {
            showError("Erro", "O sobrenome é obrigatório");
            return false;
        }

        if (email.trim().length === 0) {
            showError("Erro", "O e-mail é obrigatório");
            return false;
        }

        if (phone.trim().length === 0) {
            showError("Erro", "O celular é obrigatório");
            return false;
        }

        if (password.length === 0) {
            showError("Erro", "A senha é obrigatória");
            return false;
        }

        if (confirmPassword.length === 0) {
            showError("Erro", "A confirmação de senha é obrigatória");
            return false;
        }

        if (!privacyAccepted) {
            showError("Erro", "Você deve aceitar as Políticas de Privacidade e Termos de Serviço para continuar");
            return false;
        }

        // Verifica se todos os campos são válidos
        const hasInvalidFields = Object.values(fieldValidation).some(field => !field.isValid);
        if (hasInvalidFields) {
            showError("Erro", "Por favor, corrija os erros nos campos destacados");
            return false;
        }

        return true;
    };

    // Função para verificar se o formulário está pronto (sem mostrar erros)
    const isFormReady = (): boolean => {
        const allFieldsValid = Object.values(fieldValidation).every(field => field.isValid);
        const allFieldsFilled = name.trim() !== '' &&
            lastname.trim() !== '' &&
            email.trim() !== '' &&
            phone.trim() !== '' &&
            password !== '' &&
            confirmPassword !== '';

        return allFieldsValid && allFieldsFilled && privacyAccepted;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerViewModel.register({
                name: name.trim(),
                lastname: lastname.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.replace(/\D/g, ''), // Remove formatação para enviar só números
                password: password,
                rolesIds: isDriver ? ["CLIENT", "DRIVER"] : ["CLIENT"],
                car: isDriver ? isCar : undefined // Só envia o valor de isCar se isDriver for true
            });

            console.log('Response:', response);

            if (response && 'success' in response) {
                if (response.user.id === undefined) {
                    showError("Erro", "ID do usuário não encontrado para criar saldo.");
                    return;
                }

                // const balanceResponse = await registerViewModel.createBalance({
                //     balance_in: 0,
                //     balance_out: 0,
                //     id_user: response.user.id,
                // });

                // console.log('Balance Response:', balanceResponse);

                if ((response && 'success' in response)) {
                    showSuccess(
                        "Sucesso!",
                        "Cadastro realizado com sucesso! 🎉",
                        () => navigation.replace('LoginScreen')
                    );
                } else {
                    showError("Erro", "Erro ao criar o saldo do usuário. Tente novamente.");
                }
            } else {
                showError("Erro", "Erro no cadastro. Verifique os dados e tente novamente.");
            }
        } catch (error) {
            console.error('Register error:', error);
            showError("Erro", "Erro de conexão. Verifique sua internet e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                <Image
                    source={require('../../../../assets/city.jpg')}
                    style={styles.imageBackground}
                />

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
                            <TouchableOpacity
                                onPress={() => navigation.pop()}
                                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                                style={styles.backButton}
                            >
                                <Image
                                    style={styles.back}
                                    source={require('../../../../assets/left_arrow.png')}
                                />
                            </TouchableOpacity>

                            <Image
                                source={require('../../../../assets/user_2.png')}
                                style={styles.imageUser}
                            />

                            <Text style={styles.textRegister}>CADASTRO</Text>
                            <Text style={styles.textSubtitle}>Crie sua conta e comece a usar!</Text>

                            <View style={styles.inputsContainer}>
                                <DefaultTextInput
                                    placeholder="Nome"
                                    value={name}
                                    onChangeText={setName}
                                    icon={require('../../../../assets/user.png')}
                                    isValid={fieldValidation.name.isValid}
                                    showValidation={name.length > 0}
                                />
                                {!fieldValidation.name.isValid && fieldValidation.name.message && (
                                    <Text style={styles.errorText}>{fieldValidation.name.message}</Text>
                                )}

                                <DefaultTextInput
                                    placeholder="Sobrenome"
                                    value={lastname}
                                    onChangeText={setLastname}
                                    icon={require('../../../../assets/user_image.png')}
                                    isValid={fieldValidation.lastname.isValid}
                                    showValidation={lastname.length > 0}
                                />
                                {!fieldValidation.lastname.isValid && fieldValidation.lastname.message && (
                                    <Text style={styles.errorText}>{fieldValidation.lastname.message}</Text>
                                )}

                                <DefaultTextInput
                                    placeholder="E-mail"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    icon={require('../../../../assets/email.png')}
                                    isValid={fieldValidation.email.isValid}
                                    showValidation={email.length > 0}
                                />
                                {!fieldValidation.email.isValid && fieldValidation.email.message && (
                                    <Text style={styles.errorText}>{fieldValidation.email.message}</Text>
                                )}

                                <DefaultTextInput
                                    placeholder="Celular (91) 9XXXX-XXXX"
                                    value={phone}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="numeric"
                                    icon={require('../../../../assets/phone.png')}
                                    isValid={fieldValidation.phone.isValid}
                                    showValidation={phone.length > 0}
                                />
                                {!fieldValidation.phone.isValid && fieldValidation.phone.message && (
                                    <Text style={styles.errorText}>{fieldValidation.phone.message}</Text>
                                )}

                                <DefaultTextInput
                                    placeholder="Senha"
                                    value={password}
                                    onChangeText={setPassword}
                                    icon={require('../../../../assets/password.png')}
                                    secureTextEntry={!showPassword}
                                    isValid={fieldValidation.password.isValid}
                                    showValidation={password.length > 0}
                                    rightIconComponent={
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Text style={styles.showPasswordText}>
                                                {showPassword ? '🙈' : '👁️'}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />
                                {!fieldValidation.password.isValid && fieldValidation.password.message && (
                                    <Text style={styles.errorText}>{fieldValidation.password.message}</Text>
                                )}

                                <DefaultTextInput
                                    placeholder="Confirmar Senha"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    icon={require('../../../../assets/password.png')}
                                    secureTextEntry={!showConfirmPassword}
                                    isValid={fieldValidation.confirmPassword.isValid}
                                    showValidation={confirmPassword.length > 0}
                                    rightIconComponent={
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Text style={styles.showPasswordText}>
                                                {showConfirmPassword ? '🙈' : '👁️'}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />
                                {!fieldValidation.confirmPassword.isValid && fieldValidation.confirmPassword.message && (
                                    <Text style={styles.errorText}>{fieldValidation.confirmPassword.message}</Text>
                                )}
                            </View>

                            <CustomCheckbox
                                isChecked={isDriver}
                                onToggle={() => setIsDriver(!isDriver)}
                                label="Quero ser motorista também 🚗"
                            />

                            <CustomCheckbox
                                isChecked={isCar && isDriver} // Só pode estar marcado se isDriver for true
                                onToggle={() => {
                                    if (isDriver) {
                                        setIsCar(!isCar);
                                    }
                                }}
                                label="Vou dirigir uma moto 🏍️"
                                disabled={!isDriver} // Desabilita quando isDriver é false
                            />

                            {/* Checkbox de Políticas de Privacidade */}
                            <CustomCheckbox
                                isChecked={privacyAccepted}
                                onToggle={() => setPrivacyAccepted(!privacyAccepted)}
                                label="Eu li e aceito as Políticas de Privacidade e Termos de Serviço 📋"
                            />

                            {/* Link para Políticas de Privacidade */}
                            <TouchableOpacity
                                onPress={() => setPrivacyModalVisible(true)}
                                style={styles.privacyLinkButton}
                                disabled={isLoading}
                            >
                                <Text style={styles.privacyLinkText}>
                                    📖 Ler Políticas de Privacidade e Termos de Serviço
                                </Text>
                            </TouchableOpacity>

                            <DefaultRoundedButton
                                text={isLoading ? "CADASTRANDO..." : "CADASTRAR"}
                                backgroundColor="black"
                                onPress={handleRegister}
                                disabled={isLoading || !isFormReady()}
                            />

                            <TouchableOpacity
                                onPress={() => navigation.navigate('LoginScreen')}
                                style={styles.loginLink}
                            >
                                <Text style={styles.loginLinkText}>
                                    Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {/* Modal de Políticas de Privacidade e Termos de Serviço */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={privacyModalVisible}
                    onRequestClose={() => setPrivacyModalVisible(false)}
                >
                    <View style={loginStyles.privacyModalOverlay}>
                        <View style={loginStyles.privacyModalContainer}>
                            {/* Header do Modal */}
                            <View style={loginStyles.privacyModalHeader}>
                                <TouchableOpacity
                                    onPress={() => setPrivacyModalVisible(false)}
                                    style={loginStyles.privacyModalCloseButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>

                                <View style={loginStyles.privacyModalIcon}>
                                    <Ionicons name="shield-checkmark" size={30} color="#FFFFFF" />
                                </View>

                                <Text style={loginStyles.privacyModalTitle}>
                                    Políticas de Privacidade e Termos de Serviço
                                </Text>
                                <Text style={loginStyles.privacyModalSubtitle}>
                                    Conforme Lei Geral de Proteção de Dados (LGPD)
                                </Text>
                            </View>

                            {/* Conteúdo do Modal */}
                            <ScrollView
                                style={loginStyles.privacyModalScrollContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    1. Coleta e Uso de Dados Pessoais
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    O Partiu App coleta dados pessoais necessários para o funcionamento do serviço, incluindo: nome, e-mail, telefone, CPF, localização em tempo real e dados de veículos. Estes dados são utilizados exclusivamente para prestação do serviço de transporte e melhorias na plataforma.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    2. Base Legal (LGPD Art. 7º)
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    O tratamento de dados pessoais é realizado com base no consentimento do titular e na execução de contrato do qual o titular seja parte, conforme estabelecido na Lei 13.709/2018 (LGPD).
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    3. Compartilhamento de Dados
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Os dados pessoais não são vendidos ou compartilhados com terceiros para fins comerciais. Compartilhamentos ocorrem apenas quando necessário para prestação do serviço (ex: localização entre motorista e passageiro durante corrida) ou por determinação legal.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    4. Segurança dos Dados
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição não autorizada.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    5. Seus Direitos (LGPD Art. 18)
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos/inexatos; anonimizar, bloquear ou eliminar dados desnecessários; solicitar portabilidade; eliminar dados tratados com consentimento; revogar consentimento; e obter informações sobre compartilhamento.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    6. Retenção de Dados
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Os dados pessoais são mantidos pelo período necessário para cumprimento das finalidades descritas, respeitando prazos legais e regulamentares. Após esse período, os dados são eliminados ou anonimizados.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    7. Cookies e Tecnologias Similares
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    O aplicativo pode utilizar cookies e tecnologias similares para melhorar a experiência do usuário e análise de desempenho.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    8. Alterações na Política
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas através do aplicativo ou e-mail cadastrado.
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    9. Contato - Encarregado de Dados (DPO)
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail: suporte@partiu.digital
                                </Text>

                                <Text style={loginStyles.privacyModalSectionTitle}>
                                    10. Aceite dos Termos
                                </Text>
                                <Text style={loginStyles.privacyModalText}>
                                    Ao utilizar o Partiu App, você declara ter lido, compreendido e concordado com esta Política de Privacidade e Termos de Serviço, bem como consente com o tratamento de seus dados pessoais conforme descrito.
                                </Text>

                                <Text style={loginStyles.privacyModalText}>
                                    <Text style={{ fontWeight: 'bold' }}>Data de vigência:</Text> 01 de Janeiro de 2025{'\n'}
                                    <Text style={{ fontWeight: 'bold' }}>Última atualização:</Text> 01 de Janeiro de 2025
                                </Text>
                            </ScrollView>

                            {/* Footer do Modal */}
                            {/* <View style={loginStyles.privacyModalFooter}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setPrivacyAccepted(true);
                                        setPrivacyModalVisible(false);
                                    }}
                                    style={[loginStyles.privacyModalCloseButtonText, { backgroundColor: '#FC7700', marginBottom: 10 }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[loginStyles.privacyModalCloseButtonTextLabel, { color: '#FFFFFF' }]}>
                                        ✅ Aceitar e Continuar
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setPrivacyModalVisible(false)}
                                    style={loginStyles.privacyModalCloseButtonText}
                                    activeOpacity={0.8}
                                >
                                    <Text style={loginStyles.privacyModalCloseButtonTextLabel}>
                                        Apenas Fechar
                                    </Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                </Modal>
                <View style={loginStyles.bottomBar} />
            </View>

            {/* Modal Personalizado */}
            {modalConfig && (
                <CustomModal
                    visible={isVisible}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    type={modalConfig.type}
                    buttons={modalConfig.buttons}
                    onClose={hideModal}
                />
            )}

            {/* Modal de Loading */}
            <LoadingModal
                visible={isLoading}
                message="Criando sua conta..."
                type="loading"
            />
        </>
    );
}