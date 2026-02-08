import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";

export class DriverTripHistoryViewModel {

    private clientRequestUseCases: ClientRequestUseCases;
    private clientRequestService: ClientRequestService;

    constructor(
        {
            clientRequestUseCases
        }:
            {
                clientRequestUseCases: ClientRequestUseCases
            }
    ) {
        this.clientRequestUseCases = clientRequestUseCases;
        this.clientRequestService = new ClientRequestService();
    }

    async getByDriverAssigned(idDriver: number) {
        return await this.clientRequestUseCases.getByDriverAssigned.execute(idDriver);
    }

    async getCreatedCommonByDriver(id_driver: number) {
        const result = await this.clientRequestService.getCreatedCommonByDriver(id_driver);
        return result;
    }

    async updateStatus(idClientRequest: number, status: Status) {
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }
}