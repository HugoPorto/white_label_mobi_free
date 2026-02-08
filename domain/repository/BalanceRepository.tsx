import { ErrorResponse } from "../models/ErrorResponse";
import { BalanceRequest } from "../models/BalanceRequest";
import { BalanceUpdateRequest } from "../models/BalanceUpdateRequest";

export interface BalanceRepository {
    create(balanceRequest: BalanceRequest): Promise<BalanceRequest | ErrorResponse>;
    update(balanceUpdateRequest: BalanceUpdateRequest): Promise<BalanceUpdateRequest | ErrorResponse>;
    delete(id: number): Promise<boolean | ErrorResponse>;
    getById(id: number): Promise<BalanceRequest | ErrorResponse>;
    getAllByUserId(id_user: number): Promise<BalanceRequest[] | ErrorResponse>;
}