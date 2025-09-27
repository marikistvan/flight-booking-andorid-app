export interface FlightOffersResponse {
    meta: Meta;
    dictionaries: Dictionaries;
    data: FlightOffer[];
}

export interface Meta {
    count: number;
    links: {
        self: string;
    };
}

export interface FlightOffer {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    isUpsellOffer: boolean;
    lastTicketingDate: string;
    lastTicketingDateTime: string;
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
    departure: LocationDetail;
    arrival: LocationDetail;
    carrierCode: string;
    number: string;
    aircraft: {
        code: string;
    };
    operating?: {
        carrierCode?: string;
        carrierName?: string;
    };
    duration: string;
    id: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
}

export interface LocationDetail {
    iataCode: string;
    terminal?: string;
    at: string;
}

export interface Price {
    currency: string;
    total: string;
    base: string;
    grandTotal?: string;
    fees?: Fee[];
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
    associatedAdultId?: string;
    fareOption: string;
    travelerType: string;
    price: Price;
    fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FareDetailsBySegment {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    brandedFare?: string;
    brandedFareLabel?: string;
    class: string;
    includedCheckedBags?: BagInfo;
    includedCabinBags?: BagInfo;
    amenities?: Amenity[];
    additionalServices?: SeatNumber;
}
export interface SeatNumber {
    chargeableSeatNumber: string;
}

export interface BagInfo {
    quantity?: number;
    weight?: number;
    weightUnit?: string;
}

export interface Amenity {
    description: string;
    isChargeable: boolean;
    amenityType: string;
    amenityProvider: {
        name: string;
    };
}

export interface Dictionaries {
    locations: {
        [iataCode: string]: {
            cityCode: string;
            countryCode: string;
        };
    };
    aircraft: {
        [aircraftCode: string]: string;
    };
    currencies: {
        [currencyCode: string]: string;
    };
    carriers: {
        [carrierCode: string]: string;
    };
}