import { Role } from "./Role";

export interface User {
    id?: number;
    name?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    password?: string;
    image?: string;
    notification_token?: string;
    roles?: Role[];
    rolesIds?: string | string[];
    car?: boolean;
    cpf?: string;
    phone_verified?: boolean;
}