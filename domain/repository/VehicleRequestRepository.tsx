import { ErrorResponse } from "../models/ErrorResponse";
import { VehicleRequest } from "../models/VehicleRequest";
import { VehicleResponseid } from "../models/VehicleResponseId";

export interface VehicleRequestRepository {
    create(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse>;
    update(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse>;
    delete(id: number): Promise<boolean | ErrorResponse>;
    getById(id: number): Promise<VehicleRequest | ErrorResponse>;
    getAllByUserId(id_user: number): Promise<VehicleRequest[] | ErrorResponse>;
    getMainVehicleByUserId(id_user: number): Promise<VehicleResponseid | null | ErrorResponse>;
}