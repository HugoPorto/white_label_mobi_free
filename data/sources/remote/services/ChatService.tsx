import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { ChatRequest } from "../../../../domain/models/ChatRequest";
import { ChatResponse } from "../../../../domain/models/ChatResponse";

export class ChatService {
    async sendMessage(chatRequest: ChatRequest): Promise<ChatResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.post<ChatResponse>(`/chat`, chatRequest);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getActiveClientRequest(id_user: number, role: string): Promise<any | ErrorResponse> {
        console.log('Buscando requisição de chat ativa para o usuário:', id_user);
        try {
            const response = await ApiRequestHandler.get<any>(`/chat/client_request/${id_user}/${role}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getMessagesByClientRequest(id_client_request: number): Promise<any | ErrorResponse> {
        console.log('Buscando mensagens para o client request:', id_client_request);
        try {
            const response = await ApiRequestHandler.get<any>(`/chat/messages/${id_client_request}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }
}