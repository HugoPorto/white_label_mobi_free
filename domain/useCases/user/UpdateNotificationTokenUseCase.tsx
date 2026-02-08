import { ErrorResponse } from "../../models/ErrorResponse";
import { User } from "../../models/User";
import { UserRepository } from "../../repository/UserRepository";

export class UpdateNotificationTokenUseCase {

    private userRepository: UserRepository;

    constructor({userRepository}: {userRepository: UserRepository}) {
        this.userRepository = userRepository;
    }

    async execute(id: number, token: string): Promise<User | ErrorResponse> {
        return await this.userRepository.updateNotificationToken(id, token);
    }
}