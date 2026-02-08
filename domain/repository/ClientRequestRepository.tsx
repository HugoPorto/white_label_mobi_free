import { LatLng } from "react-native-maps";
import { TimeAndDistanceValues } from "../models/TimeAndDistanceValues";
import { ErrorResponse } from "../models/ErrorResponse";
import { ClientRequest } from "../models/ClientRequest";
import { ClientRequestResponse } from "../models/ClientRequestResponse";

export enum Status {
    CREATED = "CREATED",
    ACCEPTED = 'ACCEPTED',
    ON_THE_WAY = "ON_THE_WAY",
    ARRIVED = "ARRIVED",
    TRAVELLING = "TRAVELLING",
    FINISHED = "FINISHED",
    CANCELLED = "CANCELLED",
    STARTED = "STARTED",
    EXPIRED = 'EXPIRED'
}


export interface ClientRequestRepository {

    create(clientRequest: ClientRequest): Promise<number | ErrorResponse>;
    getTimeAndDistance(origin: LatLng, destination: LatLng, type_vehicle: boolean): Promise<TimeAndDistanceValues | ErrorResponse>;
    getNearbyTripRequest(driverPosition: LatLng, idDriver: number, vehicle_type: string): Promise<ClientRequestResponse[] | ErrorResponse>;
    updateDriverAssigned(idClientRequest: number, idDriver: number, fareAssigned: number): Promise<boolean | ErrorResponse>;
    getClientRequestById(idClientRequest: number): Promise<ClientRequestResponse | ErrorResponse>;
    updateStatus(idClientRequest: number, status: Status): Promise<any | ErrorResponse>;
    updateDriverRating(idClientRequest: number, rating: number): Promise<boolean | ErrorResponse>;
    updateClientRating(idClientRequest: number, rating: number): Promise<boolean | ErrorResponse>;
    getByClientAssigned(idClient: number): Promise<ClientRequestResponse[] | ErrorResponse>;
    getByDriverAssigned(idDriver: number): Promise<ClientRequestResponse[] | ErrorResponse>;
}