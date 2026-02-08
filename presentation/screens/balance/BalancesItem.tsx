import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal } from "react-native";
import { VehicleResponse } from "../../../domain/models/VehicleResponse";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import stylesBalancesItem from './StylesBalancesItem';
import { StatusResponse } from '../../../domain/models/StatusResponse';

interface Props {
    statusResponse: StatusResponse;
    onSetPrimary?: (balanceStatusCode: string) => void;
}

export function BalancesItem({ statusResponse, onSetPrimary }: Props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSetPrimary = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmSetPrimary = () => {
        if (onSetPrimary && statusResponse.id) {
            onSetPrimary(statusResponse.code);
        }
        setShowConfirmModal(false);
        setIsModalVisible(false);
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Pendente';
            case 'approved':
                return 'Aprovado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status.toUpperCase();
        }
    };

    const getBalanceColors = (type: string): [string, string] => {
        switch (type.toLowerCase()) {
            case 'approved':
                return ['#00E676', '#00C853']; // Verde vibrante
            case 'cancelled':
                return ['#FF5252', '#D32F2F']; // Vermelho moderno
            default:
                return ['#00E5FF', '#00B8D4']; // Azul ciano
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'approved':
                return 'checkmark-circle';
            case 'cancelled':
                return 'close-circle';
            default:
                return 'time-outline';
        }
    };

    const balanceColors = getBalanceColors(statusResponse.status);

    return (
        <React.Fragment>
            <View style={stylesBalancesItem.container}>
                {/* HEADER PREMIUM COM GRADIENTE */}
                <LinearGradient
                    colors={balanceColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={stylesBalancesItem.headerGradient}>
                    
                    <View style={stylesBalancesItem.headerContent}>
                        <View style={stylesBalancesItem.headerLeft}>
                            {/* ÍCONE COM FUNDO GLASSMORPHISM */}
                            <View style={stylesBalancesItem.iconGlassContainer}>
                                <View style={stylesBalancesItem.iconInnerGlow}>
                                    <Ionicons
                                        name='wallet'
                                        size={28}
                                        color="#FFFFFF"/>
                                </View>
                            </View>
                            
                            {/* INFORMAÇÕES DO STATUS */}
                            <View style={stylesBalancesItem.statusInfo}>
                                <View style={stylesBalancesItem.statusTitleRow}>
                                    <Text style={stylesBalancesItem.headerTitle}>
                                        {getStatusLabel(statusResponse.status)}
                                    </Text>
                                    <View style={stylesBalancesItem.statusIconBadge}>
                                        <Ionicons
                                            name={getStatusIcon(statusResponse.status)}
                                            size={16}
                                            color="#FFFFFF"/>
                                    </View>
                                </View>
                                <View style={stylesBalancesItem.codeContainer}>
                                    <Ionicons name="barcode-outline" size={14} color="rgba(255, 255, 255, 0.9)" />
                                    <Text style={stylesBalancesItem.headerSubtitle}>
                                        {statusResponse.code}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* BOTÃO DE AÇÃO */}
                        {statusResponse.status === 'pending' && (
                            <TouchableOpacity
                                style={stylesBalancesItem.actionButton}
                                onPress={openModal}
                                activeOpacity={0.7}>
                                <View style={stylesBalancesItem.actionButtonInner}>
                                    <Ionicons name="flash" size={18} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {/* DECORATIVE ELEMENTS */}
                    <View style={stylesBalancesItem.decorativeCircle1} />
                    <View style={stylesBalancesItem.decorativeCircle2} />
                </LinearGradient>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}>
                <View style={stylesBalancesItem.modalOverlay}>
                    <View style={stylesBalancesItem.modalContainer}>
                        <Text style={stylesBalancesItem.modalTitle}>Verificação de Saldo</Text>
                        <TouchableOpacity
                            style={stylesBalancesItem.primaryButton}
                            onPress={handleSetPrimary}
                            activeOpacity={0.7}>
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            <Text style={stylesBalancesItem.primaryButtonText}>Verificar Saldo</Text>
                        </TouchableOpacity>
                        <View style={stylesBalancesItem.modalButtons}>
                            <TouchableOpacity
                                style={stylesBalancesItem.cancelButton}
                                onPress={closeModal}
                                activeOpacity={0.7}>
                                <Text style={stylesBalancesItem.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* MODAL DE CONFIRMAÇÃO PARA DEFINIR COMO PRINCIPAL */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmModal}
                onRequestClose={() => setShowConfirmModal(false)}>
                <View style={stylesBalancesItem.confirmModalOverlay}>
                    <View style={stylesBalancesItem.confirmModalContainer}>
                        {/* HEADER DO MODAL */}
                        <View style={stylesBalancesItem.confirmModalHeader}>
                            <View style={stylesBalancesItem.confirmModalIconContainer}>
                                <Ionicons name="checkmark" size={36} color="#FFD700" />
                            </View>
                            <Text style={stylesBalancesItem.confirmModalTitle}>
                                Verificar Saldo?
                            </Text>
                            <Text style={stylesBalancesItem.confirmModalDescription}>
                                O status do saldo será atualizado para assim que a verificação for concluída.
                            </Text>
                        </View>
                        {/* BOTÕES */}
                        <View style={stylesBalancesItem.confirmModalButtonsContainer}>
                            {/* BOTÃO CANCELAR */}
                            <TouchableOpacity
                                onPress={() => setShowConfirmModal(false)}
                                style={stylesBalancesItem.confirmModalCancelButton}
                                activeOpacity={0.7}>
                                <Text style={stylesBalancesItem.confirmModalCancelButtonText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            {/* BOTÃO CONFIRMAR */}
                            <TouchableOpacity
                                onPress={handleConfirmSetPrimary}
                                style={stylesBalancesItem.confirmModalConfirmButton}
                                activeOpacity={0.8}>
                                <Text style={stylesBalancesItem.confirmModalConfirmButtonText}>
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </React.Fragment>
    );
}