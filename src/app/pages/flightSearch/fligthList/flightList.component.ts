import { Component, Input, Signal, signal, WritableSignal } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { Dictionaries, FlightOffer, FlightOffersResponse } from "~/app/models/flight-offers-response";


@Component({
  selector: "ns-flight-list",
  templateUrl: "./flightList.component.html",
  styleUrls: ["./flightList.component.scss"],
})
export class FlightListComponent {
  mainArrivalCity:string;
  public flightOffers: FlightOffer[];
  dictionary:Dictionaries;
  constructor(private modalDialogParams: ModalDialogParams) {
    this.flightOffers = this.modalDialogParams.context.flightOffers;
     this.mainArrivalCity=this.modalDialogParams.context.toPlace;
     this.dictionary=this.modalDialogParams.context.dictionary;
  }
  onCancel() {
    //this.modalDialogParams.closeCallback(null);
  }
}
