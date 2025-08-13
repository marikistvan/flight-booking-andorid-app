export interface Booking {
  userId: string;
  bookingId: string;
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
}

export interface Passenger {
  fullName: string;
  birthDate: string; 
  gender: 'F' | 'N' | 'E';
  baggage: string;
  seats: Record<string, string>; 
}
