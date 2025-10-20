import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import {
    Application,
    ImageSource,
    knownFolders,
    path,
    StackLayout,
} from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { AppComponent } from '~/app/app.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '~/app/services/user.service';

@Component({
    selector: 'ns-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})
export class HeaderComponent implements OnInit {
    imageSrc: any;
    constructor(
        private routerExtensions: RouterExtensions,
        public authService: AuthService,
        public appComponent: AppComponent,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.imageSrc = this.userService.loadSavedImage();
    }
}
