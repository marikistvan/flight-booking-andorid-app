import { Component, Input, NO_ERRORS_SCHEMA, OnInit, signal } from '@angular/core';
import {
    NativeScriptCommonModule,
    RouterExtensions,
} from '@nativescript/angular';
import { Dictionaries, FlightOffer } from '~/app/models/flight-offers-response';
import { Passenger } from '~/app/models/passenger';
import { BookingService } from '~/app/services/booking.service';
import { FlightDetailsComponent } from '../../flightSearch/fligthList/flightList-row/flight-details/flight-details.component';
import { ActivatedRoute } from '@angular/router';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
import { CommonModule } from '@angular/common';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { LocalNotifications } from '@nativescript/local-notifications';

@Component({
    selector: 'ns-flight-summary',
    standalone: true,
    templateUrl: './flight-summary.component.html',
    styleUrls: ['./flight-summary.component.scss'],
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        PassengerDetailsComponent,
        FlightDetailsComponent,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class FlightSummaryComponent implements OnInit {
    flightOffer: FlightOffer;
    dictionary: Dictionaries;
    isShowFlightDetails: boolean = true;
    passengers: Passenger[] = [];
    @Input() flightId: string;
    flightPrice = signal("");
    flightSymbol = signal("");
    halfPrice = signal(0);

    constructor(
        private searchStateService: FlightSearchStateService,
        private bookingService: BookingService,
        private route: ActivatedRoute,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.flightId = this.route.snapshot.paramMap.get('flightId')!;
        this.flightOffer =
            this.searchStateService.getFlightById(
                this.flightId
            );
        this.passengers = this.searchStateService.getPassengers();
        this.dictionary = this.searchStateService.getDictionary();
        this.flightPrice.set(this.searchStateService.getTotalPriceByIdWithSpecificCurrency(this.flightId));
        this.flightSymbol.set(this.searchStateService.getPriceSymbol());
        this.halfPrice.set(Number(this.flightPrice) / 2);
    }
    onCancel() {
        this.routerExtensions.back();
    }
    testOC() {
        this.isShowFlightDetails = !this.isShowFlightDetails;
    }
    async booking() {
        const result = await this.bookingService.createBooking(
            this.flightOffer,
            this.passengers
        );
        if (!result.success) {
            console.log(result.error);
        } else {
            console.log('siker');
            this.onBookingSuccess();
            this.routerExtensions.navigate(['flightTicketList']);
        }
    }

    onBookingSuccess() {
        LocalNotifications.schedule([
            {
                id: 300,
                title: 'Foglalás sikeres!',
                body: 'Az Ön repülőjegy foglalása sikeresen megtörtént.',
                at: new Date(new Date().getTime() + 1000),
                sound: 'default',
            },
        ])
            .then((scheduledIds) =>
                console.log('Értesítés ütemezve, ID:', scheduledIds)
            )
            .catch((err) => console.log('Hiba az értesítésnél:', err));
    }
}
