import { CreateClientRequestUseCase } from "./CreateClientRequestUseCase";
import { GetByClientAssignedUseCase } from "./GetByClientAssignedUseCase";
import { GetByDriverAssignedUseCase } from "./GetByDriverAssignedUseCase";
import { GetClientRequestByIdUseCase } from "./GetClientRequestByIdUseCase";
import { GetNearbyTripRequestUseCase } from "./GetNearbyTripRequestUseCase";
import { GetTimeAndDistanceUseCase } from "./GetTimeAndDistanceUseCase";
import { UpdateClientRatingUseCase } from "./UpdateClientRatingUseCase";
import { UpdateDriverAssignedUseCase } from "./UpdateDriverAssignedUseCase";
import { UpdateDriverRatingUseCase } from "./UpdateDriverRatingUseCase";
import { UpdateStatusUseCase } from "./UpdateStatusUseCase";

export class ClientRequestUseCases {

    getTimeAndDistance: GetTimeAndDistanceUseCase;
    getNearbyTripRequest: GetNearbyTripRequestUseCase;
    getClientRequestById: GetClientRequestByIdUseCase;
    create: CreateClientRequestUseCase;
    updateDriverAssigned: UpdateDriverAssignedUseCase;
    updateStatus: UpdateStatusUseCase;
    updateDriverRating: UpdateDriverRatingUseCase;
    updateClientRating: UpdateClientRatingUseCase;
    getByClientAssigned: GetByClientAssignedUseCase;
    getByDriverAssigned: GetByDriverAssignedUseCase;

    constructor(
        {
            getTimeAndDistanceUseCase,
            createClientRequestUseCase,
            getNearbyTripRequestUseCase,
            updateDriverAssignedUseCase,
            getClientRequestByIdUseCase,
            updateStatusUseCase,
            updateDriverRatingUseCase,
            updateClientRatingUseCase,
            getByClientAssignedUseCase,
            getByDriverAssignedUseCase
        }: 
        {
            getTimeAndDistanceUseCase: GetTimeAndDistanceUseCase,
            createClientRequestUseCase: CreateClientRequestUseCase,
            getNearbyTripRequestUseCase: GetNearbyTripRequestUseCase,
            updateDriverAssignedUseCase: UpdateDriverAssignedUseCase,
            getClientRequestByIdUseCase: GetClientRequestByIdUseCase,
            updateStatusUseCase: UpdateStatusUseCase,
            updateDriverRatingUseCase: UpdateDriverRatingUseCase,
            updateClientRatingUseCase: UpdateClientRatingUseCase,
            getByClientAssignedUseCase: GetByClientAssignedUseCase,
            getByDriverAssignedUseCase: GetByDriverAssignedUseCase
        }
    ) {
        this.getTimeAndDistance = getTimeAndDistanceUseCase;
        this.create = createClientRequestUseCase;
        this.getNearbyTripRequest = getNearbyTripRequestUseCase;
        this.updateDriverAssigned = updateDriverAssignedUseCase;
        this.getClientRequestById = getClientRequestByIdUseCase;
        this.updateStatus = updateStatusUseCase;
        this.updateDriverRating = updateDriverRatingUseCase;
        this.updateClientRating = updateClientRatingUseCase;
        this.getByClientAssigned = getByClientAssignedUseCase;
        this.getByDriverAssigned = getByDriverAssignedUseCase;
    }

}