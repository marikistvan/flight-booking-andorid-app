import { Component } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs } from '@nativescript/core'
import { RouterExtensions } from "@nativescript/angular";
import { AuthService } from '~/app/services/auth.service';
import { UserService } from '~/app/services/user.service';
import { DatePipe } from '@angular/common';
import { GoogleSignin } from '@nativescript/google-signin';
import { localize } from '@nativescript/localize';

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

    if (this.authService.isGoogleUser()) {
      await this.deleteGoogeAccount();
      return;
    }
    const password = await this.askPassword();
    if (!password) return;

    try {
      await this.authService.Reauthenticate(password);
      this.userService.deleteUser();
    } catch {
      Dialogs.alert({
        title: localize('general.errorTitle'),
        message: localize('profile.passwordIsIncorrect'),
        okButtonText: localize('general.ok'),
      });
    }
  }

  private async deleteGoogeAccount() {
    try {
      await this.authService.signInWithGoogle();
      GoogleSignin.disconnect();
      await this.userService.deleteUser();
    } catch {
      Dialogs.alert({
        title: localize('general.errorTitle'),
        message: localize('general.errorOccured'),
        okButtonText: localize('general.ok'),
      });
    }

  }

  private async confirmDelete(): Promise<boolean> {
    return Dialogs.confirm({
      title: localize('profile.deleteProfile'),
      message: localize('profile.isSuredeleteProfile'),
      okButtonText: localize('general.yes'),
      cancelButtonText: localize('general.no'),
      neutralButtonText: localize('general.cancel'),
    });
  }

  private async askPassword(): Promise<string | null> {
    const result = await Dialogs.prompt({
      title: localize('profile.writeDownYourPasswordTitle'),
      message: localize('profile.writeDownYourPassword'),
      inputType: 'password',
      okButtonText: localize('general.ok'),
      cancelButtonText: localize('general.cancel'),
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
