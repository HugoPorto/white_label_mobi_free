import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { DocumentResponse, DocumentType, DocumentStatus } from "../../../domain/models/DocumentResponse";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './DocsItemStyles';

interface Props {
    document: DocumentResponse;
    onRefresh?: () => void;
}

export function DocsItem({ document, onRefresh }: Props) {

    const getDocumentTypeLabel = (type: DocumentType): string => {
        const labels: { [key in DocumentType]: string } = {
            [DocumentType.DRIVER_LICENSE]: 'CNH',
            [DocumentType.VEHICLE_REGISTRATION]: 'CRLV',
            [DocumentType.INSURANCE]: 'Seguro',
            [DocumentType.VEHICLE_PHOTO]: 'Foto do Veículo',
            [DocumentType.INSPECTION]: 'Vistoria',
            [DocumentType.OTHER]: 'Outro'
        };
        return labels[type] || type;
    };

    const getStatusInfo = (status: DocumentStatus) => {
        const statusMap = {
            [DocumentStatus.PENDING]: {
                label: 'Pendente',
                color: '#FF9800',
                icon: 'time-outline' as const,
                bgColor: '#FFF3E0'
            },
            [DocumentStatus.APPROVED]: {
                label: 'Aprovado',
                color: '#4CAF50',
                icon: 'checkmark-circle-outline' as const,
                bgColor: '#E8F5E9'
            },
            [DocumentStatus.REJECTED]: {
                label: 'Rejeitado',
                color: '#F44336',
                icon: 'close-circle-outline' as const,
                bgColor: '#FFEBEE'
            },
            [DocumentStatus.EXPIRED]: {
                label: 'Expirado',
                color: '#9E9E9E',
                icon: 'alert-circle-outline' as const,
                bgColor: '#F5F5F5'
            }
        };
        return statusMap[status];
    };

    const statusInfo = getStatusInfo(document.status);
    const documentTypeLabel = getDocumentTypeLabel(document.documentType);

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    };

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: statusInfo.bgColor }]} 
            activeOpacity={0.95}
        >
            {/* Header */}
            <View style={[styles.headerContainer, { backgroundColor: statusInfo.color }]}>
                <View style={styles.headerLeft}>
                    <Ionicons name={statusInfo.icon} size={24} color="#FFF" />
                    <Text style={styles.headerTitle}>{documentTypeLabel}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{statusInfo.label}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {/* Veículo */}
                {document.vehicle && (
                    <View style={styles.infoRow}>
                        <MaterialIcons name="directions-car" size={18} color="#666" />
                        <Text style={styles.infoLabel}>Veículo:</Text>
                        <Text style={styles.infoValue}>
                            {document.vehicle.brand} {document.vehicle.model} - {document.vehicle.licensePlate}
                        </Text>
                    </View>
                )}

                {/* Data de Envio */}
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color="#666" />
                    <Text style={styles.infoLabel}>Enviado em:</Text>
                    <Text style={styles.infoValue}>{formatDate(document.created_at)}</Text>
                </View>

                {/* Data de Validade */}
                {document.expirationDate && (
                    <View style={styles.infoRow}>
                        <Ionicons name="timer-outline" size={18} color="#666" />
                        <Text style={styles.infoLabel}>Validade:</Text>
                        <Text style={styles.infoValue}>{formatDate(document.expirationDate)}</Text>
                    </View>
                )}

                {/* Notas/Observações */}
                {document.notes && (
                    <View style={styles.notesContainer}>
                        <Ionicons name="information-circle-outline" size={18} color="#666" />
                        <Text style={styles.notesText}>{document.notes}</Text>
                    </View>
                )}

                {/* Data de Revisão */}
                {document.reviewedAt && (
                    <View style={styles.infoRow}>
                        <Ionicons name="eye-outline" size={18} color="#666" />
                        <Text style={styles.infoLabel}>Revisado em:</Text>
                        <Text style={styles.infoValue}>{formatDate(document.reviewedAt)}</Text>
                    </View>
                )}
            </View>

            {/* Preview da Imagem */}
            {document.fileUrl && (
                <View style={styles.imagePreviewContainer}>
                    <Image 
                        source={{ uri: document.fileUrl }} 
                        style={styles.imagePreview}
                        resizeMode="cover"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}
