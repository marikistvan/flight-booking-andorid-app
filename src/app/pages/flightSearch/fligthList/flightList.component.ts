import { Component, NO_ERRORS_SCHEMA, OnChanges, OnInit, signal, Signal, SimpleChanges, WritableSignal } from '@angular/core';
import {
    NativeScriptCommonModule,
    RouterExtensions,
} from '@nativescript/angular';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
import { FlightListRowComponent } from './flightList-row/flightList-row.component';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { Dictionaries, FlightOffer } from '~/app/models/flight-offers-response';
import { UserService } from '~/app/services/user.service';

@Component({
    standalone: true,
    selector: 'ns-flight-list',
    templateUrl: './flightList.component.html',
    styleUrls: ['./flightList.component.scss'],
    imports: [
        NativeScriptCommonModule,
        FlightListRowComponent,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class FlightListComponent implements OnInit, OnChanges {
    flightsData: WritableSignal<FlightOffer[]> = signal<FlightOffer[]>([]);
    constructor(
        private routerExtensions: RouterExtensions,
        public searchService: FlightSearchStateService
    ) { }

    async ngOnChanges(): Promise<void> {
        const flights = await this.searchService.getFlightOffersWithSpecificCurrency();
        this.flightsData.set(flights);
    }

    async ngOnInit(): Promise<void> {
        const flights = await this.searchService.getFlightOffersWithSpecificCurrency();
        this.flightsData.set(flights);
    }

    onCancel() {
        this.routerExtensions.back();
    }
}
