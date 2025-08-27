import { Component, DoCheck, OnInit, signal, Signal, ViewContainerRef, WritableSignal } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { Booking } from '~/app/models/booking';
import { Passenger } from "~/app/models/passenger";
import { TicketLabel } from '~/app/models/ticket-label';
import { FlightTicketComponent } from "./flight-ticket/flight-ticket.component";
import { BookingService } from "~/app/services/booking.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
@Component({
  selector: "ns-flight-ticket-list",
  templateUrl: "./flight-ticket-list.component.html",
  styleUrls: ["./flight-ticket-list.component.scss"],
})

export class FlightTicketListComponent implements OnInit {
  tickets: WritableSignal<Booking[]> = signal([]);
  ticketInfo: TicketLabel[] = [];
  passengersInfo: Passenger[] = [];
  constructor(
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private bookingService: BookingService
  ) {
  }
  async ngOnInit(): Promise<void> {
    const result = await this.bookingService.userBookings();
    this.tickets.set(result);
    this.populateTicketRows();
  }

  populateTicketRows() {
    let index = 0;
    if (this.tickets().length === 0) {
      console.log('nincs adat :)');
      return;
    }
    this.tickets().forEach((ticket) => {
      ticket.passengers?.forEach((passenger) => {

        passenger.seats?.forEach((seat) => {
          this.ticketInfo.push({
            name: passenger.lastName + ' ' + passenger.firstName,
            iataCode: this.getIataCode(ticket, seat.segmentId),
            seatNumber: seat.seatNumber,
            date: this.geTDate(ticket, seat.segmentId),
            segmentId: seat.segmentId,
            passengerId: passenger.id,
            ticketId: index
          })
        })
      })
      index++;
    })

  }
  getIataCode(ticket: Booking, segmentId: string): string {
    const flight = ticket.flights.find((flight) => flight.segmentId === segmentId);
    return flight.departureIATA + ' ' + flight.arrivalIATA;
  }
  geTDate(ticket: Booking, segmentId: string): string {
    const flight = ticket.flights.find((flight) => flight.segmentId === segmentId);
    return flight.departureDate;
  }
  async openTicket(segmentId: string, passengerId: string, ticketId: number) {
    const ticket = this.tickets()[ticketId];
    const flight = ticket.flights.find((flight) => flight.segmentId === segmentId);
    const passenger = ticket.passengers.find((pass) => pass.id === passengerId);
    const options: ModalDialogOptions = {

      context: {
        flight,
        passenger
      },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };

    const result = await this.modalDialogService.showModal(FlightTicketComponent, options);

  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
