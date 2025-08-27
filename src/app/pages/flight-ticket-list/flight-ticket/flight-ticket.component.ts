import { DatePipe } from "@angular/common";
import { Component, OnInit, signal, Signal } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { ModalDialogParams } from "@nativescript/angular";
import { Flight } from "~/app/models/booking";
import { Passenger } from "~/app/models/passenger";
import data from '~/assets/iata_data.json'

@Component({
  providers:[DatePipe],
  selector: "ns-flight-ticket",
  templateUrl: "./flight-ticket.component.html",
  styleUrls: ["./flight-ticket.component.scss"],
})

export class FlightTicketComponent implements OnInit{
  barcodeUrl = 'https://barcodeapi.org/api/auto/' + 'ideaszoveg';
  departureCity:string;
  arrivalCity:string;
  flight: Flight;
  passenger: Passenger;
  seatNumber:string;
  airLine:string;
  constructor(private modalDialogParams: ModalDialogParams,public datePipe:DatePipe) {
    const context = modalDialogParams.context;
    this.flight = context.flight;
    this.passenger = context.passenger;
  }
  ngOnInit(): void {
    this.departureCity=data[this.flight.departureIATA]?.city ?? '';
    this.arrivalCity=data[this.flight.arrivalIATA]?.city ?? '';
    this.seatNumber=this.passenger.seats.find((seat)=>seat.segmentId===this.flight.segmentId).seatNumber;
    this.airLine=data[this.flight.departureIATA]?.airport ?? '';
  }


}
