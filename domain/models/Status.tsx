export interface Status {
    id: number;
    name: string;
    email: string;
    status: string;
    code: string;
    saleId: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    user: {
        id: number;
    };
    // Campos opcionais do QR Code (adicionados pelo service)
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
}
