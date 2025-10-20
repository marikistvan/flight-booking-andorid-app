import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'ns-menus',
    templateUrl: 'menus.component.html',
    styleUrls: ['menus.component.scss'],
})
export class MenusComponent {
    constructor(public authService: AuthService) {}
}
