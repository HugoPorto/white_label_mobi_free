import { LatLng } from "react-native-maps";
import { ClientRequestRepository } from "../../repository/ClientRequestRepository";

export class GetTimeAndDistanceUseCase {

    private clientRequestRepository: ClientRequestRepository;

    constructor({clientRequestRepository}: {clientRequestRepository: ClientRequestRepository}) {
        this.clientRequestRepository = clientRequestRepository;
    }

    async execute(origin: LatLng, destination: LatLng, type_vehicle: boolean) {
        return await this.clientRequestRepository.getTimeAndDistance(origin, destination, type_vehicle);
    }

}