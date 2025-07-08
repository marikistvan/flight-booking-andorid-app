import { Component, OnInit } from '@angular/core';
import { NativeScriptModule, RouterExtensions } from '@nativescript/angular';
import { Application, StackLayout } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { AppComponent } from '~/app/app.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ns-header',
  templateUrl: 'header.component.html',
 styleUrls: ["header.component.css"],
})

export class HeaderComponent {
  constructor(private routerExtensions : RouterExtensions,public authService : AuthService,public appComponent:AppComponent){}
}
