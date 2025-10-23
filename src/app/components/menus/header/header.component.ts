import { Component, OnInit } from '@angular/core';

import { AppComponent } from '~/app/app.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'ns-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})
export class HeaderComponent {
    constructor(
        public authService: AuthService,
        public appComponent: AppComponent,
    ) { }
}
