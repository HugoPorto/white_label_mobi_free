import { ErrorResponse } from "../../../domain/models/ErrorResponse";
import {
    DocumentResponse,
    CreateDocumentRequest,
    DocumentType,
    DocumentStatus,
    DocumentStatistics,
    DocumentFilters,
    ApproveDocumentRequest,
    RejectDocumentRequest,
    UpdateDocumentStatusRequest
} from "../../../domain/models/DocumentResponse";
import { DocumentsService } from "../../../data/sources/remote/services/DocumentsService";

export class DocumentsViewModel {

    private documentsService: DocumentsService;

    constructor() {
        this.documentsService = new DocumentsService();
    }

    // =============================================
    // CREATE - Enviar documento com imagem
    // =============================================
    async uploadDocument(
        imageUri: string,
        idVehicle: number,
        idUser: number,
        documentType: DocumentType,
        expirationDate?: string,
        notes?: string
    ): Promise<DocumentResponse | ErrorResponse> {
        const documentData: CreateDocumentRequest = {
            idVehicle,
            idUser,
            documentType,
            fileUrl: '', // Será preenchido pelo backend após upload
            fileName: imageUri.split('/').pop(),
            expirationDate,
            notes
        };

        return await this.documentsService.create(imageUri, documentData);
    }

    // =============================================
    // READ - Buscar documentos do veículo
    // =============================================
    async getVehicleDocuments(
        idVehicle: number,
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByVehicle(idVehicle, onlyActive);
    }

    // =============================================
    // READ - Buscar documentos do usuário
    // =============================================
    async getUserDocuments(
        idUser: number,
        session_id: string,
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByUser(idUser, session_id, onlyActive);
    }

    // =============================================
    // READ - Buscar documento específico por ID
    // =============================================
    async getDocumentById(id: number): Promise<DocumentResponse | ErrorResponse> {
        return await this.documentsService.findById(id);
    }

    // =============================================
    // READ - Buscar documentos pendentes
    // =============================================
    async getPendingDocuments(): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByStatus(DocumentStatus.PENDING);
    }

    // =============================================
    // READ - Buscar documentos aprovados
    // =============================================
    async getApprovedDocuments(): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByStatus(DocumentStatus.APPROVED);
    }

    // =============================================
    // READ - Buscar documentos rejeitados
    // =============================================
    async getRejectedDocuments(): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByStatus(DocumentStatus.REJECTED);
    }

    // =============================================
    // READ - Buscar documentos expirados
    // =============================================
    async getExpiredDocuments(): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByStatus(DocumentStatus.EXPIRED);
    }

    // =============================================
    // READ - Buscar documentos por tipo
    // =============================================
    async getDocumentsByType(
        documentType: DocumentType,
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findByType(documentType, onlyActive);
    }

    // =============================================
    // READ - Buscar todos com filtros
    // =============================================
    async getAllDocuments(filters?: DocumentFilters): Promise<DocumentResponse[] | ErrorResponse> {
        return await this.documentsService.findAll(filters);
    }

    // =============================================
    // UPDATE - Aprovar documento (ADMIN)
    // =============================================
    async approveDocument(
        id: number,
        reviewedBy: number,
        notes?: string
    ): Promise<DocumentResponse | ErrorResponse> {
        const data: ApproveDocumentRequest = { reviewedBy, notes };
        return await this.documentsService.approve(id, data);
    }

    // =============================================
    // UPDATE - Rejeitar documento (ADMIN)
    // =============================================
    async rejectDocument(
        id: number,
        reviewedBy: number,
        reason: string
    ): Promise<DocumentResponse | ErrorResponse> {
        const data: RejectDocumentRequest = { reviewedBy, reason };
        return await this.documentsService.reject(id, data);
    }

    // =============================================
    // UPDATE - Atualizar status
    // =============================================
    async updateDocumentStatus(
        id: number,
        status: DocumentStatus,
        reviewedBy: number,
        notes?: string
    ): Promise<DocumentResponse | ErrorResponse> {
        const data: UpdateDocumentStatusRequest = { status, reviewedBy, notes };
        return await this.documentsService.updateStatus(id, data);
    }

    // =============================================
    // UPDATE - Marcar como expirado
    // =============================================
    async markDocumentAsExpired(id: number): Promise<DocumentResponse | ErrorResponse> {
        return await this.documentsService.markAsExpired(id);
    }

    // =============================================
    // UPDATE - Atualizar notas
    // =============================================
    async updateDocumentNotes(id: number, notes: string): Promise<DocumentResponse | ErrorResponse> {
        return await this.documentsService.updateNotes(id, notes);
    }

    // =============================================
    // DELETE - Desativar documento
    // =============================================
    async deactivateDocument(id: number): Promise<DocumentResponse | ErrorResponse> {
        return await this.documentsService.deactivate(id);
    }

    // =============================================
    // DELETE - Deletar permanentemente (ADMIN)
    // =============================================
    async deleteDocument(id: number): Promise<{ success: boolean } | ErrorResponse> {
        return await this.documentsService.delete(id);
    }

    // =============================================
    // UTILITY - Verificar se veículo está documentado
    // =============================================
    async isVehicleFullyDocumented(
        idVehicle: number
    ): Promise<{ isFullyDocumented: boolean } | ErrorResponse> {
        return await this.documentsService.isVehicleFullyDocumented(idVehicle);
    }

    // =============================================
    // UTILITY - Verificar documentos expirados
    // =============================================
    async checkExpiredDocuments(): Promise<{
        expired: DocumentResponse[];
        count: number;
    } | ErrorResponse> {
        return await this.documentsService.checkExpiredDocuments();
    }

    // =============================================
    // UTILITY - Obter estatísticas
    // =============================================
    async getStatistics(): Promise<DocumentStatistics | ErrorResponse> {
        return await this.documentsService.getStatistics();
    }

    // =============================================
    // HELPER - Verificar se tem CNH aprovada
    // =============================================
    async hasApprovedDriverLicense(idUser: number, session_id: string): Promise<boolean> {
        const documents = await this.getUserDocuments(idUser, session_id);

        if ('statusCode' in documents) {
            return false; // Erro ao buscar
        }

        return documents.some(
            doc => doc.documentType === DocumentType.DRIVER_LICENSE &&
                doc.status === DocumentStatus.APPROVED &&
                doc.isActive
        );
    }

    // =============================================
    // HELPER - Verificar se tem CRLV aprovado
    // =============================================
    async hasApprovedVehicleRegistration(idVehicle: number): Promise<boolean> {
        const documents = await this.getVehicleDocuments(idVehicle);

        if ('statusCode' in documents) {
            return false; // Erro ao buscar
        }

        return documents.some(
            doc => doc.documentType === DocumentType.VEHICLE_REGISTRATION &&
                doc.status === DocumentStatus.APPROVED &&
                doc.isActive
        );
    }

    // =============================================
    // HELPER - Obter status de documentação do veículo
    // =============================================
    async getVehicleDocumentationStatus(idVehicle: number): Promise<{
        hasCNH: boolean;
        hasCRLV: boolean;
        hasPhoto: boolean;
        isFullyDocumented: boolean;
        pendingCount: number;
        approvedCount: number;
        rejectedCount: number;
    } | ErrorResponse> {
        const documents = await this.getVehicleDocuments(idVehicle);

        if ('statusCode' in documents) {
            return documents; // Retorna erro
        }

        const hasCNH = documents.some(
            doc => doc.documentType === DocumentType.DRIVER_LICENSE &&
                doc.status === DocumentStatus.APPROVED &&
                doc.isActive
        );

        const hasCRLV = documents.some(
            doc => doc.documentType === DocumentType.VEHICLE_REGISTRATION &&
                doc.status === DocumentStatus.APPROVED &&
                doc.isActive
        );

        const hasPhoto = documents.some(
            doc => doc.documentType === DocumentType.VEHICLE_PHOTO &&
                doc.status === DocumentStatus.APPROVED &&
                doc.isActive
        );

        const pendingCount = documents.filter(
            doc => doc.status === DocumentStatus.PENDING && doc.isActive
        ).length;

        const approvedCount = documents.filter(
            doc => doc.status === DocumentStatus.APPROVED && doc.isActive
        ).length;

        const rejectedCount = documents.filter(
            doc => doc.status === DocumentStatus.REJECTED && doc.isActive
        ).length;

        const isFullyDocumented = hasCNH && hasCRLV && hasPhoto;

        return {
            hasCNH,
            hasCRLV,
            hasPhoto,
            isFullyDocumented,
            pendingCount,
            approvedCount,
            rejectedCount
        };
    }

    // =============================================
    // HELPER - Obter documentos faltantes
    // =============================================
    async getMissingDocuments(idVehicle: number): Promise<DocumentType[] | ErrorResponse> {
        const status = await this.getVehicleDocumentationStatus(idVehicle);

        if ('statusCode' in status) {
            return status; // Retorna erro
        }

        const missing: DocumentType[] = [];

        if (!status.hasCNH) {
            missing.push(DocumentType.DRIVER_LICENSE);
        }

        if (!status.hasCRLV) {
            missing.push(DocumentType.VEHICLE_REGISTRATION);
        }

        if (!status.hasPhoto) {
            missing.push(DocumentType.VEHICLE_PHOTO);
        }

        return missing;
    }
}