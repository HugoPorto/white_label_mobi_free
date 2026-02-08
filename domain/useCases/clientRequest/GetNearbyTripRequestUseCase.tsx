import { LatLng } from "react-native-maps";
import { ClientRequestRepository } from "../../repository/ClientRequestRepository";

export class GetNearbyTripRequestUseCase {

    private clientRequestRepository: ClientRequestRepository;

    constructor({clientRequestRepository}: {clientRequestRepository: ClientRequestRepository}) {
        this.clientRequestRepository = clientRequestRepository;
    }

    async execute(driverPosition: LatLng, idDriver: number, vehicle_type: string) {
        return await this.clientRequestRepository.getNearbyTripRequest(driverPosition, idDriver, vehicle_type);
    }

}