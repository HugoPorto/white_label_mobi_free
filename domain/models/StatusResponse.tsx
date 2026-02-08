export interface StatusResponse {
    id: number;
    name: string;
    email: string;
    status: string;
    code: string;
    saleId: string;
    amount: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}