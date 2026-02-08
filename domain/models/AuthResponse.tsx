import { User } from "./User";
import { Vehicle } from "./Vehicles";

export interface AuthResponse {
    user:  User;
    vehicles?: Vehicle[];
    token: string;
    success?: boolean;
    refresh_token: string;
    session_id: string;
}



