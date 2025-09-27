import { Component, computed, OnInit, signal } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { action, Application } from '@nativescript/core';
import { ModalDialogOptions, RouterExtensions } from '@nativescript/angular';
import { AmadeusService } from '../../services/amadeus.service';
import { ModalDialogService } from '@nativescript/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { FlightSearchDestinationSelectorComponent } from './flight-search-destination-selector/flightSearchDestinationSelector.component';
import { FlightSearchPassengersSelectorComponent } from './flight-search-passengers-selector/flightSearchPassengersSelector.component';
import { PassengerCategory } from '../../models/passenger-category';
import { LocationResponse } from '~/app/models/location-response';
import { FlightOffersResponse } from '~/app/models/flight-offers-response';
import { DatePipe } from '@angular/common';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
import { firstValueFrom } from 'rxjs';
import { localize } from '@nativescript/localize';
import { getString } from '@nativescript/core/application-settings';

@Component({
  providers: [DatePipe],
  selector: 'ns-flightSearch',
  templateUrl: './flightSearch.component.html',
  styleUrls: ['./flightSearch.component.scss'],
})
export class FlightSearchComponent implements OnInit {
  oneWay = localize('flightSearch.oneWay');
  roundTrip = localize('flightSearch.roundTrip');
  tripTypes: Array<string> = [this.oneWay, this.roundTrip];
  flightOffers: FlightOffersResponse;
  maxSearchNumber: string = '20';
  isSearchStarted = signal(false);
  passengerCategories: PassengerCategory[] = [
    {
      id: 'adult',
      ageCategory: localize('passengerCategory.adult'),
      description: localize('passengerCategory.adultDes'),
      count: 1,
    },
    {
      id: 'child',
      ageCategory: localize('passengerCategory.child'),
      description: localize('passengerCategory.childDes'),
      count: 0,
    },
    {
      id: 'infant',
      ageCategory: localize('passengerCategory.infant'),
      description: localize('passengerCategory.infantDes'),
      count: 0,
    },
  ];
  searchFormGroup = new FormGroup({
    tripType: new FormControl(null, Validators.required),
    fromIATACode: new FormControl<string | null>(null, Validators.required),
    fromPlace: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    toPlaceIATACode: new FormControl(null, Validators.required),
    toPlace: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    fromDate: new FormControl<Date | null>(null, Validators.required),
    returnDate: new FormControl<Date | null>(null),
    passengers: new FormControl<number | null>(1, Validators.required),
  });
  todayDate: string;
  isDateWrong = signal(false);
  constructor(
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private amadeusService: AmadeusService,
    private datePipe: DatePipe,
    private searchStateService: FlightSearchStateService,
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    this.todayDate = this.getTodayDate();
    this.searchFormGroup
      .get('fromDate')
      ?.valueChanges.subscribe(() => this.validateDates());
    this.searchFormGroup
      .get('returnDate')
      ?.valueChanges.subscribe(() => this.validateDates());
    this.searchFormGroup
      .get('fromPlace')
      ?.setValue(getString('defaultDestiontion', ''));
    this.searchFormGroup
      .get('fromIATACode')
      ?.setValue(getString('defaultDestiontionIATACode', ''));
  }
  validateDates() {
    const fromDate = this.searchFormGroup.get('fromDate')?.value;
    const returnDate = this.searchFormGroup.get('returnDate')?.value;

    const wrong =
      fromDate !== null && returnDate !== null && fromDate > returnDate;
    this.isDateWrong.set(wrong);
  }
  get tripType() {
    return this.searchFormGroup.get('tripType').value;
  }

  private getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
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
    if (this.isDateWrong()) {
      return;
    }
    try {
      this.isSearchStarted.set(true);

      const response = await firstValueFrom(
        this.amadeusService.searchFlights(
          this.searchFormGroup.get('fromIATACode').value,
          this.searchFormGroup.get('toPlaceIATACode').value,
          this.datePipe.transform(
            this.searchFormGroup.get('fromDate').value,
            'yyyy-MM-dd'
          ),
          this.passengerCategories[0].count.toString(),
          this.maxSearchNumber,
          this.searchFormGroup.get('returnDate').value !== undefined
            ? this.datePipe.transform(
              this.searchFormGroup.get('returnDate').value,
              'yyyy-MM-dd'
            )
            : undefined,
          this.passengerCategories[1].count.toString(),
          this.passengerCategories[2].count.toString()
        )
      );
      const toPlace = this.searchFormGroup
        .get('toPlace')
        .value.split(',')[0];
      await this.searchStateService.setFlights(
        response.data,
        response.dictionaries,
        toPlace
      );
      this.routerExtensions.navigate(['flightList']);
    } catch (error) {
      console.error('Hiba a keresés során:', error);
      this.isSearchStarted.set(false);
    } finally {
      this.isSearchStarted.set(false);
    }
  }

  openTripTypePicker() {
    action({
      message: localize('flightSearch.tripPickerMessage'),
      cancelButtonText: localize('general.cancel'),
      actions: this.tripTypes,
    }).then((result) => {
      if (result !== localize('general.cancel')) {
        this.searchFormGroup.get('tripType').setValue(result);
        if (result === localize('flightSearch.oneWay')) {
          this.searchFormGroup.get('returnDate')?.setValue(null);
        }
      }
    });
  }
  async selectPassengers() {
    const options: ModalDialogOptions = {
      context: this.passengerCategories,
      fullscreen: true,
      viewContainerRef: this.viewContainerRef,
    };
    const result = await this.modalDialogService.showModal(
      FlightSearchPassengersSelectorComponent,
      options
    );

    if (result as PassengerCategory[]) {
      this.passengerCategories = result;
      let sum = 0;
      this.passengerCategories.forEach((element) => {
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
      viewContainerRef: this.viewContainerRef,
    };
    const result = await this.modalDialogService.showModal(
      FlightSearchDestinationSelectorComponent,
      options
    );

    if (result as LocationResponse) {
      if (controlName === 'fromPlace') {
        this.searchFormGroup
          .get('fromIATACode')
          .setValue(result.iataCode);
      } else {
        this.searchFormGroup
          .get('toPlaceIATACode')
          .setValue(result.iataCode);
      }
      this.searchFormGroup
        .get(controlName)
        ?.setValue(
          this.formatName(result.detailedName, result.iataCode)
        );
    }
  }

  formatName(detailedName: string, iataCode: string): string {
    const parts = detailedName.split('/');
    return parts.join(', ') + ` (${iataCode})`;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}
