import { ChatMessageCreateUseCase } from "./ChatMessageCreateUseCase";
import { GetActiveClientRequestUseCase } from "./GetActiveClientRequestUseCase";

export class ChatUseCases {

    create: ChatMessageCreateUseCase;
    getActiveClientRequest: GetActiveClientRequestUseCase;

    constructor(
        {
            createChatMessageUseCase,
            getActiveClientRequestUseCase
        }: 
        {
            createChatMessageUseCase: ChatMessageCreateUseCase,
            getActiveClientRequestUseCase: GetActiveClientRequestUseCase
        }
    ) {
        this.create = createChatMessageUseCase;
        this.getActiveClientRequest = getActiveClientRequestUseCase;
    }
}