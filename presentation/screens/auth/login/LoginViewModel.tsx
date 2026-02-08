import { AuthService } from "../../../../data/sources/remote/services/AuthService";
import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { AuthUseCases } from "../../../../domain/useCases/auth/AuthUseCases";
import { LoginUseCase } from "../../../../domain/useCases/auth/LoginUseCase";
import { UserUseCases } from "../../../../domain/useCases/user/UserUseCases";

export class LoginViewModel {

    private authUseCases: AuthUseCases;
    private userUseCases: UserUseCases;
    private authService: AuthService

    constructor({authUseCases, userUseCases}: {authUseCases: AuthUseCases, userUseCases: UserUseCases}) {
        this.authUseCases = authUseCases;
        this.userUseCases = userUseCases;
        this.authService = new AuthService();
    }

    async login(email: string, password: string, device_id: string): Promise<AuthResponse | ErrorResponse> {
        console.log('Device ID no LoginViewModel:', device_id);
        return await this.authUseCases.login.execute(email, password, device_id);
    }

    async updateNotificationToken(id: number, token: string) {
        return await this.userUseCases.updateNotificationToken.execute(id, token);
    }

    async sendPhoneVerification(phone: string): Promise<{ success: boolean; sid?: string; message?: string } | ErrorResponse> {
        return await this.authService.sendPhoneVerification(phone);
    }

    async verifyPhoneCode(phone: string, code: string): Promise<{ verified: boolean; message?: string } | ErrorResponse> {
        return await this.authService.verifyPhoneCode(phone, code);
    }

    async recoverPassword(email: string, phoneNumber: string): Promise<{ message: string; success: boolean } | ErrorResponse> {
        return await this.authService.recoverPassword(email, phoneNumber);
    }

    async refresh(refreshToken: string): Promise<AuthResponse | ErrorResponse> {
        return await this.authService.refresh(refreshToken);
    }

    async checkSession(session_id: string): Promise<{ valid: boolean; message: string } | ErrorResponse> {
        try {
            return await this.authService.checkSession(session_id);
        } catch (error: any) {
            // Propagar erros 401 para tratamento no componente
            if (error.response?.status === 401) {
                throw error;
            }
            throw error;
        }
    }
}