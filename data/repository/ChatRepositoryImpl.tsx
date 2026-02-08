import { ChatRequest } from "../../domain/models/ChatRequest";
import { ChatResponse } from "../../domain/models/ChatResponse";
import { DriverPosition } from "../../domain/models/DriverPosition";
import { ErrorResponse } from "../../domain/models/ErrorResponse";
import { ChatRepository } from "../../domain/repository/ChatRepository";
import { ChatService } from "../sources/remote/services/ChatService";
import { DriverPositionService } from "../sources/remote/services/DriverPositionService";

export class ChatRepositoryImpl implements ChatRepository {
    private chatService: ChatService;

    constructor({ chatService }: { chatService: ChatService }) {
        this.chatService = chatService;
    }

    async create(chatRequest: ChatRequest): Promise<ChatResponse | ErrorResponse> {
        return await this.chatService.sendMessage(chatRequest);
    }

    async getActiveClientRequest(id_user: number, role: string): Promise<any | ErrorResponse> {
        return await this.chatService.getActiveClientRequest(id_user, role);
    }
}