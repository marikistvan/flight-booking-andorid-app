import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocationResponse } from '../models/location-response';
import { LocationResponseForOneLocation } from '../models/location-response-for-one-location';
import { FlightOffersResponse } from '../models/flight-offers-response';
import { FlightOffer } from '../models/flight-offers-response';
import { SeatmapResponse } from '../models/seatmap-response';
import data from '../../assets/flight-offer-sample.json';
import { errorMessages } from '~/app/models/errors/apiError';
import { knownFolders, path, File } from '@nativescript/core';

@Injectable({
    providedIn: 'root',
})
export class AmadeusService {
    private tokenUrl = environment.amadeusTokenUrl;
    private clientId = environment.amadeusClientId;
    private clientSecret = environment.amadeusClientSecret;
    private accessToken: string | null = null;

    constructor(private http: HttpClient) {}

    private getToken(): Observable<any> {
        const body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        body.set('client_id', this.clientId);
        body.set('client_secret', this.clientSecret);

        return this.http.post(this.tokenUrl, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }

    private setAccessToken(token: string) {
        this.accessToken = token;
    }

    private getAccessToken() {
        return this.accessToken;
    }
    /**
     * Visszaadja a talált járatok adatait.
     * @param {string} origin - indulási hely.
     * @param {string} destination - érkezési hely hely.
     * @param {string} departureDate - indulási dátum.
     * @param {string} adults - a felnőttek száma.
     * @param {string} max - maximum mennyi eredmény érkezzen.
     * @param {string} returnDate - vissza utazási dátum.
     * @param {string} childrens - a gyerekek száma.
     * @param {string} infants - a csecsemők száma.
     * @returns {Observable<FlightOffersResponse>} az utazási adatai.
     */
    searchFlights(
        origin: string,
        destination: string,
        departureDate: string,
        adults: string,
        max: string,
        returnDate: string,
        childrens: string,
        infants: string
    ): Observable<FlightOffersResponse> {
        if (this.accessToken) {
            return this.makesearchFlightsRequest(
                origin,
                destination,
                departureDate,
                adults,
                max,
                returnDate,
                childrens,
                infants
            );
        } else {
            return this.getToken().pipe(
                switchMap((tokenResponse) => {
                    const token = tokenResponse.access_token;
                    this.setAccessToken(token);
                    return this.makesearchFlightsRequest(
                        origin,
                        destination,
                        departureDate,
                        adults,
                        max,
                        returnDate,
                        childrens,
                        infants
                    );
                })
            );
        }
    }

    private makesearchFlightsRequest(
        origin: string,
        destination: string,
        departureDate: string,
        adults: string,
        max: string,
        returnDate: string,
        childrens: string,
        infants: string
    ): Observable<FlightOffersResponse> {
        let url;
        if (returnDate === null) {
            url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&children=${childrens}&infants=${infants}&max=${max}`;
        } else {
            url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&children=${childrens}&infants=${infants}&max=${max}`;
        }
        return this.http.get<FlightOffersResponse>(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
    }
    getLocations(keywords: string): Observable<LocationResponse> {
        if (this.accessToken) {
            return this.makeLocationsRequest(keywords);
        } else {
            return this.getToken().pipe(
                switchMap((tokenResponse) => {
                    const token = tokenResponse.access_token;
                    this.setAccessToken(token);
                    return this.makeLocationsRequest(keywords);
                })
            );
        }
    }

    getSeatMap(flightOffer: FlightOffer): Observable<SeatmapResponse> {
        const url = `https://test.api.amadeus.com/v1/shopping/seatmaps`;
        const flightArray: FlightOffer[] = [];

        flightArray.push(flightOffer);
        const body = { data: flightArray };
        this.logToFile(body);
        return this.http.post<SeatmapResponse>(url, body, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            }),
        });
    }

    private makeLocationsRequest(
        keywords: string
    ): Observable<LocationResponse> {
        const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${keywords}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=LIGHT`;
        return this.http.get<LocationResponse>(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
    }

    getLocation(keywords: string): Observable<LocationResponseForOneLocation> {
        if (this.accessToken) {
            return this.makeLocationRequest(keywords);
        } else {
            return this.getToken().pipe(
                switchMap((tokenResponse) => {
                    const token = tokenResponse.access_token;
                    this.setAccessToken(token);
                    return this.makeLocationRequest(keywords);
                })
            );
        }
    }

    private makeLocationRequest(
        keywords: string
    ): Observable<LocationResponseForOneLocation> {
        const url = `https://test.api.amadeus.com/v1/reference-data/locations/${keywords}`;
        return this.http.get<LocationResponseForOneLocation>(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
    }

    getMockFlightOffers(): FlightOffersResponse {
        return data;
    }

    handleApiError(err: any): string {
        const code = err?.error?.code || err?.status;
        return (
            errorMessages[code] ||
            'Ismeretlen hiba történt. Kérjük, próbálja újra később.'
        );
    }

    async logToFile(content: any): Promise<void> {
        try {
            const body = { log: content };
            const res = await firstValueFrom(
                this.http.post(environment.backendUrl + 'log', body)
            );
            if (res) {
                console.log('log elküldve');
            }
        } catch (error) {
            console.error('Hiba történt a fájl írása során:', error);
        }
    }

    async logSeatMaptoFile(content: object): Promise<void> {
        try {
            const body = { log: content };
            const res = await firstValueFrom(
                this.http.post(environment.backendUrl + 'log/seatMap', body)
            );
            if (res) {
                console.log('log elküldve');
            }
        } catch (error) {
            console.error('Hiba történt a fájl írása során:', error);
        }
    }
}
