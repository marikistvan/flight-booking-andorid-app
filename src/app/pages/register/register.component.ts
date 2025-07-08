import { AfterViewInit, Component, OnInit, ViewContainerRef } from "@angular/core";
import { Dialogs, prompt } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { AppComponent } from "../../app.component"
import { firebase } from "@nativescript/firebase-core";
import { HomeComponent } from "../home/home.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "ns-register",
  templateUrl: "register.component.html",
  styleUrls: ["./register.component.scss"],
})

export class RegisterComponent implements OnInit {
  registerFormGroup = new FormGroup({
    email: new FormControl<string | null>('', Validators.required),
    lastName: new FormControl<string | null>('', Validators.required),
    firstName: new FormControl<string | null>('', Validators.required),
    bornDate: new FormControl<Date | null>(null, Validators.required),
    sex: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', Validators.required),
    passwordAgain: new FormControl<string | null>('', Validators.required),
  })
  minBornDate: string;

  ngOnInit(): void {
    this.minBornDate= this.getAdultThresholdDate();
    console.log(this.minBornDate);
  }

  getAdultThresholdDate() {
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = today.getMonth();
    const day = today.getDate();

    const pastDate = new Date(year, month, day);

    if (month === 1 && day === 29 && pastDate.getMonth() !== 1) {
      pastDate.setFullYear(year, 1, 28);
    }

    const isoString = pastDate.toISOString().split('T')[0];
    return isoString;
  }
  selectSex(){

  }
  submitRegister(){

  }
  loginWithGoogle(){

  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}

