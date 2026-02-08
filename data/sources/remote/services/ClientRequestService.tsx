import { LatLng } from "react-native-maps";
import { TimeAndDistanceValues } from "../../../../domain/models/TimeAndDistanceValues";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { ClientRequest } from "../../../../domain/models/ClientRequest";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import mime from 'mime';

export class ClientRequestService {

    async create(clientRequest: ClientRequest): Promise<number | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.post<number>(`/client-requests`, clientRequest);
            console.log('Response createClientRequest: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }

    }

    async getTimeAndDistance(origin: LatLng, destination: LatLng, type_vehicle: boolean): Promise<TimeAndDistanceValues | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<TimeAndDistanceValues>(`/client-requests/${origin.latitude}/${origin.longitude}/${destination.latitude}/${destination.longitude}/${type_vehicle}`);
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
            console.log('TEMPO, DISTÂNCIA E VALOR SUGERIDO PARA CORRIDA');
            console.log('FILE: ', 'ClientRequestService.tsx');
            console.log('FUNCTION => getTimeAndDistance(origin: LatLng, destination: LatLng, type_vehicle: boolean)');
            console.log('RESPONSE: ', response.data);
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    // =========================================================
    // ============== OBTÉM SOLICITAÇÕES PRÓXIMAS ==============
    // =========================================================
    async getNearbyTripRequest(driverPosition: LatLng, idDriver: number, vehicle_type: string): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/${driverPosition.latitude}/${driverPosition.longitude}/${idDriver}/${vehicle_type}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getByClientAssigned(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned/${idClient}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getByClientCommonAssigned(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned-common/${idClient}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getByClientDeliveryAssigned(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned-delivery/${idClient}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getByClientScheduledAssigned(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned-scheduled/${idClient}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getByDriverAssigned(idDriver: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/driver/assigned/${idDriver}`);
            console.log('Response Histórico: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    // para getByClientRequest do server
    async getClientRequestById(idClientRequest: number): Promise<ClientRequestResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse>(`/client-requests/${idClientRequest}`);
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getClientRequestByIdCreated(idClientRequest: number): Promise<ClientRequestResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse>(`/client-requests/created/${idClientRequest}`);
            console.log('getClientRequestByIdCreated Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateDriverAssigned(idClientRequest: number, idDriver: number, fareAssigned: number): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests`, {
                'id': idClientRequest,
                'id_driver_assigned': idDriver,
                'fare_assigned': fareAssigned
            });
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }

    }

    async updateStatus(idClientRequest: number, status: Status): Promise<any | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests/update_status`, {
                'id_client_request': idClientRequest,
                'status': status,
            });
            console.log('Response Client Request Update Status: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error('ERRO NA REQUISIÇÃO', error.response);
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }

    }

    async updateDriverRating(idClientRequest: number, rating: number): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests/update_driver_rating`, {
                'id_client_request': idClientRequest,
                'driver_rating': rating,
            });
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateDriverReport(idClientRequest: number, report: string): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests/update_driver_report`, {
                'id_client_request': idClientRequest,
                'driver_report': report,
            });
            console.log('updateDriverReport - Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateClientReport(idClientRequest: number, report: string): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests/update_client_report`, {
                'id_client_request': idClientRequest,
                'client_report': report,
            });
            console.log('updateClientReport - Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateClientRating(idClientRequest: number, rating: number): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.put<boolean>(`/client-requests/update_client_rating`, {
                'id_client_request': idClientRequest,
                'client_rating': rating,
            });
            console.log('Response: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }

    }

    async getByIdAndExpiredStatus(id: number): Promise<ClientRequestResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse>(`/client-requests/expired/${id}`);
            console.log('Response Solicitação Expirada: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getCreatedScheduleByClient(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            console.log('ClientRequestService: getCreatedScheduleByClient iniciado com idClient:', idClient);
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/created-schedule/${idClient}`);
            console.log('ClientRequestService: Response getCreatedScheduleByClient:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getCreatedScheduleByDriver(idDriver: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned-schedule/${idDriver}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getCreatedCommonByDriver(idDriver: number): Promise<ClientRequestResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<ClientRequestResponse[]>(`/client-requests/client/assigned-common-to-driver/${idDriver}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;

                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async uploadPackageImage(image: string, idClientRequest: number): Promise<{ success: boolean; image_url: string } | ErrorResponse> {
        console.log('ClientRequestService: Iniciando uploadPackageImage para idClientRequest:', idClientRequest);
        console.log('ClientRequestService: Arquivo recebido para upload:', image);

        try {
            const formData = new FormData();
            const fileName = image.split('/').pop() || 'image.jpg';
            const mimeType = mime.getType(image) || 'image/jpeg';

            formData.append('file', {
                uri: image,
                name: fileName,
                type: mimeType,
            } as any);

            const response = await ApiRequestHandler.put<{ success: boolean; image_url: string }>(
                `/client-requests/upload_package_image/${idClientRequest}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Response uploadPackageImage: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async uploadPackageImageEnd(image: string, idClientRequest: number): Promise<{ success: boolean; image_url: string } | ErrorResponse> {
        try {
            const formData = new FormData();
            const fileName = image.split('/').pop() || 'image.jpg';
            const mimeType = mime.getType(image) || 'image/jpeg';

            formData.append('file', {
                uri: image,
                name: fileName,
                type: mimeType,
            } as any);

            const response = await ApiRequestHandler.put<{ success: boolean; image_url: string }>(
                `/client-requests/upload_package_image_end/${idClientRequest}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Response uploadPackageImageEnd: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async verifyDeliveryCode(idClientRequest: number, code: string): Promise<{ valid: boolean; message: string } | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<{ valid: boolean; message: string }>(
                `/client-requests/verify_delivery_code/${idClientRequest}/${code}`
            );
            console.log('Response verifyDeliveryCode: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateInvalidCode(idClientRequest: number, invalidCode: string): Promise<boolean | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<boolean>(
                `/client-requests/update_invalid_code`,
                {
                    id_client_request: idClientRequest,
                    invalid_code: invalidCode
                }
            );
            console.log('Response updateInvalidCode: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async validateDeliveryCode(idClientRequest: number, code: string): Promise<boolean | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<boolean>(
                `/client-requests/validate_delivery_code/${idClientRequest}/${code}`
            );
            console.log('Response validateDeliveryCode: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async checkIfFinishedOrCancelled(id: number): Promise<{ id: number } | null | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<{ id: number } | null>(
                `/client-requests/check_finished_cancelled/${id}`
            );
            console.log('Response checkIfFinishedOrCancelled: ', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));
                }
                else {
                    console.error('ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }
}
