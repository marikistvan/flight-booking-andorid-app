import { Injectable } from '@angular/core';
import { FlightOffer, Dictionaries } from '../models/flight-offers-response';
import { Passenger } from '../models/passenger';
import { CurrencyService } from './currency.service';
import { ExchangeApi } from '../models/exchangeApi';
import { getString } from '@nativescript/core/application-settings';
import { User, UserDetails } from '../models/user';

@Injectable({ providedIn: 'root' })
export class FlightSearchStateService {
    private flightOffers: FlightOffer[];
    private flightsWithSpecificCurrency: FlightOffer[] = [];
    private dictionary: Dictionaries;
    private toPlace: string;
    private passengers: Passenger[];
    private _currency: string;
    private _priceSymbol: string;
    private _profileToSeeUser: User;
    private _profileToSeeUserDetails: UserDetails;

    constructor(private currencyService: CurrencyService) {
        this.setCurrency(getString('appCurrency', 'EUR'));
        this.setPriceSymbol(getString('appCurrencySymbol', '€'));
    }

    async setFlights(
        flightOffers: FlightOffer[],
        dictionaries: Dictionaries,
        toPlace: string
    ) {
        this.flightOffers = [...flightOffers];
        this.dictionary = dictionaries;
        this.toPlace = toPlace;
        await this.changeCurrency();
    }

    setCurrency(currency: string) {
        this._currency = currency;
    }

    setPriceSymbol(priceSymbol: string) {
        this._priceSymbol = priceSymbol;
    }

    getPriceSymbol() {
        return this._priceSymbol;
    }

    getFlights() {
        return {
            flightOffers: this.flightOffers,
            dictionary: this.dictionary,
            toPlace: this.toPlace,
        };
    }

    getFlightOffers() {
        return this.flightOffers;
    }

    getFlightOffersWithSpecificCurrency() {
        return this.flightsWithSpecificCurrency;
    }

    getFlightById(id: string): FlightOffer {
        return this.flightOffers.find((flight) => flight.id === id);
    }

    getFlightByIdWithSpecificCurrency(id: string): FlightOffer {
        return this.flightsWithSpecificCurrency.find(
            (flight) => flight.id === id
        );
    }

    getTotalPriceByIdWithSpecificCurrency(id: string): string {
        return this.flightsWithSpecificCurrency.find(
            (flight) => flight.id === id
        ).price.total;
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

    private async changeCurrency() {
        this.flightsWithSpecificCurrency = JSON.parse(
            JSON.stringify(this.flightOffers));
        try {
            let rates = await this.currencyService.getRates();
            if (rates === undefined) {
                console.log('rates undefined');
                return;
            }
            this.flightsWithSpecificCurrency.forEach((flight) => {
                let totalPrice = Number(flight.price.total);
                const switchCurrency = this.switchCurrency(
                    this._currency,
                    totalPrice,
                    rates
                );
                flight.price.total = switchCurrency.toString();
                flight.price.currency = this._priceSymbol;
            });
        } catch (err: any) {
            console.log('currency Service error: ' + err);
        }
    }

    private switchCurrency(
        currency: string,
        price: number,
        rates: ExchangeApi['quotes']
    ): number {
        let changedPrice = -1;
        switch (currency) {
            case 'HUF':
                changedPrice = Math.round(
                    price * (rates.USDHUF / rates.USDEUR)
                );
                break;
            case 'EUR':
                changedPrice = price;
                break;
            case 'CHF':
                changedPrice = Math.round(
                    price * (rates.USDCHF / rates.USDEUR)
                );
                break;
            case 'USD':
                changedPrice = Math.round(price * rates.USDEUR);
                break;
            default:
                break;
        }
        return changedPrice;
    }

    setProfileToSee(user: User) {
        this._profileToSeeUser = user;
    }
    getProfileToSee(): User {
        return this._profileToSeeUser;
    }
    setProfileDetailsToSee(userDetails: UserDetails) {
        return (this._profileToSeeUserDetails = userDetails);
    }
    getProfileDetialsToSee(): UserDetails {
        return this._profileToSeeUserDetails;
    }
}
