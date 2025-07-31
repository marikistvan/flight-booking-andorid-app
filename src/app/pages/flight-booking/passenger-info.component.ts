import { Component, computed, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: "ns-passenger-info",
  templateUrl: "./passenger-info.component.html",
  styleUrls: ["./passenger-info.component.scss"],
})

export class PassengerInfoComponent implements OnInit {
  passengerForm = new FormGroup({});
  passengers: string[] = [];
  controlIndex = 0;
  controlNames: string[] = [];

  ngOnInit(): void {

  }
  constructor() {
    this.addPassenger();
    this.addPassenger();
    this.addPassenger();
  }

  setPassengerInfo() { }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  onCancel() { }
  submit() { }
  addPassenger() {
    const index = this.passengers.length + 1;
    const controlName = `passenger${index}`;
    this.passengerForm.addControl(controlName, new FormControl('', Validators.required));
    this.passengers.push(controlName);
  }

  isInvalid(controlName: string): boolean {
    const control = this.passengerForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}
