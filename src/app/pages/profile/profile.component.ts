import { Component, OnInit, signal, ViewContainerRef } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, Dialogs, ImageSource, knownFolders, path } from '@nativescript/core'
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { AuthService } from '~/app/services/auth.service';
import { UserService } from '~/app/services/user.service';
import { DatePipe } from '@angular/common';
import { GoogleSignin } from '@nativescript/google-signin';
import { localize } from '@nativescript/localize';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

@Component({
  providers: [DatePipe],
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  imageSrc: any;
  isActive = signal(true);
  constructor(
    private viewContainerRef: ViewContainerRef,
    private modalDialogService: ModalDialogService,
    private routerExtensions: RouterExtensions,
    public authService: AuthService,
    private userService: UserService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.imageSrc = this.userService.loadSavedImage();
  }

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
  async setProfil(id: number): Promise<void> {
    let element = "";
    this.isActive.set(false);
    switch (id) {
      case 0:
        element = 'Photo';
        break;
      case 1:
        element = 'full-name';
        break;
      case 2:
        element = 'Email';
        break;
      case 3:
        element = 'Születési dátum';
        break;
      case 4:
        element = 'Neme';
        break;
      case 5:
        element = 'password';
        break;
    }
    const options: ModalDialogOptions = {
      context: {
        name: element,
      },
      fullscreen: false,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(ProfileEditComponent, options).finally(() => {
        this.isActive.set(true);
        this.imageSrc = this.userService.loadSavedImage();
      });
  }
}
