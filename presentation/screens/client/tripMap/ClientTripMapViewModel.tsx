import { LatLng } from "react-native-maps";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { ChatRequest } from "../../../../domain/models/ChatRequest";
import { ChatUseCases } from "../../../../domain/useCases/chat/ChatUseCases";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { AuthService } from "../../../../data/sources/remote/services/AuthService";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";
import { AuthResponse } from "../../../../domain/models/AuthResponse";

export class ClientTripMapViewModel {

    private clientRequestUseCases: ClientRequestUseCases;
    private socketService: SocketService;
    private googlePlacesUseCases: GooglePlacesUseCases;
    private chatUseCases: ChatUseCases;
    private clientRequestService: ClientRequestService;
    private authService: AuthService;

    constructor(
        {
            clientRequestUseCases,
            socketService,
            googlePlacesUseCases,
            chatUseCases
        }:
            {
                clientRequestUseCases: ClientRequestUseCases,
                socketService: SocketService,
                googlePlacesUseCases: GooglePlacesUseCases,
                chatUseCases: ChatUseCases
            }
    ) {
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.chatUseCases = chatUseCases;
        this.clientRequestService = new ClientRequestService();
        this.authService = new AuthService();
    }

    initSocket() {
        this.initLocationSocket();
    }

    initLocationSocket() {
        this.socketService.initLocationSocket();
    }

    async getClientRequestById(idClientRequest: number) {
        return await this.clientRequestUseCases.getClientRequestById.execute(idClientRequest);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    listenerDriversPositionSocket(idClient: number, callback: (data: any) => void) {
        this.socketService.onLocationMessage(`trip_new_driver_position/${idClient}`, (data: any) => {
            callback(data);
        })
    }

    listenerUpdateStatusSocket(idClientRequest: number, callback: (data: any) => void) {
        this.socketService.onLocationMessage(`new_status_trip/${idClientRequest}`, (data: any) => {
            callback(data);
        })
    }

    listenerChatMessageDriver(callback: (data: any) => void) {
        this.socketService.onLocationMessage('chat_message_emit_driver', (data: any) => {
            callback(data);
        })
    }

    async sendMessage(chatRequest: ChatRequest) {
        try {
            const chat = await this.chatUseCases.create.execute(chatRequest);
            console.log('✅ Mensagem criada no backend:', chat);
            this.socketService.sendLocationMessage('chat_message_client', chat);
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

    async updateStatus(idClientRequest: number, status: Status) {
        console.log('Atualizando status para:', Status[status]);
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }

    emitUpdateStatus(idClientRequest: number, status: Status) {
        this.socketService.sendLocationMessage('update_status_trip', {
            'id_client_request': idClientRequest,
            'status': status,
        });
    }

    async checkIfFinishedOrCancelled(id: number): Promise<{ id: number } | null | ErrorResponse> {
        return await this.clientRequestService.checkIfFinishedOrCancelled(id);
    }

    // ====================================================
    // ======== Renova token do socket via refresh ========
    // ====================================================
    async refreshSocketToken(): Promise<boolean> {
        try {
            const localStorage = new LocalStorage();
            const authData = await localStorage.getItem('auth'); // Buscar refresh token do storage

            if (!authData) {
                console.log('================================================');
                console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
                console.log('❌ Nenhum dado de autenticação encontrado no storage');
                console.error('❌ Nenhum dado de autenticação encontrado no storage');
                console.log('================================================');
                return false;
            }

            const parsedAuth = JSON.parse(authData);

            if (!parsedAuth.refresh_token) {
                console.log('================================================');
                console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
                console.log('❌ Nenhum refresh_token encontrado');
                console.error('❌ Nenhum refresh_token encontrado');
                console.log('================================================');
                return false;
            }

            console.log('================================================');
            console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
            console.log('🔄 Tentando renovar token...');
            console.log('================================================');

            const refreshResult = await this.authService.refresh(parsedAuth.refresh_token); // Chamar endpoint de refresh

            if ('token' in refreshResult) {
                await this.socketService.setToken(refreshResult.token); // Atualizar token no socket
                await localStorage.save('auth', JSON.stringify(refreshResult)); // Salvar nova sessão no storage

                console.log('================================================');
                console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
                console.log('✅ Token renovado com sucesso');
                console.log('================================================');

                return true;
            }

            console.log('================================================');
            console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
            console.log('❌ Erro ao renovar token:', refreshResult.message);
            console.error('❌ Erro ao renovar token:', refreshResult.message);
            console.log('================================================');

            return false;
        } catch (error) {
            console.log('================================================');
            console.log('File: DriverMyLocationMapViewModel.tsx, Method: refreshSocketToken');
            console.log('❌ Erro ao renovar token:', error);
            console.error('❌ Erro ao renovar token:', error);
            console.log('================================================');
            return false;
        }
    }

    async refresh(refreshToken: string): Promise<AuthResponse | ErrorResponse> {
        return await this.authService.refresh(refreshToken);
    }

    // =====================================================
    // ======== Adiciona listener de token expirado ========
    // =====================================================
    onTokenExpired(callback: () => void) {
        this.socketService.on('token_expired', callback); // Registra listener no SocketService (que é um EventEmitter)
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: onTokenExpired');
        console.log('✅ Listener de token expirado registrado no ViewModel');
        console.log('================================================');
    }

    // ===================================================
    // ======== Remove listener de token expirado ========
    // ===================================================
    removeTokenExpiredListener(callback: () => void) {
        this.socketService.off('token_expired', callback);
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: removeTokenExpiredListener');
        console.log('🗑️ Listener de token expirado removido do ViewModel');
        console.log('================================================');
    }
}