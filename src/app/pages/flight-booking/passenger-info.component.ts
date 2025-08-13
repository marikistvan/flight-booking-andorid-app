import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { FormGroup } from "@angular/forms";
import { Dictionaries, FlightOffer } from "~/app/models/flight-offers-response";
import { SetpassengerComponent } from './set-passenger/set-passenger.component';
import { Passenger } from "~/app/models/passenger";
import { AmadeusService } from "~/app/services/amadeus.service";
import seatmap from '~/assets/seatmap.json';
import { FlightSummaryComponent } from "./flight-summary/flight-summary.component";
import { Seatmap } from "~/app/models/seatmap-response";


@Component({
  selector: "ns-passenger-info",
  templateUrl: "./passenger-info.component.html",
  styleUrls: ["./passenger-info.component.scss"],
})

export class PassengerInfoComponent implements OnInit {
  dictionary: Dictionaries;
  flightOffer: FlightOffer;
  passengersNumber: number;
  passengerForm = new FormGroup({});
  passengersType: string[] = [];
  passengers: Passenger[] = [];
  rowsCount = "auto";

  controlIndex = 0;

  ngOnInit(): void {
    this.genRows();
    this.setPassengerType();
    this.setPassengersArray();
  }
  constructor(/*private modalDialogParams: ModalDialogParams,*/
    private modalDialogSerivce: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private amadeusService: AmadeusService
  ) {
    // this.dictionary = modalDialogParams.context.dictionary;
    // this.flightOffer = modalDialogParams.context.flight;
    this.dictionary = this.amadeusService.getMockFlightOffers().dictionaries;
    this.flightOffer = this.amadeusService.getMockFlightOffers().data[1];
    this.passengersNumber = this.flightOffer.travelerPricings.length;
  }

  setPassengerInfo() { }

  genRows() {
    for (let i = 0; i < this.passengersNumber; i++) {
      this.rowsCount += ",auto";
    }
    return this.rowsCount;
  }

  onCancel() {
    //  this.modalDialogParams.closeCallback(null);
  }
  async submit() {
    if (this.isAllDataIsFilledIn()) {
      const option: ModalDialogOptions = {
        context: {
          flightOffer: this.flightOffer,
          dictionaries: this.dictionary,
          passengers: this.passengers,
        },
        fullscreen: true,
        viewContainerRef: this.viewContainerRef
      }
      await this.modalDialogSerivce.showModal(FlightSummaryComponent, option).then((result) => {

      });
    }
  }

  setPassengerType() {
    let index = 0;
    this.flightOffer.travelerPricings.forEach(element => {
      if (element.travelerType === 'ADULT') {
        this.passengersType[index++] = 'felnőtt';
      } else if (element.travelerType === 'CHILD') {
        this.passengersType[index++] = 'gyerkmek';
      } else {
        this.passengersType[index++] = 'csecsemő';
      }
    });
  }
  async setPassenger(id: string) {
    const title = id + '. utas (' + this.passengersType[Number(id) - 1] + ')';
    const passenger: Passenger = this.passengers[Number(id) - 1];
    let arrivalSeatCount = undefined;
    if (this.flightOffer.itineraries.length > 1) {
      arrivalSeatCount = this.flightOffer.itineraries[1].segments.length;
    }
    // const seatMapDatas = (await firstValueFrom(this.amadeusService.getSeatMap(this.flightOffer))).data;
    const seatMapDatas:Seatmap[]=seatmap.data;
    const option: ModalDialogOptions = {
      context: {
        title: title,
        passenger: passenger,
        flightOffer: this.flightOffer,
        seatMap: seatMapDatas
      },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    }
    await this.modalDialogSerivce.showModal(SetpassengerComponent, option).then((result) => {
      if (result) {
        const [passenger, action] = result;
        if (action !== 'cancel') {
          this.passengers[Number(id) - 1] = passenger;
          this.nextPassenger(Number(id) - 1) === 0 ? '' : this.setPassenger(this.nextPassenger(Number(id) - 1).toString());
        }
      }
    });
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
        firstName: '',
        lastName: '',
        born: '',
        sex: '',
        baggageType: '',
        seatNumberWayThere: [],
        seatNumberWayBack:[]
      }
      this.passengers.push(passenger);
    }
  }
}
