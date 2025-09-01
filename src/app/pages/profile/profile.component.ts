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
  ) { }

  userDataModify(): boolean {
    return true;
  }
  editPassword() { }

  async deleteProfile() {
    if (!(await this.confirmDelete())) return;

    const password = await this.askPassword();
    if (!password) return;

    try {
      await this.authService.Reauthenticate(password);
      this.userService.deleteUser();
    } catch {
      Dialogs.alert({
        title: 'Hiba!',
        message: 'A jelszó nem megfelelő!',
        okButtonText: 'OK',
      });
    }
  }

  private async confirmDelete(): Promise<boolean> {
    return Dialogs.confirm({
      title: 'Fiók törlése!',
      message: 'Biztosan törölni akarod a fiókod?',
      okButtonText: 'Igen',
      cancelButtonText: 'Nem',
      neutralButtonText: 'Mégsem',
    });
  }

  private async askPassword(): Promise<string | null> {
    const result = await Dialogs.prompt({
      title: 'Adja meg a jelszavát!',
      message: 'A megerősítéshez kérem adja meg a jelszavát!',
      inputType: 'password',
      okButtonText: 'OK',
      cancelButtonText: 'Mégsem',
    });
    return result.result ? result.text : null;
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  SetProfil(): void {
    console.log("set");
  }
}
