import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application, Dialogs, ObservableArray } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, RouterExtensions } from "@nativescript/angular";
import { ModalDialogService } from "@nativescript/angular";
import { AuthService } from "~/app/services/auth.service";
import { FormControl, FormGroup,ReactiveFormsModule, Validators } from "@angular/forms";
import { ViewContainerRef } from "@angular/core";

@Component({
  selector: "ns-flightSearchDestinationSelectorComponent",
  templateUrl: "flightSearchDestinationSelector.component.html",
  styleUrls: ["./flightSearchDestinationSelector.component.scss"],
})

export class FlightSearchDestinationSelectorComponent implements OnInit {
  searchTerm = '';
  context:string="";
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
  constructor(private modalDialogParams: ModalDialogParams) {
    this.context=modalDialogParams.context.type;
  }

  ngOnInit(): void {
  }
  onSearchTextChanged(event:any){
    const query = event.value.toLowerCase();
    this.filteredAirports = this.airports.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.country.toLowerCase().includes(query) ||
      a.country.toLowerCase().includes(query)
    );
  }
  onDelete(){
    this.searchTerm="";
  }
  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }
  selectAirport(event:any){
    const selected = this.filteredAirports[event.index];
    this.modalDialogParams.closeCallback(selected.name);
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
