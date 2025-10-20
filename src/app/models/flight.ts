export interface Flight {
    data: {
        type: string;
        id: string;
        source: string;
        isUpsellOffer: boolean;
        instantTicketingRequired: boolean;
        nonHomogeneous: boolean;
        lastTicketingDateTime: string;
        lastTicketingDate: string;
        numberOfBookableSeats: number;
        itineraries: {
            duration: string;
            segments: {
                departure: { iataCode: string; terminal?: string; at: string };
                arrival: { iataCode: string; terminal?: string; at: string };
                carrierCode: string;
                aircraft: { code: string };
                operating: { carrierCode: string };
                blacklistedInEU: boolean;
                number: string;
                duration: string;
                id: string;
                numberOfStops: number;
            }[];
        }[];
        price: {
            currency: string;
            total: string;
            base: string;
            grandTotal: string;
            fees: {
                amount: string;
                type: string;
            }[];
        };
        pricingOptions: {
            fareType: string[];
            includedCheckedBagsOnly: boolean;
        };
        validatingAirlineCodes: string[];
        travelerPricings: {
            travelerId: string;
            fareOption: string;
            travelerType: string;
            price: {
                currency: string;
                total: string;
                base: string;
            };
            fareDetailsBySegment: {
                segmentId: string;
                cabin: string;
                fareBasis: string;
                class: string;
                includedCheckedBags: {
                    weight: number;
                    weightUnit: string;
                };
                includedCabinBags: {
                    weight: number;
                    weightUnit: string;
                };
            }[];
        }[];
    }[];
}
