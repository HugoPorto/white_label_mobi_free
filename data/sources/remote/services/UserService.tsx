import { defaultErrorResponse, ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { UpdatePhoneVerifiedUser } from "../../../../domain/models/UpdatePhoneVerifiedUser";
import { UpdateStatusUser } from "../../../../domain/models/UpdateStatusUser";
import { User } from "../../../../domain/models/User";
import { ApiRequestHandler } from "../api/ApiRequestHandler";
import mime from 'mime';

export class UserService {

    async findAll() {
        try {
            const response = await ApiRequestHandler.get<User[]>('/users');
            console.log('Response findAll: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async findById(id: number) {
        try {
            const response = await ApiRequestHandler.get<any>(`/users/${id}`);
            console.log('Response findById: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async update(user: User) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/${user.id}`, user);
            console.log('Response: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateStatus(user: UpdateStatusUser) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/status/${user.id}`, user);
            console.log('Response Update Status: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updatePhoneVerified(user: UpdatePhoneVerifiedUser) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/phone_verified/${user.id}`, user);
            console.log('Response Update Phone Verified: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateWithImage(user: User, image: string) {
        try {
            const formData = new FormData();
            const fileName = image.split('/').pop() || 'image.jpg';
            const mimeType = mime.getType(image) || 'image/jpeg';

            formData.append('file', {
                uri: image,
                name: fileName,
                type: mimeType,
            } as any);
            formData.append('name', user.name!);
            formData.append('lastname', user.lastname!);
            formData.append('phone', user.phone!);

            const response = await ApiRequestHandler.put<User>(`/users/upload/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async updateNotificationToken(id: number, token: string) {
        try {
            const response = await ApiRequestHandler.put<User>(`/users/notification_token/${id}`, {
                'notification_token': token
            });
            console.log('Response: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros múltiplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async createUserDataRequest(id_user: number) {
        try {
            const response = await ApiRequestHandler.post<any>(`/user-data-requests`, {
                id_user: id_user,
                status: false,
                type: 'information'
            });
            console.log('Response createUserDataRequest: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros multíplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }

    async createUserDataRequestExclusion(id_user: number) {
        try {
            const response = await ApiRequestHandler.post<any>(`/user-data-requests`, {
                id_user: id_user,
                status: false,
                type: 'exclusion'
            });
            console.log('Response createUserDataRequest: ', response.data);

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorData: ErrorResponse = error.response.data;
                if (Array.isArray(errorData.message)) {
                    console.error('Erros multíplos do servidor', errorData.message.join(', '));
                }
                else {
                    console.error('Erro único do servidor', errorData.message);
                }
                return errorData;
            }
            else {
                console.error('Erro na requisição', error.message);
                return defaultErrorResponse;
            }
        }
    }
}