import { ChatService } from "../../../data/sources/remote/services/ChatService";
import { SocketService } from "../../../data/sources/remote/services/SocketService";
import { ChatRequest } from "../../../domain/models/ChatRequest";
import { ChatUseCases } from "../../../domain/useCases/chat/ChatUseCases";

export class ChatViewModel {
    private socketService: SocketService;
    private chatUseCases: ChatUseCases;
    private chatService: ChatService;

    constructor(
        {
            socketService,
            chatUseCases
        }: {
            socketService: SocketService
            chatUseCases: ChatUseCases
        }
    ) {
        this.socketService = socketService;
        this.chatUseCases = chatUseCases;
        this.chatService = new ChatService();
    }

    initSocket() {
        this.initLocationSocket();
    }

    initLocationSocket() {
        this.socketService.initLocationSocket();
    }

    async sendMessage(chatRequest: ChatRequest) {
        try {
            console.log('📤 Enviando mensagem via ViewModel:', chatRequest);
            const chat = await this.chatUseCases.create.execute(chatRequest);
            console.log('✅ Mensagem criada no backend:', chat);

            const event = chatRequest.is_driver ? 'chat_message_driver' : 'chat_message_client';

            this.socketService.sendLocationMessage(event, chat);
            console.log('📡 Mensagem enviada via socket');
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
        }
    }

    async getActiveClientRequest(id_user: number, role: string) {
        console.log('ViewModel: Buscando requisição de chat ativa para o usuário:', id_user);
        return await this.chatUseCases.getActiveClientRequest.execute(id_user, role);
    }

    disconnectSocket() {
        this.socketService.disconnect();
    }

    listenerChatMessageClient(callback: (data: any) => void) {
        this.socketService.onLocationMessage('chat_message_emit_client', (data: any) => {
            callback(data);
        })
    }

    async getMessagesByClientRequest(id_client_request: number) {
        console.log('ViewModel: Buscando mensagens para o client request:', id_client_request);
        return await this.chatService.getMessagesByClientRequest(id_client_request);
    }

    listenerChatMessageDriver(callback: (data: any) => void) {
        this.socketService.onLocationMessage('chat_message_emit_driver', (data: any) => {
            callback(data);
        })
    }
}