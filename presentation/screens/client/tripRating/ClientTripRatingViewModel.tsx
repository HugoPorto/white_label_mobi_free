import { ClientRequestService } from "../../../../data/sources/remote/services/ClientRequestService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";

export class ClientTripRatingViewModel {

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

    async updateDriverRating(idClientRequest: number, rating: number) {
        return await this.clientRequestUseCases.updateDriverRating.execute(idClientRequest, rating);
    }

    async updateDriverReport(idClientRequest: number, report: string) {
        return await this.clientRequestService.updateDriverReport(idClientRequest, report);
    }
}