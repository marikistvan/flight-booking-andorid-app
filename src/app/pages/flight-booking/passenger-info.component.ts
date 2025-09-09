import { Component, Input, NO_ERRORS_SCHEMA, OnInit, signal, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService, NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import { FormGroup } from "@angular/forms";
import { Dictionaries, FlightOffer } from "~/app/models/flight-offers-response";
import { SetpassengerComponent } from './set-passenger/set-passenger.component';
import { Passenger } from "~/app/models/passenger";
import { AmadeusService } from "~/app/services/amadeus.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { FlightSearchStateService } from "~/app/services/flight-search-state.service";
import { ActivatedRoute } from "@angular/router";
import { NativeScriptLocalizeModule } from "@nativescript/localize/angular";
import { localize } from "@nativescript/localize";
@Component({
  selector: "ns-passenger-info",
  standalone: true,
  templateUrl: "./passenger-info.component.html",
  styleUrls: ["./passenger-info.component.scss"],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class PassengerInfoComponent implements OnInit {
  isButtonPressed = signal<boolean>(false);
  @Input() flightId: string;
  dictionary: Dictionaries;
  flightOffer: FlightOffer;
  passengersNumber: number;
  passengerForm = new FormGroup({});
  passengersType: string[] = [];
  passengers: Passenger[] = [];
  rowsCount = "auto";

  controlIndex = 0;

  constructor(
    private modalDialogSerivce: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private amadeusService: AmadeusService,
    private searchStateService: FlightSearchStateService,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.flightId = this.route.snapshot.paramMap.get('flightId')!;
    this.dictionary = this.searchStateService.getDictionary();
    this.flightOffer = this.searchStateService.getFlightById(this.flightId);
    this.passengersNumber = this.flightOffer.travelerPricings.length;
    this.genRows();
    this.setPassengerType();
    this.setPassengersArray();
  }

  setPassengerInfo() { }

  genRows() {
    for (let i = 0; i < this.passengersNumber; i++) {
      this.rowsCount += ",auto";
    }
    return this.rowsCount;
  }

  onCancel() {
    this.routerExtensions.back();
  }
  async submit() {
    if (this.isAllDataIsFilledIn()) {
      this.isButtonPressed.set(true);
      this.searchStateService.setPassengers(this.passengers);
      this.routerExtensions.navigate(['flightSummary', this.flightOffer.id]);
      this.isButtonPressed.set(false);
    }
  }

  setPassengerType() {
    let index = 0;
    this.flightOffer.travelerPricings.forEach(element => {
      if (element.travelerType === 'ADULT') {
        this.passengersType[index++] = localize('passengerCategory.adult');
      } else if (element.travelerType === 'CHILD') {
        this.passengersType[index++] = localize('passengerCategory.child');
      } else {
        this.passengersType[index++] = localize('passengerCategory.infant');
      }
    });
  }
  async setPassenger(id: string) {
    const title = `${id} ${localize('passengerInfo.passenger')} (${this.passengersType[Number(id) - 1]})`;
    const passenger: Passenger = this.passengers[Number(id) - 1];
    let arrivalSeatCount: number | undefined = undefined;

    if (this.flightOffer.itineraries.length > 1) {
      arrivalSeatCount = this.flightOffer.itineraries[1].segments.length;
    }
    this.isButtonPressed.set(true);
    try {
      const seatMapResponse = await firstValueFrom(
        this.amadeusService.getSeatMap(this.flightOffer)
      );

      const seatMapDatas = seatMapResponse.data;

      const option: ModalDialogOptions = {
        context: {
          id,
          title,
          passenger,
          flightOffer: this.flightOffer,
          seatMap: seatMapDatas
        },
        fullscreen: true,
        viewContainerRef: this.viewContainerRef
      };
      await this.modalDialogSerivce.showModal(SetpassengerComponent, option).then((result) => {
        this.isButtonPressed.set(false);
        if (result) {
          const [updatedPassenger, action] = result;
          if (action !== 'cancel') {
            this.passengers[Number(id) - 1] = updatedPassenger;


            const next = this.nextPassenger(Number(id) - 1);
            if (next !== 0) {
              this.setPassenger(next.toString());
            }
          }
        }
      });

    } catch (err: any) {
      this.isButtonPressed.set(false);
      console.error("SeatMap API hiba:", err);

      let userMessage = localize('general.errorOccured');
      if (err?.error?.code) {
        userMessage = this.amadeusService.handleApiError(err);
      } else if (err.status === 404) {
        userMessage = localize('passengerInfo.notFoundSeatMap');
      } else if (err.status === 500) {
        userMessage = localize('passengerInfo.serverError');
      }

      alert(userMessage);
    }
  }


  nextPassenger(previousId: number): number {
    if (this.passengers.length - 1 === previousId) {
      return 0;
    } else {
      return previousId + 2;
    }
  }

  isAllDataIsFilledIn(): boolean {
    for (let i = 0; i < this.passengersNumber; i++) {
      if (this.passengers[i].firstName === '') {
        return false;
      }
    }
    return true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.passengerForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  setPassengersArray() {
    for (let i = 0; i < this.passengersNumber; i++) {
      const passenger: Passenger = {
        id: '',
        firstName: '',
        lastName: '',
        born: '',
        sex: '',
        baggageType: '',
        seats: []
      }
      this.passengers.push(passenger);
    }
  }
}
