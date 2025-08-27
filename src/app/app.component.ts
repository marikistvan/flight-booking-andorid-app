import { Component, OnInit, ViewContainerRef } from '@angular/core'
import { Router } from '@angular/router'
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular'
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { AuthService } from './services/auth.service';
import { HomeComponent } from './pages/home/home.component'

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    private routerExtensions: RouterExtensions,
    public authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit(): void {
    this._sideDrawerTransition = new SlideInOnTopTransition();
   if (!this.authService.currentUser) {
      this.natigateToHome();
    }
  }
  async natigateToHome() {
    const options: ModalDialogOptions = {
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(HomeComponent, options);

    if (result && result === 'login') {
      this.routerExtensions.navigate(['login']);
    } else if (result && result === 'register') {
      this.routerExtensions.navigate(['login']);
    }
    else if (result && result === 'try') {
      this.routerExtensions.navigate(['flightSearch']);
    } else if (result && result === 'google') {
      console.log("Oké, google kell navigálni");
    }

  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }
}
