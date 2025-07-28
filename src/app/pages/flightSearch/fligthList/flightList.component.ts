import { Component, Input, Signal, signal, WritableSignal } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { FlightOffer } from "~/app/models/flight-offers-response";


@Component({
  selector: "ns-flight-list",
  templateUrl: "./flightList.component.html",
  styleUrls: ["./flightList.component.scss"],
})
export class FlightListComponent {
  public flightOffers: FlightOffer[];
  constructor(private modalDialogParams: ModalDialogParams) {
    this.flightOffers = modalDialogParams.context;
  }
  onCancel() {
    //this.modalDialogParams.closeCallback(null);
  }
}
