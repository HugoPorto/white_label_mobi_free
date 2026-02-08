import { LatLng } from "react-native-maps";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { VehicleRequest } from "../../../../domain/models/VehicleRequest";
import { VehicleResponse } from "../../../../domain/models/VehicleResponse";
import { VehiclesUpdate } from "../../../../domain/models/VehiclesUpdate";
import { VehicleResponseid } from "../../../../domain/models/VehicleResponseId";

export class VehicleRequestService {

    async create(vehicleRequest: VehicleRequest): Promise<VehicleRequest | ErrorResponse> {

        try {
            console.log('Vehicle Request:', vehicleRequest);
            const response = await ApiRequestHandler.post<VehicleRequest>(`/vehicles`, vehicleRequest);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição', error.message);
                return defaultErrorResponse;
            }
        }

    }

    async update(vehicle: VehiclesUpdate) {
        try {
            const response = await ApiRequestHandler.put<VehiclesUpdate>(`/vehicles/${vehicle.id}`, vehicle);
            console.log('Response: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getVehiclesByUserId(idUser: number): Promise<VehicleResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<VehicleResponse[]>(`/vehicles/${idUser}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async toggleMainVehicle(vehicleId: number, userId: number): Promise<VehicleResponse | ErrorResponse> {
        try {
            console.log(`Toggling main vehicle - Vehicle ID: ${vehicleId}, User ID: ${userId}`);
            const response = await ApiRequestHandler.put<VehicleResponse>(`/vehicles/${vehicleId}/toggle-main/${userId}`);
            console.log('Toggle main vehicle response:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getMainVehicleByUserId(userId: number): Promise<VehicleResponseid | null | ErrorResponse> {
        try {
            console.log(`Getting main vehicle for user ID: ${userId}`);
            const response = await ApiRequestHandler.get<VehicleResponseid | null>(`/vehicles/main/${userId}`);
            console.log('Main vehicle response:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }
}