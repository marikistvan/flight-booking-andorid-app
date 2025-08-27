import { Injectable } from "@angular/core";
import { FlightOffer, Dictionaries } from '../models/flight-offers-response';
import { Passenger } from "../models/passenger";

@Injectable({ providedIn: "root" })
export class FlightSearchStateService {
    private flightOffers: FlightOffer[];
    private dictionary: Dictionaries;
    private toPlace: string;
    private passengers: Passenger[];

    setFlights(flightOffers: FlightOffer[], dictionaries: Dictionaries, toPlace: string) {
        this.flightOffers = flightOffers;
        this.dictionary = dictionaries;
        this.toPlace = toPlace;
    }

    getFlights() {
        return {
            flightOffers: this.flightOffers,
            dictionary: this.dictionary,
            toPlace: this.toPlace
        };
    }

    getFlightOffers() { return this.flightOffers; }

    getFlightById(id: string): FlightOffer {
        return this.flightOffers.find((flight) => flight.id === id);
    }

    getDictionary() {
        return this.dictionary;
    }

    getToPlace() {
        return this.toPlace;
    }

    setPassengers(passengers: Passenger[]) {
        this.passengers = passengers;
    }

    getPassengers(): Passenger[] {
        return this.passengers;
    }
}
