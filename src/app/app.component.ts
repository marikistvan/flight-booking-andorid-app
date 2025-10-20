import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
    ModalDialogOptions,
    ModalDialogService,
    RouterExtensions,
} from '@nativescript/angular';
import {
    DrawerTransitionBase,
    RadSideDrawer,
    SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import '@nativescript/firebase-auth';
import '@nativescript/firebase-firestore';
import { AuthService } from './services/auth.service';
import { androidLaunchEventLocalizationHandler } from '@nativescript/localize';
import { Screen } from '@nativescript/core';

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
    ) { }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        if (!this.authService.currentUser) {
            this.routerExtensions.navigate(['flightSearch']);
        }
        if (Application.android) {
            androidLaunchEventLocalizationHandler();
        }
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
}
