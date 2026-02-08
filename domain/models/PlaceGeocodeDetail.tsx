export interface PlaceGeocodeDetail {
  plus_code: Pluscode;
  results: Result[];
  status: string;
}
export interface Result {
  address_components: Addresscomponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: Pluscode;
  types: string[];
}
export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds?: Viewport;
}
export interface Viewport {
  northeast: Location;
  southwest: Location;
}
export interface Location {
  lat: number;
  lng: number;
}
export interface Addresscomponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface Pluscode {
  global_code: string;
}