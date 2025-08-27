import { CommonModule } from "@angular/common";
import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core"
import { NativeScriptCommonModule } from "@nativescript/angular";
import { Passenger } from '~/app/models/passenger'

@Component({
  selector: "ns-passenger-details",
  standalone: true,
  templateUrl: "./passenger-details.component.html",
  styleUrls: ["./passenger-details.component.scss"],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class PassengerDetailsComponent {
  @Input() passenger: Passenger;
}
