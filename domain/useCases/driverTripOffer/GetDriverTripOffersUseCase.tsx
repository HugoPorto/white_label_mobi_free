import { DriverTripOffer } from "../../models/DriverTripOffer";
import { DriverTripOfferRepository } from "../../repository/DriverTripOfferRepository";

export class GetDriverTripOffersUseCase {

    driverTripOfferRepository: DriverTripOfferRepository;

    constructor({driverTripOfferRepository}: {driverTripOfferRepository: DriverTripOfferRepository}) {
        this.driverTripOfferRepository = driverTripOfferRepository;
    }

    async execute(idClientRequest: number) {
        return this.driverTripOfferRepository.getDriverTripOffers(idClientRequest);
    }

}