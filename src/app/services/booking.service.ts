import { Injectable, OnInit } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import { Booking } from '../models/booking';
import { Firestore } from '@nativescript/firebase-firestore';
import { AuthService } from './auth.service';
import '@nativescript/firebase-auth';

@Injectable({
    providedIn: 'root',
})
export class BookingSerivce {
    constructor(private authService: AuthService) { }
    async createBooking() {
        if (!this.authService.currentUser) { return; }
        const bookingData: Booking = {
            bookingId: 'ABC123XYZ',
            userId: this.authService.currentUser.uid.toString(),
            createdAt: new Date().toISOString(),
            flights: [
                {
                    flightNumber: 'LH123',
                    departureDate: '2025-09-01T08:30:00Z',
                    arrivalDate: '2025-09-01T11:00:00Z',
                    airline: 'Lufthansa',
                    departureIATA: 'BUD',
                    arrivalIATA: 'FRA'
                }
            ],
            passengers: [
                {
                    fullName: 'Kiss Péter',
                    birthDate: '1990-05-12',
                    gender: 'F',
                    baggage: '1x23kg',
                    seats: { LH123: '12A' }
                }
            ]
        };
    }
}
