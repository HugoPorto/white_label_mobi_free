import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { DriverPosition } from "../../../../domain/models/DriverPosition";
import { DriverPositionUseCases } from "../../../../domain/useCases/driverPosition/DriverPositionUseCases";
import { BalanceService } from "../../../../data/sources/remote/services/BalanceService";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { StatusRequest } from "../../../../domain/models/StatusRequest";
import { Status } from "../../../../domain/models/Status";
import { BalanceUpdateRequest } from "../../../../domain/models/BalanceUpdateRequest";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";
import { AuthService } from "../../../../data/sources/remote/services/AuthService";
import { AuthResponse } from "../../../../domain/models/AuthResponse";
export interface CreateStatusDto {
    name: string;
    email: string;
    id_user: number;
    amount: number;
    cpf: string | undefined;
}
export class DriverMyLocationMapViewModel {

    private googlePlacesUseCases: GooglePlacesUseCases;
    private clientRequestUseCases: ClientRequestUseCases;
    private driverPositionUseCases: DriverPositionUseCases;
    private socketService: SocketService;
    private balanceService: BalanceService;
    private authService: AuthService;

    constructor(
        {
            googlePlacesUseCases,
            clientRequestUseCases,
            socketService,
            driverPositionUseCases,
            balanceService
        }: {
            googlePlacesUseCases: GooglePlacesUseCases,
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            driverPositionUseCases: DriverPositionUseCases,
            balanceService: BalanceService
        }
    ) {
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.driverPositionUseCases = driverPositionUseCases;
        this.balanceService = balanceService;
        this.authService = new AuthService();
    }

    // ====================================================
    // ======== Inicializa o socket de localização ========
    // ====================================================
    async initLocationSocket() {
        await this.socketService.initLocationSocket();
    }

    // ==================================================
    // ======= Desconecta o socket de localização =======
    // ==================================================
    disconnectLocationSocket() {
        this.socketService.disconnectLocationSocket();
    }

    // ====================================================================
    // =========== Emite a posição do motorista para o servidor ===========
    // ====================================================================
    emitDriverPosition(id: number, lat: number, lng: number, typeVehicle: boolean) {
        this.socketService.sendLocationMessage('change_driver_position', {
            'id': id,
            'lat': lat,
            'lng': lng,
            'typeVehicle': typeVehicle
        });

        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: emitDriverPosition');
        console.log('📡 Emitindo posição via change_driver_position:', { id, lat, lng, typeVehicle });
        console.log('================================================');
    }

    // ===================================================
    // ======== Inicializa o socket de pagamentos ========
    // ===================================================
    async initPaymentSocket() {
        await this.socketService.initPaymentSocket();
    }

    // =================================================
    // ======= Desconecta o socket de pagamentos =======
    // =================================================
    disconnectPaymentSocket() {
        this.socketService.disconnectPaymentSocket();
    }

    // =========================================================
    // ======== Adiciona listener para mensagens de PPS ========
    // =========================================================
    listenerPPS(callback: (data: any) => void) {
        this.socketService.onPaymentMessage('pps2', (data: any) => {
            callback(data);
        })
    }

    // [DEPRECATED]
    async initSocket() {
        await this.initLocationSocket();
        await this.initPaymentSocket();
    }

    // [DEPRECATED]
    disconnectSocket() {
        this.disconnectLocationSocket();
    }

    // =============================================
    // ======== Desconecta todos os sockets ========
    // =============================================
    disconnectAllSockets() {
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: disconnectAllSockets');
        console.log('🔌 Desconectando todos os sockets...');
        console.log('================================================');
        this.socketService.disconnect();
    }

    isLocationConnected(): boolean {
        return this.socketService.isLocationConnected();
    }

    isPaymentConnected(): boolean {
        return this.socketService.isPaymentConnected();
    }

    // ===========================================
    // ======== Aguarda conexão do socket ========
    // ===========================================
    async waitForLocationConnection(timeout = 5000): Promise<boolean> {
        return await this.socketService.waitForLocationConnection(timeout);
    }

    // =================================================
    // ======== Atualiza o token JWT após login ========
    // =================================================
    async setSocketToken(token: string) {
        await this.socketService.setToken(token);
    }

    async createDriverPosition(driverPosition: DriverPosition) {
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: createDriverPosition');
        console.log('Criando posição do motorista:', driverPosition);
        console.log('================================================');
        return await this.driverPositionUseCases.create.execute(driverPosition);
    }

    async generatePixPayment(statusData: CreateStatusDto): Promise<Status | ErrorResponse> {
        const statusRequest: StatusRequest = {
            name: statusData.name,
            email: statusData.email,
            id_user: statusData.id_user,
            amount: statusData.amount,
            cpf: statusData.cpf
        };

        return await this.balanceService.generatePixPayment(statusRequest);
    }

    // ============================================
    // ======== Obtém balance pelo id_user ========
    // ============================================
    async getBalanceByUserId(id_user: number): Promise<any | ErrorResponse> {
        return await this.balanceService.findByUserId(id_user);
    }

    // =====================================================
    // ======== Atualiza status pelo code e id_user ========
    // =====================================================
    async updateStatusByCodeAndUserId(code: string, id_user: number, updateData: any): Promise<any | ErrorResponse> {
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: updateStatusByCodeAndUserId');
        console.log('ViewModel - Atualizando status com code:', code, 'e id_user:', id_user, 'com dados:', updateData);
        console.log('================================================');
        return await this.balanceService.updateStatusByCodeAndUserId(code, id_user, updateData);
    }

    // ===============================================
    // ======== Atualiza balance pelo id_user ========
    // ===============================================
    async updateBalanceByUserId(id_user: number, balanceData: BalanceUpdateRequest): Promise<any | ErrorResponse> {
        console.log('================================================');
        console.log('File: DriverMyLocationMapViewModel.tsx, Method: updateBalanceByUserId');
        console.log('ViewModel - Atualizando balance para usuário:', id_user, 'com dados:', balanceData);
        console.log('================================================');
        return await this.balanceService.update(balanceData);
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