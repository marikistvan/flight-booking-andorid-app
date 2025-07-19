import { Component, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application, Dialogs, ItemEventData, ObservableArray, TextField } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, RouterExtensions } from "@nativescript/angular";
import { ModalDialogService } from "@nativescript/angular";
import { AuthService } from "~/app/services/auth.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ViewContainerRef } from "@angular/core";
import { AmadeusService } from "~/app/services/amadeus.service";
import { Location } from '../../../models/location-response'

@Component({
  selector: "ns-flightSearchDestinationSelectorComponent",
  templateUrl: "flightSearchDestinationSelector.component.html",
  styleUrls: ["./flightSearchDestinationSelector.component.scss"],
})

export class FlightSearchDestinationSelectorComponent implements OnInit {
  searchTerm = signal<string>('');
  context: string = "";
  locations = signal<Location[]>([]);
  airports = [
    {
      name: 'New York, NY (JFK)',
      country: 'Egyesült Államok',
    },
    {
      name: 'New York Newark Liberty Intl (EWR)',
      country: 'Egyesült Államok',
    },
  ];
  filteredAirports = [...this.airports];
  constructor(private modalDialogParams: ModalDialogParams, private amadeusService: AmadeusService) {
    this.context = modalDialogParams.context.type;
  }

  ngOnInit(): void {
  }
  get locationItems(): Location[] {
    return this.locations();
  }

  onSearchTextChanged(event: any) {
    this.searchTerm.set((event.object as TextField).text || '');
    if (this.searchTerm().trim().length > 2) {
      this.amadeusService.getLocations(this.searchTerm().trim()).subscribe((response) => {
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
    this.modalDialogParams.closeCallback(null);
  }
  selectAirport(event:  ItemEventData) {
    const index = event.index;
    const selected = this.locationItems[index];

    this.modalDialogParams.closeCallback(selected);
  }
}
