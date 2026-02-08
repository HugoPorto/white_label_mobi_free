import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Alert, Image, ActivityIndicator } from "react-native";
import { VehicleResponse } from "../../../domain/models/VehicleResponse";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import stylesVehiclesItem from './StylesVehiclesItem';
import * as ImagePicker from 'expo-image-picker';
import { DocumentsViewModel } from './DocumentsViewModel';
import { DocumentType } from '../../../domain/models/DocumentResponse';
import { useAuth } from '../../hooks/useAuth';

const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'Branco': '#FFFFFF',
        'Preto': '#000000',
        'Prata': '#C0C0C0',
        'Azul': '#1976D2',
        'Vermelho': '#D32F2F',
        'Cinza': '#757575',
        'Amarelo': '#FBC02D',
        'Verde': '#388E3C',
        'Marrom': '#5D4037',
        'Dourado': '#FFB300',
        'Roxo': '#7B1FA2',
        'Rosa': '#E91E63',
    };
    return colorMap[colorName] || '#E0E0E0';
};

interface Props {
    vehicleRequest: VehicleResponse;
    onSetPrimary?: (vehicleId: number) => void;
}

export function VehiclesItem({ vehicleRequest, onSetPrimary }: Props) {
    
    const { authResponse } = useAuth();
    const documentsViewModel = new DocumentsViewModel();
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState<'CNH' | 'CRLV' | null>(null);
    const [documentImage, setDocumentImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSetPrimary = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmSetPrimary = () => {
        if (onSetPrimary && vehicleRequest.id) {
            onSetPrimary(vehicleRequest.id);
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

    const openDocumentsModal = () => {
        setShowDocumentsModal(true);
    };

    const closeDocumentsModal = () => {
        setShowDocumentsModal(false);
        setSelectedDocumentType(null);
        setDocumentImage(null);
    };

    const handleDocumentTypeSelect = (type: 'CNH' | 'CRLV') => {
        setSelectedDocumentType(type);
        showImagePickerOptions();
    };

    const showImagePickerOptions = () => {
        Alert.alert(
            'Selecionar Imagem',
            'Escolha como deseja enviar o documento:',
            [
                {
                    text: 'Câmera',
                    onPress: takePhoto,
                },
                {
                    text: 'Galeria',
                    onPress: pickImage,
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => setSelectedDocumentType(null)
                },
            ]
        );
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir o acesso à galeria.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setDocumentImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir o acesso à câmera.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setDocumentImage(result.assets[0].uri);
        }
    };

    const handleUploadDocument = async () => {
        if (!documentImage || !selectedDocumentType) {
            Alert.alert('Erro', 'Por favor, selecione uma imagem primeiro.');
            return;
        }

        if (!authResponse?.user?.id) {
            Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
            return;
        }

        if (!vehicleRequest.id) {
            Alert.alert('Erro', 'ID do veículo não encontrado.');
            return;
        }

        setIsUploading(true);

        try {
            // Mapear tipo de documento
            const documentType = selectedDocumentType === 'CNH' 
                ? DocumentType.DRIVER_LICENSE 
                : DocumentType.VEHICLE_REGISTRATION;


            console.log('📤 Enviando documento:', {
                tipo: selectedDocumentType,
                veiculoId: vehicleRequest.id,
                usuarioId: authResponse.user.id
            });

            // Fazer upload usando o DocumentsViewModel
            const result = await documentsViewModel.uploadDocument(
                documentImage,
                vehicleRequest.id,
                authResponse.user.id,
                documentType,
                undefined,
                undefined
            );

            // Verificar se houve erro
            if ('statusCode' in result) {
                console.error('❌ Erro no upload:', result);
                Alert.alert(
                    'Erro', 
                    typeof result.message === 'string' ? result.message : (Array.isArray(result.message) ? result.message.join(' ') : 'Não foi possível enviar o documento. Tente novamente.')
                );
                return;
            }

            // Sucesso
            console.log('✅ Documento enviado com sucesso:', result);
            Alert.alert(
                'Sucesso', 
                `${selectedDocumentType} enviado com sucesso! Aguarde a análise da equipe. Ela pode levar até 3 dias úteis.`,
                [
                    {
                        text: 'OK',
                        onPress: closeDocumentsModal
                    }
                ]
            );
        } catch (error) {
            console.error('❌ Exceção ao enviar documento:', error);
            Alert.alert(
                'Erro', 
                'Ocorreu um erro inesperado ao enviar o documento. Tente novamente.'
            );
        } finally {
            setIsUploading(false);
        }
    };

    const getVehicleIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'carro':
            case 'car':
                return 'car';
            case 'moto':
            case 'motorcycle':
                return 'bicycle';
            default:
                return 'car';
        }
    };

    const getVehicleColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'carro':
            case 'car':
                return '#2196F3';
            case 'moto':
            case 'motorcycle':
                return '#FF9800';
            default:
                return '#2196F3';
        }
    };

    const vehicleColor = getVehicleColor(vehicleRequest.typeVehicle);
    
    return (
        <React.Fragment>
            <TouchableOpacity style={[stylesVehiclesItem.container, 
                {
                    backgroundColor: vehicleRequest.isMain ? '#c4efc5ff' : '#FFFFFF'
                }]} activeOpacity={0.95}>
            {/* Header Premium */}
            <View style={[stylesVehiclesItem.headerContainer, 
                { backgroundColor: vehicleColor }]}>
                <View style={stylesVehiclesItem.headerLeft}>
                    <View style={stylesVehiclesItem.vehicleIconContainer}>
                        <Ionicons 
                            name={getVehicleIcon(vehicleRequest.typeVehicle)} 
                            size={24} 
                            color="#FFFFFF" 
                        />
                    </View>
                    <View>
                        <Text style={stylesVehiclesItem.headerTitle}>
                            {vehicleRequest.brand && vehicleRequest.model 
                                ? `${vehicleRequest.brand} ${vehicleRequest.model}`
                                : vehicleRequest.typeVehicle.toUpperCase()
                            }
                        </Text>
                        <Text style={stylesVehiclesItem.headerSubtitle}>
                            {vehicleRequest.brand && vehicleRequest.model 
                                ? `${vehicleRequest.typeVehicle.toUpperCase()} • ${vehicleRequest.year}`
                                : `Veículo ${vehicleRequest.year} • Verificado`
                            }
                        </Text>
                    </View>
                </View>
                <View style={stylesVehiclesItem.headerActions}>
                    <TouchableOpacity
                        style={stylesVehiclesItem.editButton}
                        onPress={openModal}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Conteúdo Principal */}
            <View style={stylesVehiclesItem.contentContainer}>
                {/* Placa com destaque */}
                <View style={stylesVehiclesItem.plateContainer}>
                    <View style={stylesVehiclesItem.plateBox}>
                        <Text style={stylesVehiclesItem.plateText}>
                            {vehicleRequest.licensePlate}
                        </Text>
                    </View>
                    <Text style={stylesVehiclesItem.plateLabel}>Placa do Veículo</Text>
                </View>

                {/* Informações principais do veículo */}
                {(vehicleRequest.brand || vehicleRequest.model || vehicleRequest.color) && (
                    <View style={stylesVehiclesItem.vehicleDetailsContainer}>
                        <Text style={stylesVehiclesItem.vehicleDetailsTitle}>Detalhes do Veículo</Text>
                        <View style={stylesVehiclesItem.vehicleDetailsContent}>
                            {vehicleRequest.brand && (
                                <View style={stylesVehiclesItem.detailRow}>
                                    <Ionicons name="business-outline" size={16} color="#666" />
                                    <Text style={stylesVehiclesItem.detailLabel}>Marca:</Text>
                                    <Text style={stylesVehiclesItem.detailValue}>{vehicleRequest.brand}</Text>
                                </View>
                            )}
                            {vehicleRequest.model && (
                                <View style={stylesVehiclesItem.detailRow}>
                                    <Ionicons name="layers-outline" size={16} color="#666" />
                                    <Text style={stylesVehiclesItem.detailLabel}>Modelo:</Text>
                                    <Text style={stylesVehiclesItem.detailValue}>{vehicleRequest.model}</Text>
                                </View>
                            )}
                            {vehicleRequest.color && (
                                <View style={stylesVehiclesItem.detailRow}>
                                    <Ionicons name="color-palette-outline" size={16} color="#666" />
                                    <Text style={stylesVehiclesItem.detailLabel}>Cor:</Text>
                                    <View style={stylesVehiclesItem.colorValueContainer}>
                                        <View style={[
                                            stylesVehiclesItem.colorPreview, 
                                            { backgroundColor: getColorHex(vehicleRequest.color) }
                                        ]} />
                                        <Text style={stylesVehiclesItem.detailValue}>{vehicleRequest.color}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Informações em grid */}
                <View style={stylesVehiclesItem.infoGrid}>
                    <View style={stylesVehiclesItem.infoCard}>
                        <View style={[stylesVehiclesItem.infoIconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="calendar" size={20} color="#1976D2" />
                        </View>
                        <Text style={stylesVehiclesItem.infoLabel}>Ano</Text>
                        <Text style={stylesVehiclesItem.infoValue}>{vehicleRequest.year}</Text>
                    </View>

                    <View style={stylesVehiclesItem.infoCard}>
                        <View style={[
                            stylesVehiclesItem.infoIconContainer, 
                            { backgroundColor: vehicleRequest.isVerified ? '#E8F5E8' : '#FFEBEE' }
                        ]}>
                            <Ionicons 
                                name="speedometer" 
                                size={20} 
                                color={vehicleRequest.isVerified ? '#388E3C' : '#D32F2F'} 
                            />
                        </View>
                        <Text style={stylesVehiclesItem.infoLabel}>Status</Text>
                        <Text style={[
                            stylesVehiclesItem.infoValue, 
                            { color: vehicleRequest.isVerified ? '#4CAF50' : '#F44336' }
                        ]}>
                            {vehicleRequest.isVerified ? 'Operacional' : 'Não Operacional'}
                        </Text>
                    </View>
                </View>

                {/* Badges de status */}
                <View style={stylesVehiclesItem.badgesContainer}>
                    <TouchableOpacity 
                        style={[
                            stylesVehiclesItem.verificationBadge,
                            { 
                                backgroundColor: vehicleRequest.isVerified ? '#E8F5E8' : '#FFEBEE',
                                borderColor: vehicleRequest.isVerified ? '#4CAF50' : '#F44336'
                            }
                        ]}
                        onPress={() => !vehicleRequest.isVerified && openDocumentsModal()}
                        activeOpacity={vehicleRequest.isVerified ? 1 : 0.7}
                        disabled={vehicleRequest.isVerified === true}
                    >
                        <Ionicons 
                            name={vehicleRequest.isVerified ? "shield-checkmark" : "shield-outline"} 
                            size={16} 
                            color={vehicleRequest.isVerified ? '#4CAF50' : '#F44336'} 
                        />
                        <Text style={[
                            stylesVehiclesItem.verificationText,
                            { color: vehicleRequest.isVerified ? '#2E7D32' : '#C62828' }
                        ]}>
                            {vehicleRequest.isVerified ? 'Documento verificado' : 'Documento não verificado - Toque para enviar'}
                        </Text>
                        {!vehicleRequest.isVerified && (
                            <Ionicons name="chevron-forward" size={16} color="#C62828" />
                        )}
                    </TouchableOpacity>
                    <View style={[
                        stylesVehiclesItem.statusBadge,
                        { 
                            backgroundColor: vehicleRequest.isActive ? '#E8F8E8' : '#FFEBEE',
                            borderColor: vehicleRequest.isActive ? '#27AE60' : '#F44336'
                        }
                    ]}>
                        <Ionicons 
                            name={vehicleRequest.isActive ? "checkmark-circle" : "close-circle"} 
                            size={16} 
                            color={vehicleRequest.isActive ? '#27AE60' : '#F44336'} 
                        />
                        <Text style={[
                            stylesVehiclesItem.statusBadgeText,
                            { color: vehicleRequest.isActive ? '#27AE60' : '#C62828' }
                        ]}>
                            {vehicleRequest.isActive ? 'Ativo' : 'Inativo'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
        >
            <View style={stylesVehiclesItem.modalOverlay}>
                <View style={stylesVehiclesItem.modalContainer}>
                    <Text style={stylesVehiclesItem.modalTitle}>Configurações do Veículo</Text>
                    
                    {/* Mensagem informativa */}
                    <View style={stylesVehiclesItem.infoMessageContainer}>
                        <View style={stylesVehiclesItem.infoIconWrapper}>
                            <Ionicons name="information-circle" size={20} color="#2196F3" />
                        </View>
                        <View style={stylesVehiclesItem.infoTextContainer}>
                            <Text style={stylesVehiclesItem.infoMessageTitle}>Informações importantes</Text>
                            <Text style={stylesVehiclesItem.infoMessageText}>
                                • Os dados do veículo não podem ser editados{'\n'}
                                • O veículo não pode ser deletado{'\n'}
                                • Apenas é possível alterar qual é o veículo principal
                            </Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={stylesVehiclesItem.primaryButton}
                        onPress={handleSetPrimary}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="star" size={20} color="#FFFFFF" />
                        <Text style={stylesVehiclesItem.primaryButtonText}>Tornar Principal</Text>
                    </TouchableOpacity>

                    <View style={stylesVehiclesItem.modalButtons}>
                        <TouchableOpacity
                            style={stylesVehiclesItem.cancelButton}
                            onPress={closeModal}
                            activeOpacity={0.7}
                        >
                            <Text style={stylesVehiclesItem.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal de Confirmação para Definir como Principal */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <View style={stylesVehiclesItem.confirmModalOverlay}>
                <View style={stylesVehiclesItem.confirmModalContainer}>
                    {/* Header do Modal */}
                    <View style={stylesVehiclesItem.confirmModalHeader}>
                        <View style={stylesVehiclesItem.confirmModalIconContainer}>
                            <Ionicons name="star" size={36} color="#FFD700" />
                        </View>
                        <Text style={stylesVehiclesItem.confirmModalTitle}>
                            Definir como Principal?
                        </Text>
                        <Text style={stylesVehiclesItem.confirmModalDescription}>
                            Tem certeza que deseja definir este veículo como principal? Ele será usado como padrão para suas corridas.
                        </Text>
                    </View>

                    {/* Botões */}
                    <View style={stylesVehiclesItem.confirmModalButtonsContainer}>
                        {/* Botão Cancelar */}
                        <TouchableOpacity
                            onPress={() => setShowConfirmModal(false)}
                            style={stylesVehiclesItem.confirmModalCancelButton}
                            activeOpacity={0.7}
                        >
                            <Text style={stylesVehiclesItem.confirmModalCancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        {/* Botão Confirmar */}
                        <TouchableOpacity
                            onPress={handleConfirmSetPrimary}
                            style={stylesVehiclesItem.confirmModalConfirmButton}
                            activeOpacity={0.8}
                        >
                            <Text style={stylesVehiclesItem.confirmModalConfirmButtonText}>
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal de Envio de Documentos */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={showDocumentsModal}
            onRequestClose={closeDocumentsModal}
        >
            <View style={stylesVehiclesItem.modalOverlay}>
                <View style={stylesVehiclesItem.modalContainer}>
                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View style={{
                            backgroundColor: '#FF9800',
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12
                        }}>
                            <MaterialIcons name="upload-file" size={32} color="#FFFFFF" />
                        </View>
                        <Text style={stylesVehiclesItem.modalTitle}>Enviar Documentos</Text>
                        <Text style={{ 
                            fontSize: 14, 
                            color: '#666', 
                            textAlign: 'center',
                            marginTop: 4 
                        }}>
                            Selecione o tipo de documento que deseja enviar
                        </Text>
                    </View>

                    {/* Preview da imagem selecionada */}
                    {documentImage && (
                        <View style={{
                            marginBottom: 20,
                            borderRadius: 12,
                            overflow: 'hidden',
                            borderWidth: 2,
                            borderColor: '#E0E0E0'
                        }}>
                            <Image 
                                source={{ uri: documentImage }} 
                                style={{ 
                                    width: '100%', 
                                    height: 200,
                                    resizeMode: 'cover'
                                }} 
                            />
                            <View style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                borderRadius: 20,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4
                            }}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                                    {selectedDocumentType}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Botões de seleção de documento */}
                    {!documentImage && (
                        <View style={{ gap: 12, marginBottom: 20 }}>
                            {/* Botão CNH */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#E3F2FD',
                                    borderRadius: 12,
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: '#2196F3'
                                }}
                                onPress={() => handleDocumentTypeSelect('CNH')}
                                activeOpacity={0.7}
                            >
                                <View style={{
                                    backgroundColor: '#2196F3',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}>
                                    <MaterialIcons name="credit-card" size={24} color="#FFFFFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ 
                                        fontSize: 16, 
                                        fontWeight: '700', 
                                        color: '#1976D2',
                                        marginBottom: 2
                                    }}>
                                        Enviar CNH
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#666' }}>
                                        Carteira Nacional de Habilitação
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#2196F3" />
                            </TouchableOpacity>

                            {/* Botão CRLV */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#F3E5F5',
                                    borderRadius: 12,
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: '#9C27B0'
                                }}
                                onPress={() => handleDocumentTypeSelect('CRLV')}
                                activeOpacity={0.7}
                            >
                                <View style={{
                                    backgroundColor: '#9C27B0',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}>
                                    <MaterialIcons name="description" size={24} color="#FFFFFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ 
                                        fontSize: 16, 
                                        fontWeight: '700', 
                                        color: '#7B1FA2',
                                        marginBottom: 2
                                    }}>
                                        Enviar CRLV
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#666' }}>
                                        Certificado de Registro do Veículo
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#9C27B0" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Botões de ação quando há imagem */}
                    {documentImage && (
                        <View style={{ gap: 12, marginBottom: 12 }}>
                            {/* Botão Enviar */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#4CAF50',
                                    borderRadius: 12,
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                }}
                                onPress={handleUploadDocument}
                                activeOpacity={0.8}
                                disabled={isUploading === true}
                            >
                                {isUploading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <>
                                        <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                                        <Text style={{ 
                                            color: '#FFFFFF', 
                                            fontSize: 16, 
                                            fontWeight: '700' 
                                        }}>
                                            {isUploading ? 'Enviando...' : 'Enviar Documento'}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Botão Trocar Imagem */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#FF9800',
                                    borderRadius: 12,
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                }}
                                onPress={showImagePickerOptions}
                                activeOpacity={0.8}
                                disabled={isUploading === true}
                            >
                                <Ionicons name="images" size={20} color="#FFFFFF" />
                                <Text style={{ 
                                    color: '#FFFFFF', 
                                    fontSize: 16, 
                                    fontWeight: '700' 
                                }}>
                                    Trocar Imagem
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Botão Cancelar */}
                    <TouchableOpacity
                        style={stylesVehiclesItem.cancelButton}
                        onPress={closeDocumentsModal}
                        activeOpacity={0.7}
                        disabled={isUploading === true}
                    >
                        <Text style={stylesVehiclesItem.cancelButtonText}>
                            {documentImage ? 'Voltar' : 'Cancelar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </React.Fragment>
    );
}