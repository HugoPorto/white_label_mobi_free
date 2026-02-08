export interface StatusRequest {
    name: string;
    email: string;
    id_user: number;
    amount: number;
    cpf: string | undefined;
}