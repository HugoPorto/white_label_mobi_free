import { PlaceDetail } from "../../models/PlaceDetail";
import { GooglePlacesRepository } from "../../repository/GooglePlacesRepository";

export class GetPlaceDetailsUseCase {
    private googlePlacesRepository: GooglePlacesRepository;

    constructor({googlePlacesRepository}: {googlePlacesRepository: GooglePlacesRepository}) {
        this.googlePlacesRepository = googlePlacesRepository;
    }

    async execute(placeId: string): Promise<PlaceDetail | null> {
        return await this.googlePlacesRepository.getPlaceDetails(placeId);
    }

}

