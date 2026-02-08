export interface DriverTripOffer {

    id?: number,
    id_driver: number;
    id_client_request: number;
    fare_offered: number;
    time: number;
    distance: number;
    driver?: Driver;
    vehicle?: Vehicle;
}

export interface Driver {
    name: string,
    lastname: string,
    image: string,
    phone: string,
    typeVehicle?: boolean, // true = carro, false = moto
}

export interface Vehicle {
    brand: string,
    model: string,
    year: number,
    typeVehicle: string,
    licensePlate: string,
    color?: string,
}