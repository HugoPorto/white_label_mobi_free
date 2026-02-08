import { ErrorResponse } from "../../../domain/models/ErrorResponse";
import { BalanceStatusService } from "../../../data/sources/remote/services/BalanceStatusService";
import { StatusResponse } from "../../../domain/models/StatusResponse";
import { BalanceService } from "../../../data/sources/remote/services/BalanceService";
import { BalanceRequest } from "../../../domain/models/BalanceRequest";

export class BalanceViewModel {
    private balanceStatusService: BalanceStatusService;
    private balanceService: BalanceService;

    constructor() {
        this.balanceStatusService = new BalanceStatusService();
        this.balanceService = new BalanceService();
    }

    async getAllBalanceStatus(userId: number): Promise<StatusResponse[] | ErrorResponse> {
        return await this.balanceStatusService.findByUserId(userId);
    }

    async consultStatus(statusCode: string): Promise<any | ErrorResponse> {
        return await this.balanceStatusService.consultPayment(statusCode);
    }

    async create(balanceRequest: BalanceRequest): Promise<BalanceRequest | ErrorResponse> {
        return await this.balanceService.create(balanceRequest);
    }

    async getBalanceByUserId(id_user: number): Promise<any | ErrorResponse> {
        return await this.balanceService.findByUserId(id_user);
    }

    async getAllStatusBalance(): Promise<StatusResponse[] | ErrorResponse> {
        return await this.balanceStatusService.findAll();
    }
}