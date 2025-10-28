import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterExtensions } from '@nativescript/angular';

export const CanActivate = () => {
    const authService = inject(AuthService);
    const routerExtensions = inject(RouterExtensions);

    if (authService.currentUser) {
        return true;
    } else {
        routerExtensions.navigate(['login']);
        return false;
    }

}
export const IsAdmin = () => {
    const authService = inject(AuthService);
    const routerExtensions = inject(RouterExtensions);

    if (authService.isAdmin) {
        return true;
    } else {
        routerExtensions.navigate(['login']);
        return false;
    }
}