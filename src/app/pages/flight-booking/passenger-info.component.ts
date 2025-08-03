import { Component, computed, OnInit, signal, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Dictionaries, FlightOffer } from "~/app/models/flight-offers-response";
import { SetpassengerComponent } from './set-passenger/set-passenger.component'
import { Passenger } from "~/app/models/passenger";


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
  constructor(private modalDialogParams: ModalDialogParams, private modalDialogSerivce: ModalDialogService, private viewContainerRef: ViewContainerRef) {
    this.dictionary = modalDialogParams.context.dictionary;
    this.flightOffer = modalDialogParams.context.flight;
    this.passengersNumber = this.flightOffer.travelerPricings.length;
  }

  setPassengerInfo() { }

  genRows() {
    for (let i = 0; i < this.passengersNumber; i++) {
      this.rowsCount += ",auto";
    }
    return this.rowsCount;
  }

  onCancel() { }
  submit() { }

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
    const option: ModalDialogOptions = {
      context: id + '. utas (' + this.passengersType[Number(id)-1]+')',
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    }
    await this.modalDialogSerivce.showModal(SetpassengerComponent, option).then((result) => {
      if (result) {
        const [passenger, action] = result;
        console.log('0: ' + JSON.stringify(passenger));
        console.log('1: ' + action);
        this.passengers[Number(id) - 1] = passenger;
        if (action !== 'cancel') {
          this.nextPassenger(Number(id)-1) === 0 ? '' : this.setPassenger(this.nextPassenger(Number(id)-1).toString());
        }
      }
    });
  }

  nextPassenger(previousId: number): number {
    if (this.passengers.length - 1 === previousId) {
      return 0;
    } else {

      return previousId+2;
    }
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
        born: new Date(),
        sex: '',
        baggageType: ''
      }
      this.passengers.push(passenger);
    }
  }
}
