import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";

// Interfaces para Messages
export interface Message {
    id: number;
    messageCode: string;
    createdByAdminName: string;
    senderRole: 'admin' | 'system' | 'moderator';
    targetType: 'all_users' | 'specific_user' | 'user_group' | 'role_based';
    title: string;
    message: string;
    shortPreview: string;
    category: 'info' | 'warning' | 'alert' | 'update' | 'maintenance' | 'promotion';
    priority: 'low' | 'medium' | 'high';
    isDismissible: boolean;
    requiresAcknowledgment: boolean;
    expiresAt?: string;
    isActive: boolean;
    actionButton?: {
        text: string;
        link?: string;
        action?: string;
    };
    scheduledFor?: string;
    sendImmediately: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatUntil?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    totalRecipients: number;
    totalViews: number;
    totalReads: number;
    totalAcknowledgments: number;
    attachments?: {
        url: string;
        type?: 'image' | 'pdf' | 'other';
        name?: string;
    }[];
    icon?: string;
    iconColor?: string;
    imageUrl?: string;
    tags?: string[];
}

export interface MessageRead {
    id: number;
    isRead: boolean;
    readAt?: string;
    acknowledgedAt?: string;
    deviceInfo?: any;
    createdAt: string;
}

export interface MessageStats {
    message: Message;
    recipientCount: number;
    viewCount: number;
    readCount: number;
    acknowledgmentCount: number;
    readPercentage: number;
    acknowledgmentPercentage: number;
}

export interface GeneralStats {
    totalMessages: number;
    activeMessages: number;
    scheduledMessages: number;
    expiredMessages: number;
    totalReads: number;
    totalAcknowledgments: number;
    averageReadRate: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
}

export interface CreateMessageRequest {
    createdByAdminId: number;
    createdByAdminName: string;
    senderRole: 'admin' | 'system' | 'moderator';
    targetType: 'all_users' | 'specific_user' | 'user_group' | 'role_based';
    targetUserId?: number;
    targetUserIds?: number[];
    targetRole?: 'driver' | 'passenger' | 'both';
    title: string;
    message: string;
    shortPreview?: string;
    category: 'info' | 'warning' | 'alert' | 'update' | 'maintenance' | 'promotion';
    priority: 'low' | 'medium' | 'high';
    isDismissible?: boolean;
    requiresAcknowledgment?: boolean;
    expiresAt?: string;
    isActive?: boolean;
    actionButton?: {
        text: string;
        link?: string;
        action?: string;
    };
    scheduledFor?: string;
    sendImmediately?: boolean;
    repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
    repeatUntil?: string;
    attachments?: {
        url: string;
        type?: 'image' | 'pdf' | 'other';
        name?: string;
    }[];
    icon?: string;
    iconColor?: string;
    imageUrl?: string;
    tags?: string[];
}

export interface UpdateMessageRequest {
    title?: string;
    message?: string;
    shortPreview?: string;
    category?: 'info' | 'warning' | 'alert' | 'update' | 'maintenance' | 'promotion';
    priority?: 'low' | 'medium' | 'high';
    isDismissible?: boolean;
    requiresAcknowledgment?: boolean;
    expiresAt?: string;
    isActive?: boolean;
    actionButton?: {
        text: string;
        link?: string;
        action?: string;
    };
    scheduledFor?: string;
    attachments?: {
        url: string;
        type?: 'image' | 'pdf' | 'other';
        name?: string;
    }[];
    icon?: string;
    iconColor?: string;
    imageUrl?: string;
}

export interface MarkAsReadRequest {
    userId: number;
    deviceInfo?: {
        platform?: string;
        version?: string;
        model?: string;
    };
}

export interface AcknowledgeRequest {
    userId: number;
}

export class MessagesService {

    /**
     * Busca mensagens ativas para um usuário
     * GET /messages/user/:userId/active
     */
    async getActiveMessagesForUser(
        userId: number,
        filters?: {
            category?: string;
            priority?: string;
            unreadOnly?: boolean;
        }
    ): Promise<Message[] | ErrorResponse> {
        try {
            let url = `/messages/user/${userId}/active`;
            const params = new URLSearchParams();

            if (filters?.category) params.append('category', filters.category);
            if (filters?.priority) params.append('priority', filters.priority);
            if (filters?.unreadOnly) params.append('unreadOnly', 'true');

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log('Buscando mensagens ativas para usuário:', userId, 'Filtros:', filters);
            const response = await ApiRequestHandler.get<Message[]>(url);
            console.log('Response Mensagens Ativas:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca mensagens que requerem confirmação
     * GET /messages/user/:userId/requiring-acknowledgment
     */
    async getMessagesRequiringAcknowledgment(userId: number): Promise<Message[] | ErrorResponse> {
        try {
            console.log('Buscando mensagens que requerem confirmação para usuário:', userId);
            const response = await ApiRequestHandler.get<Message[]>(
                `/messages/user/${userId}/requiring-acknowledgment`
            );
            console.log('Response Mensagens Requerem Confirmação:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca uma mensagem por ID
     * GET /messages/:id
     */
    async getMessageById(messageId: number): Promise<Message | ErrorResponse> {
        try {
            console.log('Buscando mensagem por ID:', messageId);
            const response = await ApiRequestHandler.get<Message>(`/messages/${messageId}`);
            console.log('Response Mensagem por ID:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca mensagem por código
     * GET /messages/code/:messageCode
     */
    async getMessageByCode(messageCode: string): Promise<Message | ErrorResponse> {
        try {
            console.log('Buscando mensagem por código:', messageCode);
            const response = await ApiRequestHandler.get<Message>(`/messages/code/${messageCode}`);
            console.log('Response Mensagem por Código:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Marca uma mensagem como lida
     * POST /messages/:id/read
     */
    async markAsRead(
        messageId: number,
        userId: number,
        deviceInfo?: any
    ): Promise<MessageRead | ErrorResponse> {
        try {
            const request: MarkAsReadRequest = { userId, deviceInfo };
            console.log('Marcando mensagem como lida:', messageId, 'Usuário:', userId);
            
            const response = await ApiRequestHandler.post<MessageRead>(
                `/messages/${messageId}/read`,
                request
            );
            console.log('Response Marcar como Lida:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Confirma/reconhece uma mensagem
     * POST /messages/:id/acknowledge
     */
    async acknowledge(messageId: number, userId: number): Promise<MessageRead | ErrorResponse> {
        try {
            const request: AcknowledgeRequest = { userId };
            console.log('Confirmando leitura da mensagem:', messageId, 'Usuário:', userId);
            
            const response = await ApiRequestHandler.post<MessageRead>(
                `/messages/${messageId}/acknowledge`,
                request
            );
            console.log('Response Confirmar Leitura:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca status de leitura de uma mensagem
     * GET /messages/:id/read-status/:userId
     */
    async getReadStatus(messageId: number, userId: number): Promise<MessageRead | null | ErrorResponse> {
        try {
            console.log('Buscando status de leitura:', messageId, 'Usuário:', userId);
            const response = await ApiRequestHandler.get<MessageRead | null>(
                `/messages/${messageId}/read-status/${userId}`
            );
            console.log('Response Status de Leitura:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Incrementa o contador de visualizações
     * PUT /messages/:id/view
     */
    async incrementViewCount(messageId: number): Promise<void | ErrorResponse> {
        try {
            console.log('Incrementando visualização da mensagem:', messageId);
            await ApiRequestHandler.put<void>(`/messages/${messageId}/view`, {});
            console.log('Visualização incrementada com sucesso');

            return;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca estatísticas de uma mensagem
     * GET /messages/:id/stats
     */
    async getMessageStats(messageId: number): Promise<MessageStats | ErrorResponse> {
        try {
            console.log('Buscando estatísticas da mensagem:', messageId);
            const response = await ApiRequestHandler.get<MessageStats>(`/messages/${messageId}/stats`);
            console.log('Response Estatísticas da Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    // ==================== MÉTODOS ADMINISTRATIVOS ====================

    /**
     * Cria uma nova mensagem (Admin)
     * POST /messages
     */
    async createMessage(messageData: CreateMessageRequest): Promise<Message | ErrorResponse> {
        try {
            console.log('Criando nova mensagem:', messageData);
            const response = await ApiRequestHandler.post<Message>(`/messages`, messageData);
            console.log('Response Criar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Atualiza uma mensagem (Admin)
     * PUT /messages/:id
     */
    async updateMessage(messageId: number, updateData: UpdateMessageRequest): Promise<Message | ErrorResponse> {
        try {
            console.log('Atualizando mensagem:', messageId, updateData);
            const response = await ApiRequestHandler.put<Message>(`/messages/${messageId}`, updateData);
            console.log('Response Atualizar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Ativa uma mensagem (Admin)
     * PUT /messages/:id/activate
     */
    async activateMessage(messageId: number): Promise<Message | ErrorResponse> {
        try {
            console.log('Ativando mensagem:', messageId);
            const response = await ApiRequestHandler.put<Message>(`/messages/${messageId}/activate`, {});
            console.log('Response Ativar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Desativa uma mensagem (Admin)
     * PUT /messages/:id/deactivate
     */
    async deactivateMessage(messageId: number): Promise<Message | ErrorResponse> {
        try {
            console.log('Desativando mensagem:', messageId);
            const response = await ApiRequestHandler.put<Message>(`/messages/${messageId}/deactivate`, {});
            console.log('Response Desativar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Publica uma mensagem agendada (Admin)
     * POST /messages/:id/publish
     */
    async publishMessage(messageId: number): Promise<Message | ErrorResponse> {
        try {
            console.log('Publicando mensagem agendada:', messageId);
            const response = await ApiRequestHandler.post<Message>(`/messages/${messageId}/publish`, {});
            console.log('Response Publicar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Deleta uma mensagem (Admin)
     * DELETE /messages/:id
     */
    async deleteMessage(messageId: number): Promise<void | ErrorResponse> {
        try {
            console.log('Deletando mensagem:', messageId);
            await ApiRequestHandler.delete<void>(`/messages/${messageId}`);
            console.log('Mensagem deletada com sucesso');

            return;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Restaura uma mensagem deletada (Admin)
     * PUT /messages/:id/restore
     */
    async restoreMessage(messageId: number): Promise<Message | ErrorResponse> {
        try {
            console.log('Restaurando mensagem:', messageId);
            const response = await ApiRequestHandler.put<Message>(`/messages/${messageId}/restore`, {});
            console.log('Response Restaurar Mensagem:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Busca estatísticas gerais (Admin)
     * GET /messages/stats/general
     */
    async getGeneralStats(): Promise<GeneralStats | ErrorResponse> {
        try {
            console.log('Buscando estatísticas gerais');
            const response = await ApiRequestHandler.get<GeneralStats>(`/messages/stats/general`);
            console.log('Response Estatísticas Gerais:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Adiciona tags a uma mensagem (Admin)
     * POST /messages/:id/tags
     */
    async addTags(messageId: number, tags: string[]): Promise<Message | ErrorResponse> {
        try {
            console.log('Adicionando tags à mensagem:', messageId, tags);
            const response = await ApiRequestHandler.post<Message>(
                `/messages/${messageId}/tags`,
                { tags }
            );
            console.log('Response Adicionar Tags:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }

    /**
     * Remove tags de uma mensagem (Admin)
     * DELETE /messages/:id/tags
     */
    async removeTags(messageId: number, tags: string[]): Promise<Message | ErrorResponse> {
        try {
            console.log('Removendo tags da mensagem:', messageId, tags);
            const response = await ApiRequestHandler.delete<Message>(
                `/messages/${messageId}/tags`,
                { data: { tags } }
            );
            console.log('Response Remover Tags:', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor:', errorData.message.join(', '));
                } else {
                    console.error('Erro do servidor:', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição:', error.message);
                return defaultErrorResponse;
            }
        }
    }
}
