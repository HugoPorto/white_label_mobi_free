import { UserService } from "../../../../data/sources/remote/services/UserService";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { User } from "../../../../domain/models/User";
import { UserUseCases } from "../../../../domain/useCases/user/UserUseCases";

export class ProfileUpdateViewModel {
    private userUseCases: UserUseCases;
    private userService: UserService

    constructor({userUseCases}: {userUseCases: UserUseCases}) {
        this.userUseCases = userUseCases;
        this.userService = new UserService();
    }

    async update(user: User): Promise<User | ErrorResponse> {
        return await this.userUseCases.update.execute(user);
    }

    async updateWithImage(user: User, image: string): Promise<User | ErrorResponse> {
        return await this.userUseCases.updateWithImage.execute(user, image);
    }

    async findById(id: number): Promise<any | ErrorResponse> {
        return await this.userService.findById(id);
    }

    async createUserDataRequest(id_user: number): Promise<any | ErrorResponse> {
        return await this.userService.createUserDataRequest(id_user);
    }

    async createUserDataRequestExclusion(id_user: number): Promise<any | ErrorResponse> {
        return await this.userService.createUserDataRequestExclusion(id_user);
    }
}