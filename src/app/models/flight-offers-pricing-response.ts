export interface FlightOffersPricingResponse {
  data: FlightOffersPricingData;
  dictionaries?: Dictionaries;
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
  oneWay?: boolean;
  lastTicketingDate: string;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
  paymentCardRequired?: boolean;
}

export interface Itinerary {
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
  id: string;
  numberOfStops: number;
  duration: string;
}

export interface LocationInfo {
  iataCode: string;
  at: string; 
  terminal?: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
  billingCurrency: string;
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
  taxes?: Tax[];
}

export interface Tax {
  amount: string;
  code: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: CheckedBags;
}

export interface CheckedBags {
  quantity?: number;
  weight?: number;
  weightUnit?: string;
}

export interface Dictionaries {
  locations: {
    [iataCode: string]: {
      cityCode: string;
      countryCode: string;
    };
  };
}
