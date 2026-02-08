import { LatLng } from "react-native-maps";
import { ClientRequestRepository } from "../../repository/ClientRequestRepository";
import { VehicleRequestRepository } from "../../repository/VehicleRequestRepository";

export class GetVehicleRequestByIdUserUseCase {

    private vehicleRequestRepository: VehicleRequestRepository;

    constructor({vehicleRequestRepository}: {vehicleRequestRepository: VehicleRequestRepository}) {
        this.vehicleRequestRepository = vehicleRequestRepository;
    }

    async execute(idUser: number) {
        return await this.vehicleRequestRepository.getAllByUserId(idUser);
    }
}