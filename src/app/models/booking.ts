import { Passenger } from './passenger';

export interface Booking {
    userId: string;
    bookingId?: string;
    createdAt: string;
    flights: Flight[];
    passengers: Passenger[];
}

export interface Flight {
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    airline: string;
    departureIATA: string;
    arrivalIATA: string;
    segmentId: string;
}
