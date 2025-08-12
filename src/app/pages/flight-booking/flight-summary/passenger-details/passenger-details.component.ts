import { Component, Input } from "@angular/core"
import { Passenger } from '~/app/models/passenger'

@Component({
  selector: "ns-passenger-details",
  templateUrl: "./passenger-details.component.html",
  styleUrls: ["./passenger-details.component.scss"],
})

export class PassengerDetailsComponent {
  @Input() passenger: Passenger;
}
