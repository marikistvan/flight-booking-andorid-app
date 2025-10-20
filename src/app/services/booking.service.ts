import { Injectable, OnInit } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import { Booking, Flight } from '../models/booking';
import { AuthService } from './auth.service';
import { FlightOffer } from '../models/flight-offers-response';
import { Passenger } from '../models/passenger';
import '@nativescript/firebase-auth';

@Injectable({
    providedIn: 'root',
})
export class BookingService {
    private _db = firebase().firestore();

    constructor(private authService: AuthService) {}

    async createBooking(flightOffer: FlightOffer, passengers: Passenger[]) {
        if (!this.authService.currentUser) {
            console.log('ki van jelentkezve a fhsz');
            return {
                success: false,
                error: 'Nincs bejelnetkezve a felhasználó',
            };
        }

        const flights: Flight[] = this.setFlights(flightOffer);

        const bookingData: Booking = this.setBookingData(flights, passengers);

        try {
            const userRef = this._db
                .collection('users')
                .doc(bookingData.userId)
                .collection('bookings')
                .doc();

            await userRef.set(bookingData);
            console.log('Booking sikeresen létrehozva');
            return { success: true, bookingId: bookingData.userId };
        } catch (error) {
            console.error('Hiba történt a booking mentésekor:', error);
            return { success: false, error };
        }
    }

    async userBookings(): Promise<Booking[]> {
        if (!this.authService.currentUser) {
            console.log('Nincs bejelentkezve a felhasználó');
            return [];
        }

        const snapshot = await this._db
            .collection('users')
            .doc(this.authService.currentUser.uid)
            .collection('bookings')
            .orderBy('createdAt', 'desc')
            .get();

        const bookings: Booking[] = [];

        snapshot.forEach((doc) => {
            bookings.push(doc.data() as Booking);
        });
        return bookings;
    }

    private setFlights(flightOffer: FlightOffer): Flight[] {
        return flightOffer.itineraries.flatMap((itinerary) =>
            itinerary.segments.map((segment) => ({
                flightNumber: segment.number,
                departureDate: segment.departure.at,
                arrivalDate: segment.arrival.at,
                airline: segment.carrierCode,
                departureIATA: segment.departure.iataCode,
                arrivalIATA: segment.arrival.iataCode,
                segmentId: segment.id,
            }))
        );
    }

    private setBookingData(
        flights: Flight[],
        passengers: Passenger[]
    ): Booking {
        return {
            userId: this.authService.currentUser.uid,
            createdAt: new Date().toISOString(),
            flights: flights,
            passengers: passengers,
        };
    }
}
