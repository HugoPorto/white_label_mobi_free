import { ChatRequest } from "../../models/ChatRequest";
import { ChatResponse } from "../../models/ChatResponse";
import { ErrorResponse } from "../../models/ErrorResponse";
import { ChatRepository } from "../../repository/ChatRepository";

export class ChatMessageCreateUseCase {

    private chatRepository: ChatRepository;

    constructor({ chatRepository }: { chatRepository: ChatRepository }) {
        this.chatRepository = chatRepository;
    }

    async execute(chatRequest: ChatRequest): Promise<ChatResponse | ErrorResponse> {
        return await this.chatRepository.create(chatRequest);
    }
}