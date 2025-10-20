import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import {
    NativeScriptCommonModule,
    RouterExtensions,
} from '@nativescript/angular';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
import { FlightListRowComponent } from './flightList-row/flightList-row.component';
import { localize } from '@nativescript/localize';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { Dictionaries, FlightOffer } from '~/app/models/flight-offers-response';

@Component({
    standalone: true,
    selector: 'ns-flight-list',
    templateUrl: './flightList.component.html',
    styleUrls: ['./flightList.component.scss'],
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        FlightListRowComponent,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class FlightListComponent implements OnInit {
    flightsData: FlightOffer[];
    constructor(
        private routerExtensions: RouterExtensions,
        public searchService: FlightSearchStateService
    ) {}

    async ngOnInit(): Promise<void> {
        this.flightsData =
            await this.searchService.getFlightOffersWithSpecificCurrency();
    }

    onCancel() {
        this.routerExtensions.back();
    }
}
