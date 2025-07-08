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

@Component({
  selector: "ns-register",
  templateUrl: "register.component.html",
  styleUrls: ["./register.component.scss"],
})

export class RegisterComponent {
  

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}

