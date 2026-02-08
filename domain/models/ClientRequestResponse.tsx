export interface ClientRequestResponse {
    id: number;
    id_client: number;
    fare_offered: string;
    fare_assigned: string;
    pickup_description: string;
    destination_description: string;
    status: string;
    updated_at: Date;
    pickup_position: Position;
    destination_position: Position;
    distance: number;
    time_difference: string;
    client: Client;
    driver: Driver;
    google_distance_matrix: GoogleDistanceMatrix;
    id_driver_assigned: number;
    scheduledFor: Date;
    pickup_description_plus: string;
    destination_description_plus: string;
    tolerance_minutes: string;
    vehicle_type: string;
    clientRequestType: string;
    distance_text: string;
    distance_value: number;
    duration_text: string;
    duration_value: number;
    recommended_value: number;
    km_value: number;
    min_value: number;
    driver_rating: string;
    client_rating: string;
    driver_report: string;
    client_report: string;
    code: string;
}

export interface Client {
    name: string;
    image: string;
    phone: string;
    lastname: string;
    general_client_rating: number;
}

export interface Driver {
    name: string;
    image: string;
    phone: string;
    lastname: string;
    general_driver_rating: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface GoogleDistanceMatrix {
    distance: Distance;
    duration: Distance;
    status: string;
}

export interface Distance {
    text: string;
    value: number;
}