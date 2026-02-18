import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DocumentsModalProps {
    visible: boolean;
    onClose: () => void;
    styles: any;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
    visible,
    onClose,
    styles
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.documentsModalOverlay}>
                    <View style={styles.documentsModalContainer}>
                        {/* Header Premium */}
                        <View style={styles.documentsModalHeader}>
                            {/* Botão X para fechar */}
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.documentsModalHeaderCloseButton}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close" size={20} color="#FFFFFF" />
                            </TouchableOpacity>

                            {/* Ícone Principal */}
                            <View style={styles.documentsModalHeaderIconContainer}>
                                <Ionicons name="document-text" size={42} color="#FFFFFF" />
                            </View>

                            {/* Título Principal */}
                            <Text style={styles.documentsModalHeaderTitle}>
                                Documentos
                            </Text>

                            {/* Subtitle */}
                            <Text style={styles.documentsModalHeaderSubtitle}>
                                Status de verificação dos seus documentos
                            </Text>
                        </View>

                        {/* Conteúdo Principal */}
                        <View style={styles.documentsModalContent}>
                            {/* Status Geral */}
                            <View style={styles.documentsModalStatusContainer}>
                                <View style={styles.documentsModalStatusIconContainer}>
                                    <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                                </View>
                                <View style={styles.documentsModalStatusContent}>
                                    <Text style={styles.documentsModalStatusTitle}>
                                        Documentação Completa
                                    </Text>
                                    <Text style={styles.documentsModalStatusSubtitle}>
                                        Todos os documentos verificados
                                    </Text>
                                </View>
                            </View>

                            {/* Lista de Documentos */}
                            <View style={styles.documentsModalListContainer}>
                                <Text style={styles.documentsModalListTitle}>
                                    Documentos Verificados
                                </Text>

                                {/* CNH */}
                                <View style={styles.documentsModalDocumentCard}>
                                    <View style={styles.documentsModalDocumentCardRow}>
                                        <View style={styles.documentsModalDocumentCardIcon}>
                                            <Ionicons name="card" size={20} color="#ffffff" />
                                        </View>
                                        <View style={styles.documentsModalDocumentCardContent}>
                                            <Text style={styles.documentsModalDocumentCardTitle}>
                                                CNH (Carteira de Motorista)
                                            </Text>
                                            <Text style={styles.documentsModalDocumentCardSubtitle}>
                                                Verificado • Válido até Dez/2028
                                            </Text>
                                            <View style={styles.documentsModalDocumentCardBadge}>
                                                <Text style={styles.documentsModalDocumentCardBadgeText}>
                                                    ✓ CONCLUÍDO
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Foto de Perfil */}
                                <View style={styles.documentsModalProfileCard}>
                                    <View style={styles.documentsModalProfileCardRow}>
                                        <View style={styles.documentsModalProfileCardIcon}>
                                            <Ionicons name="person" size={20} color="#ffffff" />
                                        </View>
                                        <View style={styles.documentsModalProfileCardContent}>
                                            <Text style={styles.documentsModalProfileCardTitle}>
                                                Foto de Perfil
                                            </Text>
                                            <Text style={styles.documentsModalProfileCardSubtitle}>
                                                Verificado • Qualidade aprovada
                                            </Text>
                                            <View style={styles.documentsModalProfileCardBadge}>
                                                <Text style={styles.documentsModalProfileCardBadgeText}>
                                                    ✓ CONCLUÍDO
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Verificação de Segurança */}
                                <View style={styles.documentsModalSecurityCard}>
                                    <View style={styles.documentsModalProfileCardRow}>
                                        <View style={styles.documentsModalProfileCardIcon}>
                                            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
                                        </View>
                                        <View style={styles.documentsModalProfileCardContent}>
                                            <Text style={styles.documentsModalProfileCardTitle}>
                                                Verificação de Segurança
                                            </Text>
                                            <Text style={styles.documentsModalProfileCardSubtitle}>
                                                Verificado • Background check aprovado
                                            </Text>
                                            <View style={styles.documentsModalProfileCardBadge}>
                                                <Text style={styles.documentsModalProfileCardBadgeText}>
                                                    ✓ CONCLUÍDO
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Informação Adicional */}
                            <View style={styles.documentsModalInfoCard}>
                                <View style={styles.documentsModalInfoCardRow}>
                                    <View style={styles.documentsModalInfoCardIcon}>
                                        <Ionicons name="information" size={16} color="#ffffff" />
                                    </View>
                                    <View style={styles.documentsModalInfoCardContent}>
                                        <Text style={styles.documentsModalInfoCardTitle}>
                                            Status da Documentação
                                        </Text>
                                        <Text style={styles.documentsModalInfoCardText}>
                                            Todos os seus documentos foram verificados e aprovados. Você está habilitado para realizar corridas na plataforma.
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Copyright */}
                            <View style={styles.documentsModalCopyright}>
                                <Text style={styles.documentsModalCopyrightMainText}>
                                    Documentação Verificada • White Label App Mobi Free
                                </Text>
                                <Text style={styles.documentsModalCopyrightSubText}>
                                    Sistema de Verificação Segura
                                </Text>
                            </View>
                        </View>

                        {/* Botão de Fechar Premium */}
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.documentsModalCloseButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.documentsModalCloseButtonText}>
                                Entendido
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};