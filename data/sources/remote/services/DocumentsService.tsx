import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { 
    DocumentResponse, 
    CreateDocumentRequest, 
    UpdateDocumentStatusRequest,
    ApproveDocumentRequest,
    RejectDocumentRequest,
    DocumentStatistics,
    DocumentFilters,
    DocumentType,
    DocumentStatus 
} from "../../../../domain/models/DocumentResponse";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import mime from 'mime';

export class DocumentsService {

    // =============================================
    // CREATE - Criar novo documento com upload
    // =============================================
    async create(
        imageUri: string,
        data: CreateDocumentRequest
    ): Promise<DocumentResponse | ErrorResponse> {
        try {
            const formData = new FormData();
            
            // Adicionar imagem
            const filename = imageUri.split('/').pop() || 'document.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            
            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type
            } as any);

            // Adicionar dados do documento
            formData.append('idVehicle', data.idVehicle.toString());
            formData.append('idUser', data.idUser.toString());
            formData.append('documentType', data.documentType);
            formData.append('fileUrl', data.fileUrl);
            
            if (data.fileName) formData.append('fileName', data.fileName);
            if (data.fileSize) formData.append('fileSize', data.fileSize.toString());
            if (data.mimeType) formData.append('mimeType', data.mimeType);
            if (data.expirationDate) formData.append('expirationDate', data.expirationDate);
            if (data.notes) formData.append('notes', data.notes);

            const response = await ApiRequestHandler.post<DocumentResponse>(
                '/documents',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao criar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar documento por ID
    // =============================================
    async findById(id: number): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentResponse>(
                `/documents/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao buscar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar todos os documentos (com filtros)
    // =============================================
    async findAll(filters?: DocumentFilters): Promise<DocumentResponse[] | ErrorResponse> {
        try {
            const params = new URLSearchParams();
            
            if (filters?.status) params.append('status', filters.status);
            if (filters?.documentType) params.append('documentType', filters.documentType);
            if (filters?.onlyActive !== undefined) {
                params.append('onlyActive', filters.onlyActive.toString());
            }

            const queryString = params.toString();
            const url = queryString ? `/documents?${queryString}` : '/documents';
            
            const response = await ApiRequestHandler.get<DocumentResponse[]>(url);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao buscar todos os documentos:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar documentos por veículo
    // =============================================
    async findByVehicle(
        idVehicle: number, 
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentResponse[]>(
                `/documents/vehicle/${idVehicle}?onlyActive=${onlyActive}`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao buscar documentos do veículo:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar documentos por usuário
    // =============================================
    async findByUser(
        idUser: number,
        sessionId: string,
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentResponse[]>(
                `/documents/user/${idUser}?session_id=${sessionId}&onlyActive=${onlyActive}`
            );
            return response.data;
        } catch (error: any) {
            // console.error('❌ Erro ao buscar documentos do usuário:', error);
            
            // Se for erro 401 (sessão inválida), propagar para tratamento específico
            if (error.response?.status === 401) {
                throw error;
            }
            
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar documentos por status
    // =============================================
    async findByStatus(status: DocumentStatus): Promise<DocumentResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentResponse[]>(
                `/documents/status/${status}`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao buscar documentos por status:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // READ - Buscar documentos por tipo
    // =============================================
    async findByType(
        documentType: DocumentType, 
        onlyActive: boolean = true
    ): Promise<DocumentResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentResponse[]>(
                `/documents/type/${documentType}?onlyActive=${onlyActive}`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao buscar documentos por tipo:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Aprovar documento
    // =============================================
    async approve(
        id: number, 
        data: ApproveDocumentRequest
    ): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<DocumentResponse>(
                `/documents/${id}/approve`,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao aprovar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Aprovar todos os documentos de um veículo
    // =============================================
    async approveAllByVehicle(
        idVehicle: number,
        reviewedBy: number,
        notes?: string
    ): Promise<{ approved: DocumentResponse[]; count: number } | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<{ approved: DocumentResponse[]; count: number }>(
                `/documents/vehicle/${idVehicle}/approve-all`,
                { reviewedBy, notes }
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao aprovar todos os documentos:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Rejeitar documento
    // =============================================
    async reject(
        id: number, 
        data: RejectDocumentRequest
    ): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<DocumentResponse>(
                `/documents/${id}/reject`,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao rejeitar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Atualizar status genérico
    // =============================================
    async updateStatus(
        id: number, 
        data: UpdateDocumentStatusRequest
    ): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<DocumentResponse>(
                `/documents/${id}/status`,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao atualizar status do documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Marcar como expirado
    // =============================================
    async markAsExpired(id: number): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<DocumentResponse>(
                `/documents/${id}/expire`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao marcar documento como expirado:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UPDATE - Atualizar notas
    // =============================================
    async updateNotes(
        id: number, 
        notes: string
    ): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<DocumentResponse>(
                `/documents/${id}/notes`,
                { notes }
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao atualizar notas do documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // DELETE - Desativar documento (soft delete)
    // =============================================
    async deactivate(id: number): Promise<DocumentResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.delete<DocumentResponse>(
                `/documents/${id}/deactivate`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao desativar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // DELETE - Remover permanentemente
    // =============================================
    async delete(id: number): Promise<{ success: boolean } | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.delete<{ success: boolean }>(
                `/documents/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao deletar documento:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UTILITY - Verificar documentos expirados
    // =============================================
    async checkExpiredDocuments(): Promise<{
        expired: DocumentResponse[];
        count: number;
    } | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.post<{
                expired: DocumentResponse[];
                count: number;
            }>('/documents/check-expired');
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao verificar documentos expirados:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UTILITY - Verificar se veículo está totalmente documentado
    // =============================================
    async isVehicleFullyDocumented(
        idVehicle: number
    ): Promise<{ isFullyDocumented: boolean } | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<{ isFullyDocumented: boolean }>(
                `/documents/vehicle/${idVehicle}/is-fully-documented`
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao verificar documentação do veículo:', error);
            return defaultErrorResponse;
        }
    }

    // =============================================
    // UTILITY - Obter estatísticas
    // =============================================
    async getStatistics(): Promise<DocumentStatistics | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DocumentStatistics>(
                '/documents/statistics/summary'
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao obter estatísticas:', error);
            return defaultErrorResponse;
        }
    }
}