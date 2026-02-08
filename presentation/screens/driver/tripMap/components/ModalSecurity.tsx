import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './StylesModalSecurity';

interface ModalSecurityProps {
    visible: boolean;
    securityCode: string;
    isVerifyingCode: boolean;
    onChangeCode: (code: string) => void;
    onCancel: () => void;
    onVerify: () => void;
}

export function ModalSecurity({
    visible,
    securityCode,
    isVerifyingCode,
    onChangeCode,
    onCancel,
    onVerify
}: ModalSecurityProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
                if (!isVerifyingCode) {
                    onCancel();
                }
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Cabeçalho */}
                    <View style={styles.headerContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="lock-closed" size={30} color="#FFF" />
                        </View>
                        <Text style={styles.title}>
                            Código de Segurança
                        </Text>
                        <Text style={styles.subtitle}>
                            Digite o código de 6 dígitos fornecido pelo destinatário para confirmar a entrega
                        </Text>
                    </View>

                    {/* Input do Código */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { borderColor: securityCode.length === 6 ? '#4CAF50' : '#E0E0E0' }]}
                            value={securityCode}
                            onChangeText={(text) => {
                                // Apenas números
                                const numericText = text.replace(/[^0-9]/g, '');
                                // Máximo 6 dígitos
                                if (numericText.length <= 6) {
                                    onChangeCode(numericText);
                                }
                            }}
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholder="000000"
                            placeholderTextColor="#BDBDBD"
                            editable={!isVerifyingCode}
                            autoFocus={true}
                        />
                        <Text style={styles.helperText}>
                            {securityCode.length}/6 dígitos
                        </Text>
                    </View>

                    {/* Botões */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { opacity: isVerifyingCode ? 0.5 : 1 }]}
                            onPress={onCancel}
                            disabled={isVerifyingCode}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.verifyButton, { backgroundColor: securityCode.length === 6 ? '#4CAF50' : '#BDBDBD', opacity: isVerifyingCode ? 0.7 : 1 }]}
                            onPress={onVerify}
                            disabled={securityCode.length !== 6 || isVerifyingCode}
                            activeOpacity={0.7}
                        >
                            {isVerifyingCode ? (
                                <Text style={styles.verifyingText}>
                                    Verificando...
                                </Text>
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.verifyButtonText}>
                                        Verificar
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}