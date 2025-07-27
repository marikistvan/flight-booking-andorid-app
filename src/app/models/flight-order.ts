export interface FlightOrderRequest {
  data: FlightOrderData;
}

export interface FlightOrderData {
  type: 'flight-order';
  flightOffers: FlightOffer[];
  travelers: Traveler[];
  remarks?: Remarks;
  ticketingAgreement?: TicketingAgreement;
  contacts?: Contact[];
}

export interface FlightOffer {
  type: 'flight-offer';
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  paymentCardRequired: boolean;
  lastTicketingDate: string;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Itinerary {
  segments: Segment[];
}

export interface Segment {
  departure: AirportDetails;
  arrival: AirportDetails;
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
}

export interface AirportDetails {
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
  taxes: Tax[];
}

export interface Tax {
  amount: string;
  code: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  class: string;
  includedCheckedBags: {
    quantity: number;
  };
}

export interface Traveler {
  id: string;
  dateOfBirth: string;
  name: Name;
  gender: string;
  contact?: ContactDetails;
  documents?: Document[];
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface ContactDetails {
  emailAddress: string;
  phones: Phone[];
}

export interface Phone {
  deviceType: string;
  countryCallingCode: string;
  number: string;
}

export interface Document {
  documentType: string;
  birthPlace: string;
  issuanceLocation: string;
  issuanceDate: string;
  number: string;
  expiryDate: string;
  issuanceCountry: string;
  validityCountry: string;
  nationality: string;
  holder: boolean;
}

export interface Remarks {
  general: GeneralRemark[];
}

export interface GeneralRemark {
  subType: string;
  text: string;
}

export interface TicketingAgreement {
  option: string;
  delay: string;
}

export interface Contact {
  addresseeName: Name;
  companyName: string;
  purpose: string;
  phones: Phone[];
  emailAddress: string;
  address: Address;
}

export interface Address {
  lines: string[];
  postalCode: string;
  cityName: string;
  countryCode: string;
}
