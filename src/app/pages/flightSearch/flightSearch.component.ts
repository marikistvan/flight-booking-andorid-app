import { Component, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { AmadeusService } from "../../services/amadeus.service";
import { ModalDialogService } from "@nativescript/angular";
import { AuthService } from "~/app/services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ViewContainerRef } from "@angular/core";
import { FlightSearchDestinationSelectorComponent } from "./flight-search-destination-selector/flightSearchDestinationSelector.component";
import { FlightSearchPassengersSelectorComponent } from "./flight-search-passengers-selector/flightSearchPassengersSelector.component";
import { PassengerCategory } from '../../models/passenger-category';
import { LocationResponse } from "~/app/models/location-response";
import { Dictionaries, FlightOffersResponse } from "~/app/models/flight-offers-response";
import { FlightListComponent } from "./fligthList/flightList.component";
import { DatePipe } from "@angular/common";
import { firstValueFrom } from 'rxjs';

@Component({
  providers: [DatePipe],
  selector: "ns-flightSearch",
  templateUrl: "./flightSearch.component.html",
  styleUrls: ["./flightSearch.component.scss"],
})

export class FlightSearchComponent implements OnInit {
  tripTypes: Array<string> = ['Egyirányú', 'Oda-Vissza'];
  flightOffers: FlightOffersResponse;
  isSearchStarted = signal(false);
  passangerCategoryArray: PassengerCategory[] = [
    { id: 'adult', ageCategory: 'Felnőtt', description: '18 év felett', count: 1 },
    { id: 'youth', ageCategory: 'Fiatal', description: '12–17 év között', count: 0 },
    { id: 'child', ageCategory: 'Gyerek', description: '2–12 év között', count: 0 },
    { id: 'infant', ageCategory: 'Csecsemő', description: '0–2 év között', count: 0 },
  ];
  searchFormGroup = new FormGroup({
    tripType: new FormControl<string | null>(null, Validators.required),
    fromIATACode: new FormControl<string | null>(null, Validators.required),
    fromPlace: new FormControl<string | null>(null, Validators.required),
    toPlaceIATACode: new FormControl<string | null>(null, Validators.required),
    toPlace: new FormControl<string | null>(null, Validators.required),
    fromDate: new FormControl<Date | null>(null, Validators.required),
    returnDate: new FormControl<Date | null>(null),
    passengers: new FormControl<number | null>(1, Validators.required)
  })
  todayDate: string;
  constructor(
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private amadeusService: AmadeusService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.todayDate = this.getTodayDate();
  }

  get tripType() {
    return this.searchFormGroup.get('tripType').value;
  }

  getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }


  async submitFlightSearch() {
    try {
      this.isSearchStarted.set(true);

      const response = await firstValueFrom(
        this.amadeusService.searchFlights(
          this.searchFormGroup.get('fromIATACode').value,
          this.searchFormGroup.get('toPlaceIATACode').value,
          this.datePipe.transform(this.searchFormGroup.get('fromDate').value, 'yyyy-MM-dd'),
          this.datePipe.transform(this.searchFormGroup.get('returnDate').value, 'yyyy-MM-dd'),
          '1',
          '1',
          '20'
        )
      );

      this.flightOffers = response;
      const options: ModalDialogOptions = {
        context: {
          flightOffers: response.data,
          dictionary:response.dictionaries,
          toPlace: this.searchFormGroup.get('toPlace').value.split(',')[0],
        },
        fullscreen: true,
        viewContainerRef: this.viewContainerRef
      };

      const result = await this.modalDialogService.showModal(FlightListComponent, options);

      this.isSearchStarted.set(false);

    } catch (error) {
      console.error("Hiba a keresés során:", error);
      this.isSearchStarted.set(false);
    }
  }


  /* if (this.searchFormGroup.get('formDate').value!==undefined&&
   this.searchFormGroup.get('returnDate').value!==undefined &&
   this.searchFormGroup.get('fromDate').value > this.searchFormGroup.get('returnDate').value) {
     console.log("Nem megfelelő a dátum kiválasztása");
   }
   else if (!this.searchFormGroup.invalid) {
     this.flightOffers = this.amadeusService.getMockFlightOffers();
   
     const options: ModalDialogOptions = {
       context:this.flightOffers.data,
       fullscreen: true,
       viewContainerRef: this.viewContainerRef
     };
     const result = await this.modalDialogService
       .showModal(FlightListComponent, options);
   
     if (result) {
     }
   
   } else {
     console.log("invalid a form");
   }
  }*/
  openTripTypePicker() {
    action({
      message: 'Válassz utazási típust',
      cancelButtonText: 'Mégse',
      actions: this.tripTypes
    }).then(result => {
      if (result !== 'Mégse') {
        this.searchFormGroup.get('tripType').setValue(result);
        if (result === 'Egyirányú') {
          this.searchFormGroup.get('returnDate')?.setValue(null);
        }
      }
    });
  }
  async selectPassengers() {
    const options: ModalDialogOptions = {
      context: this.passangerCategoryArray,
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(FlightSearchPassengersSelectorComponent, options);

    if (result as PassengerCategory[]) {
      this.passangerCategoryArray = result;
      let sum = 0;
      this.passangerCategoryArray.forEach(element => {
        sum += element.count;
      });
      this.searchFormGroup.get('passengers')?.setValue(sum);
    }
  }

  async chooseDestination(type: 'from' | 'to'): Promise<void> {

    const controlName = type === 'from' ? 'fromPlace' : 'toPlace';

    const options: ModalDialogOptions = {
      context: { type },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(FlightSearchDestinationSelectorComponent, options);

    if (result as LocationResponse) {
      if (controlName === 'fromPlace') {
        this.searchFormGroup.get('fromIATACode').setValue(result.iataCode);
      } else {
        this.searchFormGroup.get('toPlaceIATACode').setValue(result.iataCode);
      }
      this.searchFormGroup.get(controlName)?.setValue(this.formatName(result.detailedName, result.iataCode));
    }
  }

  formatName(detailedName: string, iataCode: string): string {
    const parts = detailedName.split('/');
    return parts.join(', ') + ` (${iataCode})`;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
