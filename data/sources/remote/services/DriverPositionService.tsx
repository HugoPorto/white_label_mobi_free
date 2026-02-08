import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { DriverPosition } from "../../../../domain/models/DriverPosition";

export class DriverPositionService {

    async create(driverPosition: DriverPosition): Promise<boolean | ErrorResponse> {

        try {
            const response = await ApiRequestHandler.post<boolean>(`/drivers-position`, driverPosition);
            console.log('Function => create | File => DriverPositionService | Message => Posição do motorista criada com sucesso: | Data =>', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Function => create | File => DriverPositionService | Message => Erros múltiplos do servidor | Data =>', errorData.message.join(', '));
                }
                else {
                    console.error('Function => create | File => DriverPositionService | Message => Erro único do servidor | Data =>', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Function => create | File => DriverPositionService | Message => Erro na requisição | Data =>', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async getDriverPosition(idDriver: number): Promise<DriverPosition | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<DriverPosition>(`/drivers-position/${idDriver}`);
            console.log('Function => getDriverPosition | File => DriverPositionService | Message => Posição do motorista obtida com sucesso: | Data =>', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Function => getDriverPosition | File => DriverPositionService | Message => Erros múltiplos do servidor | Data =>', errorData.message.join(', '));
                }
                else {
                    console.error('Function => getDriverPosition | File => DriverPositionService | Message => Erro único do servidor | Data =>', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Function => getDriverPosition | File => DriverPositionService | Message => Erro na requisição | Data =>', error.message);
                return defaultErrorResponse;
            }
        }
    }
}