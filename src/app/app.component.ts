import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import '@nativescript/firebase-auth';
import '@nativescript/firebase-firestore';
import { AuthService } from './services/auth.service';
import { androidLaunchEventLocalizationHandler } from '@nativescript/localize';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(
        private routerExtensions: RouterExtensions,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        if (!this.authService.currentUser) {
            this.routerExtensions.navigate(['home']);
        }
        if (Application.android) {
            androidLaunchEventLocalizationHandler();
        }
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
}
