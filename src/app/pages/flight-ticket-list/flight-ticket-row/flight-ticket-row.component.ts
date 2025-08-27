import { DatePipe } from "@angular/common";
import { Component, Input, signal, Signal } from "@angular/core";
import { Booking } from '~/app/models/booking';
import { TicketLabel } from "~/app/models/ticket-label";
@Component({
  providers: [DatePipe],
  selector: "ns-flight-ticket-row",
  templateUrl: "./flight-ticket-row.component.html",
  styleUrls: ["./flight-ticket-row.component.scss"],
})

export class FlightTicketRowComponent {
  @Input({ required: true }) ticket: TicketLabel;
  constructor(public datePipe:DatePipe) {
  }


}
