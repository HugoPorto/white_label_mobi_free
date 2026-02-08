import { LatLng } from "react-native-maps";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { DriverPositionUseCases } from "../../../../domain/useCases/driverPosition/DriverPositionUseCases";
import { DriverTripOfferUseCases } from "../../../../domain/useCases/driverTripOffer/DriverTripOfferUseCases";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";

export class DriverClientRequestViewModel {

    private clientRequestUseCases: ClientRequestUseCases;
    private driverPositionUseCases: DriverPositionUseCases; // Analisando
    private driverTripOfferUseCases: DriverTripOfferUseCases;
    private socketService: SocketService;
    private clientRequestService: ClientRequestService;

    constructor (
        { 
            clientRequestUseCases,
            driverPositionUseCases,
            driverTripOfferUseCases,
            socketService
        }: 
        { 
            clientRequestUseCases: ClientRequestUseCases,
            driverPositionUseCases: DriverPositionUseCases,
            driverTripOfferUseCases: DriverTripOfferUseCases,
            socketService: SocketService
        }
    ) {
        this.clientRequestUseCases = clientRequestUseCases;
        this.driverPositionUseCases = driverPositionUseCases;
        this.driverTripOfferUseCases = driverTripOfferUseCases;
        this.socketService = socketService;
        this.clientRequestService = new ClientRequestService();
    }

    async getNearbyTripRequest(driverPosition: LatLng, idDriver: number, vehicle_type: string) {
        return this.clientRequestUseCases.getNearbyTripRequest.execute(driverPosition, idDriver, vehicle_type);
    }

    async getDriverPosition(idDriver: number) {
        return await this.driverPositionUseCases.getDriverPosition.execute(idDriver);
    }

    async createDriverTripOffer(driverTripOffer: DriverTripOffer) { // Analisando
        return await this.driverTripOfferUseCases.create.execute(driverTripOffer);
    }

    listenerNewDriverAssignedSocket(idDriver: number, callback: (data: any) => void) {
        this.socketService.onLocationMessage(`driver_assigned/${idDriver}`, (data: any) => {
            callback(data);
        });
    }

    listenerNewClientRequestSocket(callback: (data: any) => void) {
        this.socketService.onLocationMessage('created_client_request', (data: any) => {
            callback(data);
        });
    }

    emitNewDriverOffer(idClientRequest: number, accept?: boolean, clientRequestType?: string) {
        this.socketService.sendLocationMessage('new_driver_offer', {
            'id_client_request': idClientRequest,
            'accept': accept,
            'client_request_type': clientRequestType
        });
    }

    async getByIdAndExpiredStatus(id: number) {
        return await this.clientRequestService.getByIdAndExpiredStatus(id);
    }

}