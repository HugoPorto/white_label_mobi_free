import { User } from "./User";
import { VehicleResponse } from "./VehicleResponse";

export enum DocumentType {
    VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION', // CRLV
    DRIVER_LICENSE = 'DRIVER_LICENSE', // CNH
    INSURANCE = 'INSURANCE',
    VEHICLE_PHOTO = 'VEHICLE_PHOTO',
    INSPECTION = 'INSPECTION',
    OTHER = 'OTHER'
}

export enum DocumentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

export interface DocumentResponse {
    id: number;
    vehicle: VehicleResponse;
    user: User;
    documentType: DocumentType;
    status: DocumentStatus;
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    expirationDate?: Date | string;
    notes?: string;
    reviewedAt?: Date | string;
    reviewedBy?: User;
    isActive: boolean;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface CreateDocumentRequest {
    idVehicle: number;
    idUser: number;
    documentType: DocumentType;
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    expirationDate?: string;
    notes?: string;
}

export interface UpdateDocumentStatusRequest {
    status: DocumentStatus;
    reviewedBy: number;
    notes?: string;
}

export interface ApproveDocumentRequest {
    reviewedBy: number;
    notes?: string;
}

export interface RejectDocumentRequest {
    reviewedBy: number;
    reason: string;
}

export interface DocumentStatistics {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
}

export interface DocumentFilters {
    status?: DocumentStatus;
    documentType?: DocumentType;
    onlyActive?: boolean;
}
