export interface VehicleResponse {
    id: number;
    id_user: number;
    typeVehicle: string;
    licensePlate: string;
    year: number;
    brand?: string;
    model?: string;
    color?: string;
    isActive?: boolean;
    isMain?: boolean;
    isVerified?: boolean;
    created_at: string;
    updated_at: string;
}
