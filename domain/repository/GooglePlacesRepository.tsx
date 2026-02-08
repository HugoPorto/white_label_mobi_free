import { LatLng } from "react-native-maps";
import { PlaceDetail } from "../models/PlaceDetail";

export interface GooglePlacesRepository {

    getPlaceDetails(placeId: string): Promise<PlaceDetail | null>;
    getPlaceDetailsByCoords(lat: number, lng: number): Promise<PlaceGeocodeDetail | null>;
    getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null>;

}