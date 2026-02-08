import { AuthResponse } from "../../models/AuthResponse";
import { ErrorResponse } from "../../models/ErrorResponse";
import { AuthRepository } from "../../repository/AuthRepository";

export class LoginUseCase {

    private authRepository: AuthRepository;

    constructor({authRepository}: {authRepository: AuthRepository}) {
        this.authRepository = authRepository;
    }

    async execute(email: string, password: string, device_id: string): Promise<AuthResponse | ErrorResponse> {
        console.log('LoginUseCase - Device ID:', device_id);
        return await this.authRepository.login(email, password, device_id);
    }

}