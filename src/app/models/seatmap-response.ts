import { Size } from "@nativescript/core";

export interface SeatmapResponse {
  meta: {
    count: number;
  };
  data: Seatmap[];
  dictionaries: {
    locations: Record<string, LocationDictionaryEntry>;
    facilities: Record<string, string>;
    seatCharacteristics: Record<string, string>;
  };
}

export interface LocationDictionaryEntry {
  cityCode: string;
  countryCode: string;
}

export interface Seatmap {
  id: string;
  type: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  carrierCode: string;
  number: string;
  operating: {
    carrierCode: string;
  };
  aircraft: {
    code: string;
  };
  class: string;
  flightOfferId: string;
  segmentId: string;
  decks: Deck[];
  aircraftCabinAmenities: AircraftCabinAmenities;
  availableSeatsCounters: AvailableSeatsCounter[];
}

export interface AirportInfo {
  iataCode: string;
  terminal: string;
  at: string; // ISO date
}

export interface Deck {
  deckType: string;
  deckConfiguration: DeckConfiguration;
  facilities?: Facility[];
  seats: Seat[];
}

export interface DeckConfiguration {
  width: number;
  length: number;
  startSeatRow: number;
  endSeatRow: number;
  startWingsX: number;
  endWingsX: number;
  startWingsRow: number;
  endWingsRow: number;
  exitRowsX: number[];
}

export interface Facility {
  code: string;
  column: string;
  position: string;
  coordinates: Coordinates;
}

export interface Seat {
  cabin: string;
  number: string;
  characteristicsCodes: string[];
  travelerPricing: TravelerPricing[];
  coordinates: Coordinates;
}

export interface TravelerPricing {
  travelerId: string;
  seatAvailabilityStatus: string;
  price?: Price;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  taxes: Tax[];
}

export interface Tax {
  amount: string;
  code: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface AircraftCabinAmenities {
  power: Power;
  seat: SeatAmenities;
  wifi: Wifi;
  entertainment: Entertainment[];
  food: Food;
  beverage: Beverage;
}

export interface Power {
  isChargeable: boolean;
  powerType: string;
  usbType: string;
}

export interface SeatAmenities {
  legSpace: number;
  spaceUnit: string;
  tilt: string;
  medias: Media[];
}

export interface Media {
  title: string;
  href: string;
  description: {
    text: string;
    lang: string;
  };
  mediaType: string;
}

export interface Wifi {
  isChargeable: boolean;
  wifiCoverage: string;
}

export interface Entertainment {
  isChargeable: boolean;
  entertainmentType: string;
}

export interface Food {
  isChargeable: boolean;
  foodType: string;
}

export interface Beverage {
  isChargeable: boolean;
  beverageType: string;
}

export interface AvailableSeatsCounter {
  travelerId: string;
  value: number;
}
