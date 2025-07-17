import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ns-menus',
  templateUrl: 'menus.component.html',
  styleUrls: ["menus.component.scss"],

})

export class MenusComponent {
  constructor(private routerExtensions: RouterExtensions, public authService: AuthService) { }

  isComponentSelected(url: string): boolean {
    return this.routerExtensions.router.url === url;
  }

  onNavItemTap(navItemRoute: string): void {
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }
}
