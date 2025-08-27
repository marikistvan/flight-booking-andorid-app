import { CommonModule } from "@angular/common";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import { FlightSearchStateService } from "~/app/services/flight-search-state.service";
import { FlightListRowComponent } from "./flightList-row/flightList-row.component";

@Component({
  standalone: true,
  selector: "ns-flight-list",
  templateUrl: "./flightList.component.html",
  styleUrls: ["./flightList.component.scss",],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    FlightListRowComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]

})
export class FlightListComponent{
  constructor(
    private routerExtensions: RouterExtensions,
    public searchService: FlightSearchStateService
  ) {}
  
  onCancel() {
    this.routerExtensions.back();
  }
}
