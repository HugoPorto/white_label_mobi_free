import { CreateBalanceUseCase } from "./CreateBalanceUseCase";
import { UpdateBalanceUseCase } from "./UpdateBalanceUseCase";

export class BalanceUseCases {
    create: CreateBalanceUseCase;
    update: UpdateBalanceUseCase;

    constructor(
        {
            createBalanceUseCase,
            updateBalanceUseCase
        }:
            {
                createBalanceUseCase: CreateBalanceUseCase,
                updateBalanceUseCase: UpdateBalanceUseCase
            }
    ) {
        this.create = createBalanceUseCase;
        this.update = updateBalanceUseCase;
    }
}