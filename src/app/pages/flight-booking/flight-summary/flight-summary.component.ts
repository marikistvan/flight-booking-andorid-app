import { Component } from "@angular/core"
import { ModalDialogParams } from "@nativescript/angular"
import { Dictionaries, FlightOffer } from '~/app/models/flight-offers-response'
import { Passenger } from "~/app/models/passenger";
import flightoffer from '~/assets/flight-offer-sample.json'
import passengers from '~/assets/passenger-data.json'

@Component({
  selector: "ns-flight-summary",
  templateUrl: "./flight-summary.component.html",
  styleUrls: ["./flight-summary.component.scss"],
})

export class FlightSummaryComponent {
  flightOffer: FlightOffer;
  dictionary: Dictionaries;
  isShowFlightDetails: boolean = true;
  passengers: Passenger[] = [];


  constructor(private modalDialogParams: ModalDialogParams) {
    this.flightOffer = this.modalDialogParams.context.flightOffer;
    this.passengers = this.modalDialogParams.context.passengers;
    this.dictionary = this.modalDialogParams.context.dictionaries;
    //  this.flightOffer=flightoffer.data[0];
    //   this.dictionary=flightoffer.dictionaries;
    //    this.passengers=passengers;
  }
  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }
  testOC() {
    this.isShowFlightDetails = !this.isShowFlightDetails;
  }
}
