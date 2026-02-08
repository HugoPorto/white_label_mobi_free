import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";

// Interfaces para Calls
export interface Call {
    id: number;
    ticketNumber: string;
    userId: number;
    userEmail: string;
    userPhone?: string;
    title: string;
    description: string;
    category: 'technical' | 'payment' | 'account' | 'safety' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
    assignedToUserId?: number;
    assignedToUserName?: string;
    response?: string;
    resolution?: string;
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    rating?: number;
    feedback?: string;
    attachments?: {
        url: string;
        type?: 'image' | 'pdf' | 'document' | 'other';
        name?: string;
        size?: number;
        uploadedAt?: string;
    }[];
    deviceInfo?: {
        platform?: string;
        osVersion?: string;
        deviceModel?: string;
        deviceId?: string;
    };
    appVersion?: string;
    lastViewedByUserAt?: string;
    isDeleted: boolean;
    tags?: string[];
    relatedTicketId?: number;
    escalationLevel: number;
}

export interface CallStats {
    responseTime: number | null;
    resolutionTime: number | null;
    isOpen: boolean;
    isClosed: boolean;
    isWaitingUser: boolean;
}

export interface GeneralCallStats {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    avgResponseTime: number;
    avgResolutionTime: number;
}

export interface CreateCallRequest {
    userId: number;
    userEmail: string;
    userPhone?: string;
    title: string;
    description: string;
    category: 'technical' | 'payment' | 'account' | 'safety' | 'other';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    deviceInfo?: {
        platform?: string;
        osVersion?: string;
        deviceModel?: string;
        deviceId?: string;
    };
    appVersion?: string;
    attachments?: {
        url: string;
        type?: 'image' | 'pdf' | 'document' | 'other';
        name?: string;
        size?: number;
    }[];
}

export interface AssignAgentRequest {
    agentId: number;
    agentName: string;
}

export interface AddResponseRequest {
    response: string;
}

export interface ResolveCallRequest {
    resolution: string;
}

export interface AddRatingRequest {
    rating: number;
    feedback?: string;
}

export interface AddNotesRequest {
    notes: string;
}

export interface AddTagsRequest {
    tags: string[];
}

export interface RelateTicketRequest {
    relatedTicketId: number;
}

export class CallsService {

    // ==================== CRIAR E BUSCAR ====================

    /**
     * Cria um novo chamado
     * POST /calls
     */
    async createCall(callData: CreateCallRequest): Promise<Call | ErrorResponse> {
        try {
            console.log('Criando novo chamado:', callData);
            const response = await ApiRequestHandler.post<Call>(`/calls`, callData);
            console.log('Response Criar Chamado:', response.data);

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
     * Busca chamado por ID
     * GET /calls/:id
     */
    async getCallById(callId: number): Promise<Call | ErrorResponse> {
        try {
            console.log('Buscando chamado por ID:', callId);
            const response = await ApiRequestHandler.get<Call>(`/calls/${callId}`);
            console.log('Response Chamado por ID:', response.data);

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
     * Busca chamado por número do ticket
     * GET /calls/ticket/:ticketNumber
     */
    async getCallByTicketNumber(ticketNumber: string): Promise<Call | ErrorResponse> {
        try {
            console.log('Buscando chamado por ticket:', ticketNumber);
            const response = await ApiRequestHandler.get<Call>(`/calls/ticket/${ticketNumber}`);
            console.log('Response Chamado por Ticket:', response.data);

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
     * Busca chamados de um usuário com filtros
     * GET /calls/user/:userId
     */
    async getCallsByUser(
        userId: number,
        filters?: {
            status?: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
            category?: string;
            priority?: string;
        }
    ): Promise<Call[] | ErrorResponse> {
        try {
            let url = `/calls/user/${userId}`;
            const params = new URLSearchParams();

            if (filters?.status) params.append('status', filters.status);
            if (filters?.category) params.append('category', filters.category);
            if (filters?.priority) params.append('priority', filters.priority);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log('Buscando chamados do usuário:', userId, 'Filtros:', filters);
            const response = await ApiRequestHandler.get<Call[]>(url);
            console.log('Response Chamados do Usuário:', response.data);

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
     * Busca chamados abertos de um usuário
     * GET /calls/user/:userId/open
     */
    async getOpenCallsByUser(userId: number): Promise<Call[] | ErrorResponse> {
        try {
            console.log('Buscando chamados abertos do usuário:', userId);
            const response = await ApiRequestHandler.get<Call[]>(`/calls/user/${userId}/open`);
            console.log('Response Chamados Abertos:', response.data);

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
     * Busca chamados atribuídos a um atendente
     * GET /calls/agent/:agentId
     */
    async getCallsByAgent(agentId: number): Promise<Call[] | ErrorResponse> {
        try {
            console.log('Buscando chamados do atendente:', agentId);
            const response = await ApiRequestHandler.get<Call[]>(`/calls/agent/${agentId}`);
            console.log('Response Chamados do Atendente:', response.data);

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
     * Busca chamados urgentes não atribuídos
     * GET /calls/urgent/unassigned
     */
    async getUrgentUnassignedCalls(): Promise<Call[] | ErrorResponse> {
        try {
            console.log('Buscando chamados urgentes não atribuídos');
            const response = await ApiRequestHandler.get<Call[]>(`/calls/urgent/unassigned`);
            console.log('Response Chamados Urgentes:', response.data);

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
     * Busca chamados por categoria e prioridade
     * GET /calls/filter/category-priority
     */
    async getCallsByCategoryAndPriority(
        category: 'technical' | 'payment' | 'account' | 'safety' | 'other',
        priority: 'low' | 'medium' | 'high' | 'urgent'
    ): Promise<Call[] | ErrorResponse> {
        try {
            console.log('Buscando chamados por categoria e prioridade:', category, priority);
            const response = await ApiRequestHandler.get<Call[]>(
                `/calls/filter/category-priority?category=${category}&priority=${priority}`
            );
            console.log('Response Chamados por Categoria/Prioridade:', response.data);

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
     * Busca chamados que violaram SLA
     * GET /calls/sla/violations
     */
    async getSlaViolations(): Promise<Call[] | ErrorResponse> {
        try {
            console.log('Buscando violações de SLA');
            const response = await ApiRequestHandler.get<Call[]>(`/calls/sla/violations`);
            console.log('Response Violações SLA:', response.data);

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

    // ==================== ATRIBUIR E RESPONDER ====================

    /**
     * Atribui chamado a um atendente
     * PUT /calls/:id/assign
     */
    async assignToAgent(callId: number, assignData: AssignAgentRequest): Promise<Call | ErrorResponse> {
        try {
            console.log('Atribuindo chamado ao atendente:', callId, assignData);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/assign`, assignData);
            console.log('Response Atribuir Chamado:', response.data);

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
     * Adiciona primeira resposta
     * POST /calls/:id/first-response
     */
    async addFirstResponse(callId: number, response: string): Promise<Call | ErrorResponse> {
        try {
            const requestData: AddResponseRequest = { response };
            console.log('Adicionando primeira resposta ao chamado:', callId);
            const responseData = await ApiRequestHandler.post<Call>(
                `/calls/${callId}/first-response`,
                requestData
            );
            console.log('Response Primeira Resposta:', responseData.data);

            return responseData.data;
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
     * Atualiza resposta do chamado
     * PUT /calls/:id/response
     */
    async updateResponse(callId: number, response: string): Promise<Call | ErrorResponse> {
        try {
            const requestData: AddResponseRequest = { response };
            console.log('Atualizando resposta do chamado:', callId);
            const responseData = await ApiRequestHandler.put<Call>(
                `/calls/${callId}/response`,
                requestData
            );
            console.log('Response Atualizar Resposta:', responseData.data);

            return responseData.data;
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
     * Altera status para aguardando usuário
     * PUT /calls/:id/waiting-user
     */
    async setWaitingUser(callId: number): Promise<Call | ErrorResponse> {
        try {
            console.log('Alterando status para aguardando usuário:', callId);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/waiting-user`, {});
            console.log('Response Aguardando Usuário:', response.data);

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

    // ==================== RESOLVER E FECHAR ====================

    /**
     * Resolve chamado
     * PUT /calls/:id/resolve
     */
    async resolveCall(callId: number, resolution: string): Promise<Call | ErrorResponse> {
        try {
            const requestData: ResolveCallRequest = { resolution };
            console.log('Resolvendo chamado:', callId, resolution);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/resolve`, requestData);
            console.log('Response Resolver Chamado:', response.data);

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
     * Fecha chamado
     * PUT /calls/:id/close
     */
    async closeCall(callId: number): Promise<Call | ErrorResponse> {
        try {
            console.log('Fechando chamado:', callId);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/close`, {});
            console.log('Response Fechar Chamado:', response.data);

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
     * Adiciona avaliação do usuário
     * POST /calls/:id/rating
     */
    async addRating(callId: number, rating: number, feedback?: string): Promise<Call | ErrorResponse> {
        try {
            const requestData: AddRatingRequest = { rating, feedback };
            console.log('Adicionando avaliação ao chamado:', callId, requestData);
            const response = await ApiRequestHandler.post<Call>(`/calls/${callId}/rating`, requestData);
            console.log('Response Adicionar Avaliação:', response.data);

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

    // ==================== NOTAS E TAGS ====================

    /**
     * Adiciona notas internas
     * POST /calls/:id/notes
     */
    async addInternalNotes(callId: number, notes: string): Promise<Call | ErrorResponse> {
        try {
            const requestData: AddNotesRequest = { notes };
            console.log('Adicionando notas internas ao chamado:', callId);
            const response = await ApiRequestHandler.post<Call>(`/calls/${callId}/notes`, requestData);
            console.log('Response Adicionar Notas:', response.data);

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
     * Adiciona tags ao chamado
     * POST /calls/:id/tags
     */
    async addTags(callId: number, tags: string[]): Promise<Call | ErrorResponse> {
        try {
            const requestData: AddTagsRequest = { tags };
            console.log('Adicionando tags ao chamado:', callId, tags);
            const response = await ApiRequestHandler.post<Call>(`/calls/${callId}/tags`, requestData);
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

    // ==================== RELACIONAMENTOS ====================

    /**
     * Relaciona com outro chamado
     * PUT /calls/:id/relate
     */
    async relateToTicket(callId: number, relatedTicketId: number): Promise<Call | ErrorResponse> {
        try {
            const requestData: RelateTicketRequest = { relatedTicketId };
            console.log('Relacionando chamados:', callId, 'com', relatedTicketId);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/relate`, requestData);
            console.log('Response Relacionar Chamados:', response.data);

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
     * Escala chamado
     * PUT /calls/:id/escalate
     */
    async escalateCall(callId: number): Promise<Call | ErrorResponse> {
        try {
            console.log('Escalando chamado:', callId);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/escalate`, {});
            console.log('Response Escalar Chamado:', response.data);

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

    // ==================== CONTROLE ====================

    /**
     * Atualiza última visualização do usuário
     * PUT /calls/:id/view
     */
    async updateLastViewed(callId: number): Promise<void | ErrorResponse> {
        try {
            console.log('Atualizando última visualização do chamado:', callId);
            await ApiRequestHandler.put<void>(`/calls/${callId}/view`, {});
            console.log('Última visualização atualizada');

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
     * Soft delete do chamado
     * DELETE /calls/:id
     */
    async deleteCall(callId: number): Promise<void | ErrorResponse> {
        try {
            console.log('Deletando chamado:', callId);
            await ApiRequestHandler.delete<void>(`/calls/${callId}`);
            console.log('Chamado deletado com sucesso');

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
     * Restaura chamado deletado
     * PUT /calls/:id/restore
     */
    async restoreCall(callId: number): Promise<Call | ErrorResponse> {
        try {
            console.log('Restaurando chamado:', callId);
            const response = await ApiRequestHandler.put<Call>(`/calls/${callId}/restore`, {});
            console.log('Response Restaurar Chamado:', response.data);

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

    // ==================== ESTATÍSTICAS ====================

    /**
     * Obtém estatísticas de um chamado
     * GET /calls/:id/stats
     */
    async getCallStats(callId: number): Promise<CallStats | ErrorResponse> {
        try {
            console.log('Buscando estatísticas do chamado:', callId);
            const response = await ApiRequestHandler.get<CallStats>(`/calls/${callId}/stats`);
            console.log('Response Estatísticas do Chamado:', response.data);

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
     * Obtém estatísticas gerais
     * GET /calls/stats/general
     */
    async getGeneralStats(): Promise<GeneralCallStats | ErrorResponse> {
        try {
            console.log('Buscando estatísticas gerais');
            const response = await ApiRequestHandler.get<GeneralCallStats>(`/calls/stats/general`);
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
}
