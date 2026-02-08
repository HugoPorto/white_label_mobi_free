export interface BalanceStatusRequest {
    id: number;
    name: string;
    email: string;
    status: string;
    code: string;
    saleId?: string;
    id_user?: number;
    amount: number;
    created_at: string;
}