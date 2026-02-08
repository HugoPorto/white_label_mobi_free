import { CreateDriverTripOfferUseCase } from "./CreateDriverTripOfferUseCase";
import { GetDriverTripOffersUseCase } from "./GetDriverTripOffersUseCase";

export class DriverTripOfferUseCases {

    create: CreateDriverTripOfferUseCase;
    getDriverTripOffers: GetDriverTripOffersUseCase;

    constructor(
        {
            createDriverTripOfferUseCase,
            getDriverTripOffersUseCase
        }: 
        {
            createDriverTripOfferUseCase: CreateDriverTripOfferUseCase,
            getDriverTripOffersUseCase: GetDriverTripOffersUseCase
        }
    ) {
        this.create = createDriverTripOfferUseCase;
        this.getDriverTripOffers = getDriverTripOffersUseCase;
    }

}