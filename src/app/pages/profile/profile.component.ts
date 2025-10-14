import { Component, OnInit, signal, ViewContainerRef } from '@angular/core';
import { Dialogs } from '@nativescript/core';
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
})
export class ProfileComponent implements OnInit {
  imageSrc: any;
  isActive = signal(true);
  constructor(
    private viewContainerRef: ViewContainerRef,
    private modalDialogService: ModalDialogService,
    public authService: AuthService,
    private userService: UserService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.imageSrc = this.userService.loadSavedImage();
  }

  get userName() {
    return (this.authService.userName);
  }

  get email() {
    return (this.authService.email);
  }

  get born() {
    return (this.authService.born);
  }

  get sex() {
    return (this.authService.sex);
  }

  get photo() {
    return this.userService.loadSavedImage();
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
