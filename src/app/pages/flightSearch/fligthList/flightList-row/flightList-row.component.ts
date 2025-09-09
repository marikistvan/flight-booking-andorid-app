import { CommonModule, DatePipe } from "@angular/common";
import { Component, Input, NO_ERRORS_SCHEMA, OnInit, signal } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import { Dictionaries, FlightOffer } from "~/app/models/flight-offers-response";
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { localize } from "@nativescript/localize";

@Component({
  providers: [DatePipe],
  standalone: true,
  selector: "ns-flight-list-row",
  templateUrl: "./flightList-row.component.html",
  styleUrls: ["./flightList-row.component.scss"],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptLocalizeModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FlightListRowComponent implements OnInit {
  @Input({ required: true }) flight!: FlightOffer;
  @Input({ required: true }) dictionary!: Dictionaries;
  halfPrice: number;
  summary = signal('');
  stapOver = signal('');
  isSearchStarted = signal(false);
  constructor(
    public datePipe: DatePipe,
    private routerExtensions: RouterExtensions
  ) { }
  ngOnInit(): void {
    this.halfPrice = Number(this.flight.price.total) / 2;
    this.summary.set(localize('general.summary'));
    this.stapOver.set(localize('flightListRow.stepOver'));
  }

  formatDuration(duration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = duration.match(regex);
    if (!match) return duration;
    const hours = match[1] ? `${+match[1]} ${localize('general.hour')}` : '';
    const minutes = match[2] ? `${+match[2]} ${localize('general.minute')}` : '';
    return [hours, minutes].filter(Boolean).join(' ');
  }
  async select() {
    this.isSearchStarted.set(true);
    this.routerExtensions.navigate(['flightDetails', this.flight.id]);
    this.isSearchStarted.set(false);
  }
}
