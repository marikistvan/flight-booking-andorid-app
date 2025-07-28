import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { FlightOffer } from "~/app/models/flight-offers-response";
import { FlightDetailsComponent } from "./flight-details/flight-details.component";

@Component({
  providers: [DatePipe],
  selector: "ns-flight-list-row",
  templateUrl: "./flightList-row.component.html",
  styleUrls: ["./flightList-row.component.scss"],
})
export class FlightListRowComponent implements OnInit {
  @Input({ required: true }) flight!: FlightOffer;
  halfPrice: number;
  constructor(
    public datePipe: DatePipe,
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef) {}
  ngOnInit(): void {
    this.halfPrice = Number(this.flight.price.total) / 2;
  }

  formatDuration(duration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = duration.match(regex);
    if (!match) return duration;
    const hours = match[1] ? `${+match[1]} óra` : '';
    const minutes = match[2] ? `${+match[2]} perc` : '';
    return [hours, minutes].filter(Boolean).join(' ');
  }
  async select() {
    const options: ModalDialogOptions = {
      context: this.flight,
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(FlightDetailsComponent, options);

    if (result) {
      
    } else {

    }
  }
}
