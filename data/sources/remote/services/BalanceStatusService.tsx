import { LatLng } from "react-native-maps";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { VehicleRequest } from "../../../../domain/models/VehicleRequest";
import { VehicleResponse } from "../../../../domain/models/VehicleResponse";
import { StatusResponse } from "../../../../domain/models/StatusResponse";

// Interface para o response da consulta de pagamento
export interface PaymentConsultResponse {
    payment_id: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    date_approved: string | null;
    payment_method_id: string;
    payment_type_id: string;
    id_user: number | null;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        };
    };
}

export class BalanceStatusService {
    
    async findAll(): Promise<StatusResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<StatusResponse[]>('/status/all');
            console.log('Status FindAll Response:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                } else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição findAll', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async findByUserId(userId: number): Promise<StatusResponse[] | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<StatusResponse[]>(`/status/user/${userId}`);
            console.log('Status Response:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                } else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição findByUserId', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async consultPayment(paymentId: string): Promise<PaymentConsultResponse | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<PaymentConsultResponse>(`/status/consult/${paymentId}`);
            console.log('Payment Consult Response:', response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                } else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            } else {
                console.error('Erro na requisição consultPayment', error.message);
                return defaultErrorResponse;
            }
        }
    }
}