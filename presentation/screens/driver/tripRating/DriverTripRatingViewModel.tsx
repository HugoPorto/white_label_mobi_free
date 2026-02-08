import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";

export class DriverTripRatingViewModel {

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

    async updateClientRating(idClientRequest: number, rating: number) {
        return await this.clientRequestUseCases.updateClientRating.execute(idClientRequest, rating);
    }

    async updateClientReport(idClientRequest: number, report: string) {
        return await this.clientRequestService.updateClientReport(idClientRequest, report);
    }
}