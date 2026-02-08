import { ErrorResponse } from "../../../domain/models/ErrorResponse";
import { VehicleRequest } from "../../../domain/models/VehicleRequest";
import { VehicleResponse } from "../../../domain/models/VehicleResponse";
import { VehicleRequestUseCases } from "../../../domain/useCases/vehicleRequest/VehicleRequestUseCases";
import { VehicleRequestService } from "../../../data/sources/remote/services/VehicleRequestService";
import { VehicleResponseid } from "../../../domain/models/VehicleResponseId";

export class VehicleRegisterViewModel {

    private vehicleRequestUseCases: VehicleRequestUseCases;
    private vehicleRequestService: VehicleRequestService;

    constructor({ vehicleRequestUseCases }: { vehicleRequestUseCases: VehicleRequestUseCases }) {
        this.vehicleRequestUseCases = vehicleRequestUseCases;
        this.vehicleRequestService = new VehicleRequestService();
    }

    async register(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse> {
        return await this.vehicleRequestUseCases.create.execute(vehicleRequest);
    }

    async getVehicleRequestsByUserId(idUser: number): Promise<VehicleRequest[] | ErrorResponse> {
        return await this.vehicleRequestUseCases.getVehicleRequestByIdUserUseCase.execute(idUser);
    }

    async toggleMainVehicle(vehicleId: number, userId: number): Promise<VehicleResponse | ErrorResponse> {
        return await this.vehicleRequestService.toggleMainVehicle(vehicleId, userId);
    }

    async getMainVehicleByUserId(userId: number): Promise<VehicleResponseid | null | ErrorResponse> {
        return await this.vehicleRequestUseCases.getMainVehicleByUserIdUseCase.execute(userId);
    }
}