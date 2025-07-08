import { Component, Input } from "@angular/core";
import { BasicFlightInformation } from "~/app/models/basicFlightInformation";

@Component({
  selector: "ns-flight-list",
  templateUrl: "./flightList.component.html",
  styleUrls: ["./flightList.component.scss"],
})
export class FlightListComponent {
  @Input({ required: true }) flightInfoArray!: Array<BasicFlightInformation>;

  constructor(){
    
  }
}
