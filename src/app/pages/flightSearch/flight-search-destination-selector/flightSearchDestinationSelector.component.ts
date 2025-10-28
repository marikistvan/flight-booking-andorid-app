import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ItemEventData, TextField } from '@nativescript/core';
import { ModalDialogParams } from '@nativescript/angular';
import { AmadeusService } from '~/app/services/amadeus.service';
import { Location } from '../../../models/location-response';

@Component({
    selector: 'ns-flightSearchDestinationSelectorComponent',
    templateUrl: 'flightSearchDestinationSelector.component.html',
    styleUrls: ['./flightSearchDestinationSelector.component.scss'],
})
export class FlightSearchDestinationSelectorComponent implements OnInit {
    isSearching = signal<boolean>(false);
    searchTerm = signal<string>('');
    context: string = '';
    locations = signal<Location[]>([]);

    constructor(
        private modalDialogParams: ModalDialogParams,
        private amadeusService: AmadeusService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        setTimeout(() => this.changeDetectorRef.detectChanges(), 0);
        this.context = modalDialogParams.context.type;
    }

    ngOnInit(): void { }

    get locationItems(): Location[] {
        return this.locations();
    }

    onSearchTextChanged(event: any) {
        this.searchTerm.set((event.object as TextField).text || '');
        if (this.searchTerm().trim().length > 2) {
            this.isSearching.set(true);
            this.amadeusService
                .getLocations(this.searchTerm().trim())
                .subscribe((response) => {
                    this.isSearching.set(false);
                    this.locations.set(response.data);
                });
        }
    }

    formatName(detailedName: string, iataCode: string): string {
        const parts = detailedName.split('/');
        return parts.join(', ') + ` (${iataCode})`;
    }

    onDelete() {
        this.searchTerm.set('');
    }

    onCancel() {
        this.modalDialogParams.closeCallback('');
    }

    selectAirport(event: ItemEventData) {
        const index = event.index;
        const selected = this.locationItems[index];

        this.modalDialogParams.closeCallback(selected);
    }
}
