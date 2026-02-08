import { LatLng } from "react-native-maps";
import { PlaceDetail } from "../../../../domain/models/PlaceDetail";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { TimeAndDistanceValues } from "../../../../domain/models/TimeAndDistanceValues";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequest } from "../../../../domain/models/ClientRequest";
import { DriverTripOfferUseCases } from "../../../../domain/useCases/driverTripOffer/DriverTripOfferUseCases";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { PlaceGeocodeDetail } from "../../../../domain/models/PlaceGeocodeDetail";
import { GoogleDirections } from "../../../../domain/models/GoogleDirections";
import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import { LocalStorage } from "../../../../data/sources/local/LocalStorage";
import { AuthService } from "../../../../data/sources/remote/services/AuthService";

export class ClientSerchMapViewModel {

    private googlePlacesUseCases: GooglePlacesUseCases;
    private clientRequestUseCases: ClientRequestUseCases;
    private driverTripOfferUseCases: DriverTripOfferUseCases;
    private socketService: SocketService;
    private clientRequestService: ClientRequestService;
    private authService: AuthService;

    constructor(
        {
            googlePlacesUseCases,
            clientRequestUseCases,
            socketService,
            driverTripOfferUseCases
        }: {
            googlePlacesUseCases: GooglePlacesUseCases,
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            driverTripOfferUseCases: DriverTripOfferUseCases
        }
    ) {
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.driverTripOfferUseCases = driverTripOfferUseCases;
        this.clientRequestService = new ClientRequestService();
        this.authService = new AuthService();
    }

    async initSocket() {
        await this.initLocationSocket();
    }

    async initLocationSocket() {
        await this.socketService.initLocationSocket();
    }

    disconnectAllSockets() {
        this.socketService.disconnect();
    }

    async setSocketToken(token: string) {
        await this.socketService.setToken(token);
    }

    isLocationConnected(): boolean {
        return this.socketService.isLocationConnected();
    }

    async waitForLocationConnection(timeout = 5000): Promise<boolean> {
        return await this.socketService.waitForLocationConnection(timeout);
    }

    async createClientRequest(clientRequest: ClientRequest) {
        return await this.clientRequestUseCases.create.execute(clientRequest);
    }

    async updateDriverAssigned(idClientRequest: number, idDriver: number, fareAssigned: number) {
        return await this.clientRequestUseCases.updateDriverAssigned.execute(idClientRequest, idDriver, fareAssigned);
    }

    async updateStatus(idClientRequest: number, status: Status) {
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetail | null> {
        return await this.googlePlacesUseCases.getPlaceDetails.execute(placeId);
    }

    async getDriverTripOffers(idClientRequest: number): Promise<DriverTripOffer[] | ErrorResponse> {
        return await this.driverTripOfferUseCases.getDriverTripOffers.execute(idClientRequest);
    }

    async getPlaceDetailsByCoords(lat: number, lng: number): Promise<PlaceGeocodeDetail | null> {
        return await this.googlePlacesUseCases.getPlaceDetailsByCoords.execute(lat, lng);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    async getTimeAndDistance(origin: LatLng, destination: LatLng, type_vehicle: boolean): Promise<TimeAndDistanceValues | ErrorResponse> {
        return await this.clientRequestUseCases.getTimeAndDistance.execute(origin, destination, type_vehicle);
    }

    emitNewDriverAssigned(idClientRequest: number, idDriver: number) {
        this.socketService.sendLocationMessage('new_driver_assigned', {
            id_client_request: idClientRequest,
            id_driver: idDriver
        });
    }

    // Emite nova solicitação de cliente via socket
    emitNewClientRequest(idClientRequest: number) {
        this.socketService.sendLocationMessage('new_client_request', {
            id_client_request: idClientRequest
        });
    }

    listenerDriversPositionSocket(callback: (data: any) => void) {
        console.log('📡[CLIENT_VIEWMODEL] Registrando listener de posições de motoristas');
        console.log('📡[CLIENT_VIEWMODEL] Socket conectado?', this.socketService.isLocationConnected());

        // Escuta tanto new_driver_position quanto change_driver_position
        this.socketService.onLocationMessage('new_driver_position', (data: any) => {
            console.log('🟢[CLIENT_VIEWMODEL] NOVO CONDUTOR (new_driver_position):', data);
            callback(data);
        });

        this.socketService.onLocationMessage('change_driver_position', (data: any) => {
            console.log('🟢[CLIENT_VIEWMODEL] MUDANÇA POSIÇÃO CONDUTOR (change_driver_position):', data);
            callback(data);
        });

        console.log('✅[CLIENT_VIEWMODEL] Listeners registrados com sucesso');
    }

    listenerDriversDisconnectedSocket(callback: (idSocket: string) => void) {
        this.socketService.onLocationMessage('driver_disconnected', (data: any) => {
            console.log('CONDUCTOR DESCONECTADO', data);
            const idSocket = data.id_socket;
            callback(idSocket);
        })
    }

    listenerNewDriverOffer(idClientRequest: number, callback: (data: any) => void) {
        this.socketService.onLocationMessage(`created_driver_offer/${idClientRequest}`, (data: any) => {
            console.log('created_driver_offer', data);
            callback(
                {
                    'idClientRequest': data.id_client_request,
                    'clientRequestType': data.client_request_type
                }
            );
        })
    }

    async getClientRequestById(idClientRequest: number) {
        return await this.clientRequestService.getClientRequestByIdCreated(idClientRequest);
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