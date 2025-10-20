export interface BasicFlightInformation {
    data: {
        id: string;
        numberOfBookableSeats: number;
        itineraries: {
            duration: string;
            segments: {
                departure: { iataCode: string; terminal?: string; at: string };
                arrival: { iataCode: string; terminal?: string; at: string };
                carrierCode: string;
                aircraft: { code: string };
                operating: { carrierCode: string };
                number: string;
                duration: string;
                id: string;
                numberOfStops: number;
            }[];
        }[];
        price: {
            currency: string;
            total: string;
        };
    }[];
}
