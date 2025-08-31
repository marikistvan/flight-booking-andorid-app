import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'
import { RouterExtensions } from "@nativescript/angular";
import { AuthService } from '~/app/services/auth.service';
import { UserService } from '~/app/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  providers: [DatePipe],
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {

  constructor(
    private routerExtensions: RouterExtensions,
    public authService: AuthService,
    private userService: UserService,
    public datePipe: DatePipe
  ) {}

  userDataModify(): boolean {
    return true;
  }
  editPassword() {}

  deleteProfile() {
    Dialogs.confirm({
      title: 'Fiók törlése!',
      message: 'Biztosan törölni akarod a fiókod?',
      okButtonText: 'Igen',
      cancelButtonText: 'Nem',
      neutralButtonText: 'Mégsem',
    }).then((result) => {
      if (result) {
        this.userService.deleteUser();
      }
    })

  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  SetProfil(): void {
    console.log("set");
  }
}
