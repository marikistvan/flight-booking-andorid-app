import { Component, computed, OnInit, signal, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Dictionaries, FlightOffer } from "~/app/models/flight-offers-response";
import { SetpassengerComponent } from './set-passenger/set-passenger.component'


@Component({
  selector: "ns-passenger-info",
  templateUrl: "./passenger-info.component.html",
  styleUrls: ["./passenger-info.component.scss"],
})

export class PassengerInfoComponent implements OnInit {
  dictionary: Dictionaries;
  flightOffer: FlightOffer;
  passengerForm = new FormGroup({});
  passengersType: string[] = [];
  rowsCount = "auto";

  controlIndex = 0;

  ngOnInit(): void {
    this.genRows();
    this.setPassengerType();
  }
  constructor(private modalDialogParams: ModalDialogParams, private modalDialogSerivce: ModalDialogService, private viewContainerRef: ViewContainerRef) {
    this.dictionary = modalDialogParams.context.dictionary;
    this.flightOffer = modalDialogParams.context.flight;
  }

  setPassengerInfo() { }

  genRows() {
    for (let i = 0; i < this.flightOffer.travelerPricings.length; i++) {
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
    console.log('passengerId: ' + id);
    const option: ModalDialogOptions = {
      context: id + '. ' + this.passengersType[Number(id)] + ' utas',
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    }
    const result = await this.modalDialogSerivce.showModal(SetpassengerComponent, option);
  }

  isInvalid(controlName: string): boolean {
    const control = this.passengerForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}
