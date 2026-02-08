import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { BalanceRequest } from "../../../../domain/models/BalanceRequest";
import { BalanceUpdateRequest } from "../../../../domain/models/BalanceUpdateRequest";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { User } from "../../../../domain/models/User";
import { AuthUseCases } from "../../../../domain/useCases/auth/AuthUseCases";
import { BalanceUseCases } from "../../../../domain/useCases/balance/BalanceUseCases";

export class RegisterViewModel {

    private authUseCases: AuthUseCases;
    private balanceUseCase: BalanceUseCases

    constructor({ authUseCases, balanceUseCase }: { authUseCases: AuthUseCases, balanceUseCase: BalanceUseCases }) {
        this.authUseCases = authUseCases;
        this.balanceUseCase = balanceUseCase;
    }

    async register(user: User): Promise<AuthResponse | ErrorResponse> {
        return await this.authUseCases.register.execute(user);
    }

    async createBalance(balance: BalanceRequest): Promise<BalanceRequest | ErrorResponse> {
        return await this.balanceUseCase.create.execute(balance);
    }

    async updateBalance(balance: BalanceUpdateRequest): Promise<BalanceUpdateRequest | ErrorResponse> {
        return await this.balanceUseCase.update.execute(balance);
    }
}