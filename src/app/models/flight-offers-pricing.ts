export interface FlightOffersPricingResponse {
    data: FlightOffersPricingData;
}

export interface FlightOffersPricingData {
    type: string;
    flightOffers: FlightOffer[];
}

export interface FlightOffer {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: Itinerary[];
    price: Price;
    pricingOptions: PricingOptions;
    validatingAirlineCodes: string[];
    travelerPricings: TravelerPricing[];
}

export interface Itinerary {
    duration: string;
    segments: Segment[];
}

export interface Segment {
    departure: LocationInfo;
    arrival: LocationInfo;
    carrierCode: string;
    number: string;
    aircraft: {
        code: string;
    };
    operating: {
        carrierCode: string;
    };
    duration: string;
    id: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
}

export interface LocationInfo {
    iataCode: string;
    terminal?: string;
    at: string;
}

export interface Price {
    currency: string;
    total: string;
    base: string;
    fees: Fee[];
    grandTotal: string;
}

export interface Fee {
    amount: string;
    type: string;
}

export interface PricingOptions {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: TravelerPrice;
    fareDetailsBySegment: FareDetailsBySegment[];
}

export interface TravelerPrice {
    currency: string;
    total: string;
    base: string;
}

export interface FareDetailsBySegment {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: CheckedBags;
}

export interface CheckedBags {
    weight: number;
    weightUnit: string;
}
