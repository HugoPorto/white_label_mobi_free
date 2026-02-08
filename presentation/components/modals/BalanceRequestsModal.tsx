import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BalanceRequestsModalProps {
    visible: boolean;
    onClose: () => void;
    styles: any;
}

export const BalanceRequestsModal: React.FC<BalanceRequestsModalProps> = ({
    visible,
    onClose,
    styles
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.balanceRequestsModalOverlay}>
                <View style={styles.balanceRequestsModalContent}>
                    {/* Header do Modal de Solicitações de Saldo */}
                    <View style={styles.balanceRequestsModalHeader}>
                        <View style={styles.balanceRequestsModalHeaderContent}>
                            <View style={styles.balanceRequestsModalHeaderIcon}>
                                <Ionicons name="wallet" size={20} color="#fff" />
                            </View>
                            <View style={styles.balanceRequestsModalHeaderTextContainer}>
                                <Text style={styles.balanceRequestsModalHeaderTitle}>
                                    Solicitações de Saldo
                                </Text>
                                <Text style={styles.balanceRequestsModalHeaderSubtitle}>
                                    Pedidos de adição de saldo
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.balanceRequestsModalCloseButton}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Solicitações */}
                    <View style={styles.balanceRequestsModalList}>
                        {/* Botão para nova solicitação */}
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert('Nova Solicitação', 'Funcionalidade em desenvolvimento');
                            }}
                            style={styles.balanceRequestsModalNewRequestButton}
                        >
                            <Ionicons name="add-circle" size={24} color="#fff" style={styles.balanceRequestsModalNewRequestIcon} />
                            <Text style={styles.balanceRequestsModalNewRequestText}>
                                Nova Solicitação de Saldo
                            </Text>
                        </TouchableOpacity>

                        {/* Lista de solicitações (exemplo) */}
                        <View style={styles.balanceRequestsModalListContainer}>
                            <Text style={styles.balanceRequestsModalListTitle}>
                                Solicitações Recentes
                            </Text>

                            {/* Exemplo de solicitação pendente */}
                            <View style={styles.balanceRequestsModalRequestCardPending}>
                                <View style={styles.balanceRequestsModalRequestIconPending}>
                                    <Ionicons name="time" size={20} color="#fff" />
                                </View>
                                <View style={styles.balanceRequestsModalRequestContent}>
                                    <Text style={styles.balanceRequestsModalRequestAmount}>
                                        R$ 50,00
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestDate}>
                                        Solicitado em 15/08/2025
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestStatusPending}>
                                        PENDENTE
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.balanceRequestsModalRequestActionButton}
                                    onPress={() => Alert.alert('Detalhes', 'Visualizar detalhes da solicitação')}
                                >
                                    <Ionicons name="eye" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Exemplo de solicitação aprovada */}
                            <View style={styles.balanceRequestsModalRequestCardApproved}>
                                <View style={styles.balanceRequestsModalRequestIconApproved}>
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </View>
                                <View style={styles.balanceRequestsModalRequestContent}>
                                    <Text style={styles.balanceRequestsModalRequestAmount}>
                                        R$ 100,00
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestDate}>
                                        Aprovado em 12/08/2025
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestStatusApproved}>
                                        APROVADO
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.balanceRequestsModalRequestActionButton}
                                    onPress={() => Alert.alert('Detalhes', 'Visualizar detalhes da solicitação')}
                                >
                                    <Ionicons name="eye" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Exemplo de solicitação rejeitada */}
                            <View style={styles.balanceRequestsModalRequestCardRejected}>
                                <View style={styles.balanceRequestsModalRequestIconRejected}>
                                    <Ionicons name="close" size={20} color="#fff" />
                                </View>
                                <View style={styles.balanceRequestsModalRequestContent}>
                                    <Text style={styles.balanceRequestsModalRequestAmount}>
                                        R$ 25,00
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestDate}>
                                        Rejeitado em 10/08/2025
                                    </Text>
                                    <Text style={styles.balanceRequestsModalRequestStatusRejected}>
                                        REJEITADO
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.balanceRequestsModalRequestActionButton}
                                    onPress={() => Alert.alert('Motivo', 'Documentação insuficiente')}
                                >
                                    <Ionicons name="information-circle" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Espaçador */}
                        <View style={styles.balanceRequestsModalSpacer} />

                        {/* Mensagem informativa */}
                        <View style={styles.balanceRequestsModalInfoCard}>
                            <Ionicons name="information-circle" size={20} color="#2196F3" style={styles.balanceRequestsModalInfoIcon} />
                            <Text style={styles.balanceRequestsModalInfoText}>
                                Sistema de solicitações em desenvolvimento{'\n'}
                                Em breve você poderá solicitar adição de saldo
                            </Text>
                        </View>
                    </View>

                    {/* Footer com ações */}
                    <View style={styles.balanceRequestsModalFooter}>
                        <TouchableOpacity
                            style={styles.balanceRequestsModalFooterButtonHistory}
                            disabled={true}
                        >
                            <Text style={styles.balanceRequestsModalFooterButtonText}>
                                Histórico
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.balanceRequestsModalFooterButtonLimits}
                            disabled={true}
                        >
                            <Text style={styles.balanceRequestsModalFooterButtonText}>
                                Limites
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};