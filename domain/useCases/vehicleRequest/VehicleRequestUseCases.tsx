import { CreateVehicleRequestUseCase } from "./CreateVehicleRequestUseCase";
import { GetMainVehicleByUserIdUseCase } from "./GetMainVehicleByUserId";
import { GetVehicleRequestByIdUserUseCase } from "./GetVehicleRequestByIdUserUseCase";

export class VehicleRequestUseCases {
    create: CreateVehicleRequestUseCase;
    getVehicleRequestByIdUserUseCase: GetVehicleRequestByIdUserUseCase;
    getMainVehicleByUserIdUseCase: GetMainVehicleByUserIdUseCase;

    constructor(
        {
            createVehicleRequestUseCase,
            getVehicleRequestByIdUserUseCase,
            getMainVehicleByUserIdUseCase
        }:
            {
                createVehicleRequestUseCase: CreateVehicleRequestUseCase,
                getVehicleRequestByIdUserUseCase: GetVehicleRequestByIdUserUseCase,
                getMainVehicleByUserIdUseCase: GetMainVehicleByUserIdUseCase
            }
    ) {
        this.create = createVehicleRequestUseCase;
        this.getVehicleRequestByIdUserUseCase = getVehicleRequestByIdUserUseCase;
        this.getMainVehicleByUserIdUseCase = getMainVehicleByUserIdUseCase;
    }
}