import { ApiRequestHandler } from "../api/ApiRequestHandler";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { BalanceRequest } from "../../../../domain/models/BalanceRequest";
import { BalanceUpdateRequest } from "../../../../domain/models/BalanceUpdateRequest";
import { StatusRequest } from "../../../../domain/models/StatusRequest";
import { Status } from "../../../../domain/models/Status";

export class BalanceService {
    async create(balanceRequest: BalanceRequest): Promise<BalanceRequest | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.post<BalanceRequest>(`/balance`, balanceRequest);
            
            return { ...response.data, success: true };
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor - create - BalanceService', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor - create - BalanceService', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição - create - BalanceService', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async update(balance: BalanceUpdateRequest) {
        try {
            const response = await ApiRequestHandler.put<BalanceUpdateRequest>(`/balance/update-common/user/${balance.id_user}`, {
                balance_in: balance.balance_in,
                balance_out: balance.balance_out
            });

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor - update - BalanceService', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor - update - BalanceService', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição - update - BalanceService', error.message);
                return defaultErrorResponse;
            }
        }
    }


    async generatePixPayment(statusRequest: StatusRequest): Promise<Status | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.post<Status>(`/status`, statusRequest);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor - sendPPS - BalanceService', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor - sendPPS - BalanceService', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Error na requisição - sendPPS - BalanceService', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async findByUserId(id_user: number): Promise<any | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.get<any>(`/balance/user/${id_user}`);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor - findByUserId - BalanceService', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor - findByUserId - BalanceService', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição - findByUserId - BalanceService', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateStatusByCodeAndUserId(code: string, id_user: number, updateData: any): Promise<any | ErrorResponse> {
        try {
            const response = await ApiRequestHandler.put<any>(`/status/update/${code}/${id_user}`, updateData);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor - updateStatusByCodeAndUserId - BalanceService', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor - updateStatusByCodeAndUserId - BalanceService', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição - updateStatusByCodeAndUserId - BalanceService', error.message);
                return defaultErrorResponse;
            }
        }
    }
}