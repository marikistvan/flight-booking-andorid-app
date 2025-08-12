export interface Passenger {
    firstName: string,
    lastName: string,
    born: string,
    sex: string,
    baggageType: string
    seatNumberWayThere: FlightInfo[],
    seatNumberWayBack?: FlightInfo[]
}

export interface FlightInfo {
    fromPlace: string;
    toPlace: string;
    seatNumber: string;
}