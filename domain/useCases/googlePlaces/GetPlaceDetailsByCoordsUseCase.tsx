import { PlaceDetail } from "../../models/PlaceDetail";
import { PlaceGeocodeDetail } from "../../models/PlaceGeocodeDetail";
import { GooglePlacesRepository } from "../../repository/GooglePlacesRepository";

export class GetPlaceDetailsByCoordsUseCase {
    private googlePlacesRepository: GooglePlacesRepository;

    constructor({googlePlacesRepository}: {googlePlacesRepository: GooglePlacesRepository}) {
        this.googlePlacesRepository = googlePlacesRepository;
    }

    async execute(lat: number, lng: number): Promise<PlaceGeocodeDetail | null> {
        return await this.googlePlacesRepository.getPlaceDetailsByCoords(lat, lng);
    }

}

