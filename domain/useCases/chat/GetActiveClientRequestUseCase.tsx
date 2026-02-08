import { ChatRepository } from "../../repository/ChatRepository";

export class GetActiveClientRequestUseCase {
    
    constructor({ chatRepository }: { chatRepository: ChatRepository }) {
        this.chatRepository = chatRepository;
    }

    private chatRepository: ChatRepository;

    async execute(id_user: number, role: string) {
        return await this.chatRepository.getActiveClientRequest(id_user, role);
    }
}
