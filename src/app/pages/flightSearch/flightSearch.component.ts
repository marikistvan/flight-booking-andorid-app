import { Component, computed, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { AmadeusService } from "../../services/amadeus.service";
import { ModalDialogService } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ViewContainerRef } from "@angular/core";
import { FlightSearchDestinationSelectorComponent } from "./flight-search-destination-selector/flightSearchDestinationSelector.component";
import { FlightSearchPassengersSelectorComponent } from "./flight-search-passengers-selector/flightSearchPassengersSelector.component";
import { PassengerCategory } from '../../models/passenger-category';
import { LocationResponse } from "~/app/models/location-response";
import { FlightOffersResponse } from "~/app/models/flight-offers-response";
import { DatePipe } from "@angular/common";
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
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
  maxSearchNumber: string = '20';
  isSearchStarted = signal(false);
  passangerCategoryArray: PassengerCategory[] = [
    { id: 'adult', ageCategory: 'Felnőtt', description: '18 év felett', count: 1 },
    { id: 'child', ageCategory: 'Gyerek', description: '2–12 év között', count: 0 },
    { id: 'infant', ageCategory: 'Csecsemő', description: '0–2 év között', count: 0 },
  ];
  searchFormGroup = new FormGroup({
    tripType: new FormControl(null, Validators.required),
    fromIATACode: new FormControl<string | null>(null, Validators.required),
    fromPlace: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    toPlaceIATACode: new FormControl(null, Validators.required),
    toPlace: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    fromDate: new FormControl<Date | null>(null, Validators.required),
    returnDate: new FormControl<Date | null>(null),
    passengers: new FormControl<number | null>(1, Validators.required)
  })
  todayDate: string;
  isDateWrong = signal(false);
  constructor(
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private amadeusService: AmadeusService,
    private datePipe: DatePipe,
    private searchStateService: FlightSearchStateService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    this.todayDate = this.getTodayDate();
    this.searchFormGroup.get('fromDate')?.valueChanges.subscribe(() => this.validateDates());
    this.searchFormGroup.get('returnDate')?.valueChanges.subscribe(() => this.validateDates());
  }
  validateDates() {
    const fromDate = this.searchFormGroup.get('fromDate')?.value;
    const returnDate = this.searchFormGroup.get('returnDate')?.value;

    const wrong = fromDate !== null && returnDate !== null && fromDate > returnDate;
    this.isDateWrong.set(wrong);
  }
  get tripType() {
    return this.searchFormGroup.get('tripType').value;
  }

  private getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  isInvalid(controlName: string): boolean {
    const control = this.searchFormGroup.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  async submitFlightSearch() {
    if (this.searchFormGroup.invalid) {
      this.searchFormGroup.markAllAsTouched();
      return;
    }
    if (this.isDateWrong()) { return; }
    try {
      this.isSearchStarted.set(true);

      const response = await firstValueFrom(
        this.amadeusService.searchFlights(
          this.searchFormGroup.get('fromIATACode').value,
          this.searchFormGroup.get('toPlaceIATACode').value,
          this.datePipe.transform(this.searchFormGroup.get('fromDate').value, 'yyyy-MM-dd'),
          this.passangerCategoryArray[0].count.toString(),
          this.maxSearchNumber,
          this.searchFormGroup.get('returnDate').value !== undefined ? this.datePipe.transform(this.searchFormGroup.get('returnDate').value, 'yyyy-MM-dd') : undefined,
          this.passangerCategoryArray[1].count.toString(),
          this.passangerCategoryArray[2].count.toString()
        )
      )
      const toPlace = this.searchFormGroup.get('toPlace').value.split(',')[0];
      this.searchStateService.setFlights(response.data, response.dictionaries, toPlace);
      this.routerExtensions.navigate(['flightList']);
    } catch (error) {
      console.error("Hiba a keresés során:", error);
      this.isSearchStarted.set(false);
    } finally {
      this.isSearchStarted.set(false);
    }
  }

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
