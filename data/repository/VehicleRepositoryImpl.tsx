import { DriverTripOffer } from "../../domain/models/DriverTripOffer";
import { ErrorResponse } from "../../domain/models/ErrorResponse";
import { VehicleRequest } from "../../domain/models/VehicleRequest";
import { VehicleResponse } from "../../domain/models/VehicleResponse";
import { VehicleResponseid } from "../../domain/models/VehicleResponseId";
import { VehicleRequestRepository } from "../../domain/repository/VehicleRequestRepository";
import { DriverTripOfferService } from "../sources/remote/services/DriverTripOfferService";
import { VehicleRequestService } from "../sources/remote/services/VehicleRequestService";

export class VehicleRequestRepositoryImpl implements VehicleRequestRepository {
    
    private vehicleRequestService: VehicleRequestService;

    constructor({vehicleRequestService}: {vehicleRequestService: VehicleRequestService}) {
        this.vehicleRequestService = vehicleRequestService;
    }

    update(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    getById(id: number): Promise<VehicleRequest | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    getAllByUserId(id_user: number): Promise<VehicleRequest[] | ErrorResponse> {
        return this.vehicleRequestService.getVehiclesByUserId(id_user);
    }

    async create(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse> {
        return await this.vehicleRequestService.create(vehicleRequest);
    }

    async getMainVehicleByUserId(userId: number): Promise<VehicleResponseid | null | ErrorResponse> {
        return await this.vehicleRequestService.getMainVehicleByUserId(userId);
    }
}