import { BalanceRequest } from "../../domain/models/BalanceRequest";
import { BalanceUpdateRequest } from "../../domain/models/BalanceUpdateRequest";
import { ErrorResponse } from "../../domain/models/ErrorResponse";
import { BalanceRepository } from "../../domain/repository/BalanceRepository";
import { BalanceService } from "../sources/remote/services/BalanceService";

export class BalanceRepositoryImpl implements BalanceRepository {
    
    private balanceService: BalanceService;

    constructor({balanceService}: {balanceService: BalanceService}) {
        this.balanceService = balanceService;
    }

    update(balanceRequest: BalanceUpdateRequest): Promise<BalanceUpdateRequest | ErrorResponse> {
        return this.balanceService.update(balanceRequest.id_user!, balanceRequest);
    }

    delete(id: number): Promise<boolean | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    getById(id: number): Promise<BalanceRequest | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    getAllByUserId(id_user: number): Promise<BalanceRequest[] | ErrorResponse> {
        throw new Error("Method not implemented.");
    }

    async create(balanceRequest: BalanceRequest): Promise<BalanceRequest | ErrorResponse> {
        return await this.balanceService.create(balanceRequest);
    }
}