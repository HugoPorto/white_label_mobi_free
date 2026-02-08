import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";

export class ClientTripHistoryViewModel {

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

    async getByClientAssigned(idClient: number) {
        return await this.clientRequestUseCases.getByClientAssigned.execute(idClient);
    }


    async getByClientCommonAssigned(idClient: number) {
        const result = await this.clientRequestService.getByClientCommonAssigned(idClient);
        return result;
    }

    async updateStatus(idClientRequest: number, status: Status) {
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }

    async updateDriverRating(idClientRequest: number, rating: number) {
        return await this.clientRequestUseCases.updateDriverRating.execute(idClientRequest, rating);
    }

    async updateDriverReport(idClientRequest: number, report: string) {
        return await this.clientRequestService.updateDriverReport(idClientRequest, report);
    }
}