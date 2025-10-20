export interface Passenger {
    id: string;
    firstName: string;
    lastName: string;
    born: string;
    sex: string;
    baggageType: string;
    seats: FlightInfo[];
}

export interface FlightInfo {
    seatNumber: string;
    segmentId: string;
}
