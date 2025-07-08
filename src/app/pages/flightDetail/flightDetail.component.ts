import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { FirebaseAuth } from '@nativescript/firebase-auth';
@Component({
  selector: 'FlightDetail',
  templateUrl: './flightDetail.component.html',
})
export class FlightDetailComponent implements OnInit {
  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
  /*const currentUser = this.auth.currentUser;
  if (currentUser) {
    console.log(currentUser.email); // Aktuális felhasználó e-mail címe.
  }*/
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
