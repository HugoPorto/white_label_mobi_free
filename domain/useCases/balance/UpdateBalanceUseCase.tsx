import { BalanceRequest } from "../../models/BalanceRequest";
import { BalanceUpdateRequest } from "../../models/BalanceUpdateRequest";
import { ErrorResponse } from "../../models/ErrorResponse";
import { BalanceRepository } from "../../repository/BalanceRepository";

export class UpdateBalanceUseCase {

    private balanceRepository: BalanceRepository;

    constructor({ balanceRepository }: { balanceRepository: BalanceRepository }) {
        this.balanceRepository = balanceRepository;
    }

    async execute(balance: BalanceUpdateRequest): Promise<BalanceUpdateRequest | ErrorResponse> {
        return await this.balanceRepository.update(balance);
    }
}