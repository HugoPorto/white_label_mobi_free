import { ErrorResponse } from "../../models/ErrorResponse";
import { BalanceRepository } from "../../repository/BalanceRepository";
import { BalanceRequest } from "../../models/BalanceRequest";

export class CreateBalanceUseCase {

    private balanceRepository: BalanceRepository;

    constructor({ balanceRepository }: { balanceRepository: BalanceRepository }) {
        this.balanceRepository = balanceRepository;
    }

    async execute(balanceRequest: BalanceRequest): Promise<BalanceRequest | ErrorResponse> {
        return await this.balanceRepository.create(balanceRequest);
    }
}