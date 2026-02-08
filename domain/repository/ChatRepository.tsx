import { ChatRequest } from "../models/ChatRequest";
import { ChatResponse } from "../models/ChatResponse";
import { ErrorResponse } from "../models/ErrorResponse";

export interface ChatRepository {
    create(chatRequest: ChatRequest): Promise<ChatResponse | ErrorResponse>;
    getActiveClientRequest(id_user: number, role: string): Promise<any | ErrorResponse>;
}