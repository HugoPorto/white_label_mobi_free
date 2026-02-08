import { ErrorResponse } from "../../models/ErrorResponse";
import { VehicleRequestRepository } from "../../repository/VehicleRequestRepository";
import { VehicleRequest } from "../../models/VehicleRequest";

export class CreateVehicleRequestUseCase {

    private vehicleRequestRepository: VehicleRequestRepository;

    constructor({vehicleRequestRepository}: {vehicleRequestRepository: VehicleRequestRepository}) {
        this.vehicleRequestRepository = vehicleRequestRepository;
    }

    async execute(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse> {
        return await this.vehicleRequestRepository.create(vehicleRequest);
    }
}