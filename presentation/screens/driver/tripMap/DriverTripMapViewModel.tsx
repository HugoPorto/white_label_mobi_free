import { LatLng } from "react-native-maps";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { BalanceService } from "../../../../data/sources/remote/services/BalanceService";
import { BalanceUpdateRequest } from "../../../../domain/models/BalanceUpdateRequest";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { ChatRequest } from "../../../../domain/models/ChatRequest";
import { ChatUseCases } from "../../../../domain/useCases/chat/ChatUseCases";
import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";
import { AuthService } from "../../../../data/sources/remote/services/AuthService";
import { AuthResponse } from "../../../../domain/models/AuthResponse";

export class DriverTripMapViewModel {

    private clientRequestUseCases: ClientRequestUseCases;
    private socketService: SocketService;
    private googlePlacesUseCases: GooglePlacesUseCases;
    private balanceService: BalanceService;
    private chatUseCases: ChatUseCases
    private clientRequestService: ClientRequestService;
    private authService: AuthService;

    constructor(
        {
            clientRequestUseCases,
            socketService,
            googlePlacesUseCases,
            balanceService,
            chatUseCases
        }:
            {
                clientRequestUseCases: ClientRequestUseCases,
                socketService: SocketService,
                googlePlacesUseCases: GooglePlacesUseCases,
                balanceService: BalanceService,
                chatUseCases: ChatUseCases
            }
    ) {
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.balanceService = balanceService;
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

    disconnectSocket() {
        this.socketService.disconnect();
    }

    async getClientRequestById(idClientRequest: number) {
        return await this.clientRequestUseCases.getClientRequestById.execute(idClientRequest);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    async updateStatus(idClientRequest: number, status: Status) {
        console.log('Atualizando status para:', Status[status]);
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }

    async updateStatusFinished(idClientRequest: number, status: Status, clientRequest: ClientRequestResponse, id_user: number) {
        console.log('Status do pedido:', Status[status]);
        console.log('Atualizando status para FINALIZADO e atualizando balance do motorista');
        const fare = Number(clientRequest.fare_assigned);
        const fareTwentyPercent = fare * 0.2;

        console.log('=== DEBUG CÁLCULO BALANCE ===');
        console.log('Fare (valor da corrida):', fare);
        console.log('Taxa de 20%:', fareTwentyPercent);
        console.log('Valor líquido para o motorista (fare - taxa):', fare - fareTwentyPercent);

        this.balanceService.findByUserId(id_user).then(balance => {
            console.log('Balance atual do motorista:', balance);
            console.log('balance_in atual:', balance.balance_in);
            console.log('balance_out atual:', balance.balance_out);

            const newBalanceIn = balance.balance_in + (fare - fareTwentyPercent);
            const newBalanceOut = balance.balance_out - fareTwentyPercent;

            console.log('Novo balance_in calculado:', newBalanceIn);
            console.log('Novo balance_out calculado:', newBalanceOut);

            this.balanceService.update({
                balance_out: newBalanceOut,
                balance_in: newBalanceIn,
                id_user: id_user
            });
        });

        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }


    emitDriverPosition(idClient: number, lat: number, lng: number) {
        this.socketService.sendLocationMessage('trip_change_driver_position', {
            'id_client': idClient,
            'lat': lat,
            'lng': lng,
        });
    }

    emitUpdateStatus(idClientRequest: number, status: Status) {
        this.socketService.sendLocationMessage('update_status_trip', {
            'id_client_request': idClientRequest,
            'status': status,
        });
    }

    listenerUpdateStatusSocket(idClientRequest: number, callback: (data: any) => void) {
        this.socketService.onLocationMessage(`new_status_trip/${idClientRequest}`, (data: any) => {
            callback(data);
        })
    }

    async getBalanceByUserId(id_user: number): Promise<any | ErrorResponse> {
        return await this.balanceService.findByUserId(id_user);
    }

    async updateBalanceByUserId(balanceData: BalanceUpdateRequest): Promise<any | ErrorResponse> {
        console.log('ViewModel - Atualizando balance para usuário:', balanceData.id_user, 'com dados:', balanceData);
        return await this.balanceService.update(balanceData);
    }

    listenerChatMessageClient(callback: (data: any) => void) {
        this.socketService.onLocationMessage('chat_message_emit_client', (data: any) => {
            callback(data);
        })
    }

    async sendMessage(chatRequest: ChatRequest) {
        try {
            console.log('📤 Enviando mensagem via ViewModel:', chatRequest);
            const chat = await this.chatUseCases.create.execute(chatRequest);
            console.log('✅ Mensagem criada no backend:', chat);
            this.socketService.sendLocationMessage('chat_message_driver', chat);
            console.log('📡 Mensagem enviada via socket');
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
        }
    }

    async getActiveClientRequest(id_user: number, role: string) {
        console.log('ViewModel: Buscando requisição de chat ativa para o usuário:', id_user);
        return await this.chatUseCases.getActiveClientRequest.execute(id_user, role);
    }

    // ======================================================
    // ============== REFORMULAR DEPOIS DO MVP ==============
    // ======================================================
    async uploadPackageImage(image: string, idClientRequest: number): Promise<{ success: boolean; image_url: string } | ErrorResponse> {
        console.log('ViewModel: Enviando imagem do pacote para o serviço. ID da requisição:', idClientRequest);
        return await this.clientRequestService.uploadPackageImage(image, idClientRequest);
    }

    async uploadPackageImageEnd(image: string, idClientRequest: number): Promise<{ success: boolean; image_url: string } | ErrorResponse> {
        return await this.clientRequestService.uploadPackageImageEnd(image, idClientRequest);
    }

    async verifyDeliveryCode(idClientRequest: number, code: string): Promise<{ valid: boolean; message: string } | ErrorResponse> {
        return await this.clientRequestService.verifyDeliveryCode(idClientRequest, code);
    }

    async updateInvalidCode(idClientRequest: number, invalidCode: string): Promise<boolean | ErrorResponse> {
        return await this.clientRequestService.updateInvalidCode(idClientRequest, invalidCode);
    }

    async validateDeliveryCode(idClientRequest: number, code: string): Promise<boolean | ErrorResponse> {
        return await this.clientRequestService.validateDeliveryCode(idClientRequest, code);
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