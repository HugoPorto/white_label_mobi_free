import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirmLogout: () => void;
    styles: any;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
    visible,
    onClose,
    onConfirmLogout,
    styles
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.logoutModalOverlay}>
                <View style={styles.logoutModalContainer}>
                    {/* Header do Modal */}
                    <View style={styles.logoutModalHeader}>
                        <View style={styles.logoutModalIconContainer}>
                            <Ionicons name="log-out" size={36} color="#FF9800" />
                        </View>
                        <Text style={styles.logoutModalTitle}>
                            Sair da Conta?
                        </Text>
                        <Text style={styles.logoutModalDescription}>
                            Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente.
                        </Text>
                    </View>

                    {/* Botões */}
                    <View style={styles.logoutModalButtonsContainer}>
                        {/* Botão Cancelar */}
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.logoutModalCancelButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.logoutModalCancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        {/* Botão Sair */}
                        <TouchableOpacity
                            onPress={onConfirmLogout}
                            style={styles.logoutModalConfirmButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutModalConfirmButtonText}>
                                Sair
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};