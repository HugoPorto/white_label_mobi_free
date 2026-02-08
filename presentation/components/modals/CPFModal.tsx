import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CPFModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (cpf: string) => Promise<void>;
    styles: any; // Aceita os estilos do componente pai
}

export default function CPFModal({ visible, onClose, onSubmit, styles }: CPFModalProps) {
    const [cpf, setCpf] = useState('');
    const [cpfError, setCpfError] = useState('');
    const [showInput, setShowInput] = useState(false);

    // Função para validar CPF
    const validateCPF = (cpf: string): boolean => {
        // Remove pontos, traços e espaços
        const cleanCPF = cpf.replace(/[^\d]/g, '');

        // Verifica se tem 11 dígitos
        if (cleanCPF.length !== 11) return false;

        // Verifica se todos os dígitos são iguais (CPF inválido)
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

        return true;
    };

    // Função para formatar CPF (000.000.000-00)
    const formatCPF = (value: string): string => {
        const cleanValue = value.replace(/[^\d]/g, '');

        if (cleanValue.length <= 11) {
            return cleanValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        return cleanValue.slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    // Função para lidar com mudança no CPF
    const handleCPFChange = (text: string) => {
        const formattedCPF = formatCPF(text);
        setCpf(formattedCPF);

        // Validar CPF em tempo real apenas se tiver 14 caracteres (CPF completo formatado)
        if (formattedCPF.length === 14) {
            if (validateCPF(formattedCPF)) {
                setCpfError('');
            } else {
                setCpfError('CPF inválido');
            }
        } else if (formattedCPF.length > 0) {
            setCpfError('');
        }
    };

    const handleSubmit = async () => {
        // Validar CPF antes de enviar
        if (!cpf || cpf.trim() === '') {
            Alert.alert('Erro', 'Por favor, digite seu CPF.');
            return;
        }

        if (!validateCPF(cpf)) {
            Alert.alert('Erro', 'CPF inválido. Por favor, verifique os números digitados.');
            return;
        }

        try {
            // Remove formatação do CPF antes de enviar
            const cleanCPF = cpf.replace(/[^\d]/g, '');
            await onSubmit(cleanCPF);

            // Limpa os campos após sucesso
            setCpf('');
            setCpfError('');
            setShowInput(false);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar seus dados. Tente novamente mais tarde.');
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { }}
        >
            <View style={styles.modal_cpf_view_1}>
                <View style={styles.modal_cpf_view_2}>
                    <Ionicons name="alert-circle" size={50} color="#e53935" style={styles.cpfModalIcon} />
                    <Text style={styles.cpfModalTitle}>
                        CPF Necessário
                    </Text>
                    <Text style={styles.cpfModalDescription}>
                        Para continuar, é necessário cadastrar o seu CPF.
                    </Text>

                    {showInput ? (
                        <>
                            <TextInput
                                style={[
                                    styles.cpfModalInput,
                                    cpfError ? { borderColor: '#e53935', borderWidth: 1 } : {}
                                ]}
                                placeholder="Digite seu CPF (000.000.000-00)"
                                keyboardType="numeric"
                                value={cpf}
                                onChangeText={handleCPFChange}
                                maxLength={14} // CPF formatado tem 14 caracteres
                            />
                            {cpfError ? (
                                <Text style={{
                                    color: '#e53935',
                                    fontSize: 12,
                                    marginTop: 5,
                                    textAlign: 'center'
                                }}>
                                    {cpfError}
                                </Text>
                            ) : null}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={[
                                    styles.cpfModalButton,
                                    (cpfError || !cpf || cpf.length < 14) ? { opacity: 0.5 } : {}
                                ]}
                                disabled={!!(cpfError || !cpf || cpf.length < 14)}
                            >
                                <Text style={styles.cpfModalButtonText}>
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setShowInput(true)}
                            style={styles.cpfModalButton}
                        >
                            <Text style={styles.cpfModalButtonText}>
                                Entendido
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}