import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { User } from "../../../../domain/models/User";
import { ApiRequestHandler } from "../api/ApiRequestHandler";

export class AuthService {

    async login (email: string, password: string, device_id: string): Promise<AuthResponse | ErrorResponse>  {
        console.log('AuthService - login');
        try {
            const response = await ApiRequestHandler.post<AuthResponse>('/auth/login', {
                email: email,
                password: password,
                device_id: device_id
            });
            console.log('AuthService - RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {                    
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async register (user: User): Promise<AuthResponse | ErrorResponse>  {
        try {
            const response = await ApiRequestHandler.post<AuthResponse>('/auth/register', user);
            console.log('AuthService - RESPONSE: ', response.data);

            return { ...response.data, success: true };
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message.join(', '));    
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async sendPhoneVerification(phone: string): Promise<{ success: boolean; sid?: string; message?: string } | ErrorResponse> {
        console.log('AuthService - sendPhoneVerification');
        try {
            const response = await ApiRequestHandler.post<{ success: boolean; sid: string }>('/auth/send-code-verification', {
                phone: phone
            });
            console.log('AuthService - PHONE VERIFICATION RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {                    
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async verifyPhoneCode(phone: string, code: string): Promise<{ verified: boolean; message?: string } | ErrorResponse> {
        console.log('AuthService - verifyPhoneCode');
        try {
            const response = await ApiRequestHandler.post<{ verified: boolean }>('/auth/verify-code', {
                phone: phone,
                code: code
            });
            console.log('AuthService - PHONE CODE VERIFICATION RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {                    
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async recoverPassword(email: string, phoneNumber: string): Promise<{ message: string; success: boolean } | ErrorResponse> {
        console.log('AuthService - recoverPassword');
        try {
            const response = await ApiRequestHandler.post<{ message: string; success: boolean }>('/users/recover-password', {
                email: email,
                phoneNumber: phoneNumber
            });
            console.log('AuthService - RECOVER PASSWORD RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {                    
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async refresh(refreshToken: string): Promise<AuthResponse | ErrorResponse> {
        console.log('AuthService - refresh');
        try {
            const response = await ApiRequestHandler.post<AuthResponse>('/auth/refresh', {
                refresh_token: refreshToken
            });
            console.log('AuthService - REFRESH RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async checkSession(session_id: string): Promise<{ valid: boolean; message: string } | ErrorResponse> {
        console.log('AuthService - checkSession');
        try {
            const response = await ApiRequestHandler.post<{ valid: boolean; message: string }>('/auth/check-session', {
                session_id: session_id
            });
            console.log('AuthService - CHECK SESSION RESPONSE: ', response.data);
            
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw error;
            }

            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.log('AuthService - ERROS MÚLTIPLOS DO SERVIDOR', errorData.message);
                }
                else {
                    console.log('AuthService - ERRO ÚNICO DO SERVIDOR', errorData.message);
                }
                return errorData;
            }
            else {
                console.log('AuthService - ERRO NA REQUISIÇÃO', error.message);
                return defaultErrorResponse;
            }
        }
    }
}