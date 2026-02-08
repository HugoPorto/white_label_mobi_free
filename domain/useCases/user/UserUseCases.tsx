import { UpdateImageUserUseCase } from "./UpdateImageUserUseCase";
import { UpdateNotificationTokenUseCase } from "./UpdateNotificationTokenUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UserUseCases {

    update: UpdateUserUseCase;
    updateWithImage: UpdateImageUserUseCase;
    updateNotificationToken: UpdateNotificationTokenUseCase;

    constructor(
        {
            updateUserUseCase,
            updateImageUserUseCase,
            updateNotificationTokenUseCase
        }: 
        {
            updateUserUseCase: UpdateUserUseCase,
            updateImageUserUseCase: UpdateImageUserUseCase,
            updateNotificationTokenUseCase: UpdateNotificationTokenUseCase
        }
    ) {
        this.update = updateUserUseCase;
        this.updateWithImage = updateImageUserUseCase;
        this.updateNotificationToken = updateNotificationTokenUseCase;
    }

}