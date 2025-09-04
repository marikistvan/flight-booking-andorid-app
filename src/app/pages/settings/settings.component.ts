import { Component, OnInit, signal } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { action, Application, Dialogs, Utils } from '@nativescript/core'
import { AuthService } from '~/app/services/auth.service';
import { overrideLocale } from '@nativescript/localize';
import { localize } from "@nativescript/localize";

@Component({

  selector: 'Settings',
  templateUrl: './settings.component.html',
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  languages=signal(['Hungary','English']);
  languageDict: Record<string, string> = {
    'Hungary':'hu',
    'English':'en'
};
  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  signOut(): void {
    this.authService.signOut();
  }

  setAppLanguage() {
    action({
      message: localize('settings.chooseLanguage'),
      cancelButtonText: localize('general.cancel'),
      actions: this.languages()
    }).then(result => {
      if (result !== localize('general.cancel')) {
        const localeOverriddenSuccessfully = overrideLocale(this.languageDict[result]);
        this.askUserToRestartTheApp(this.languageDict[result]);
      }
    });

  }

  async askUserToRestartTheApp(language: string) {
    Dialogs.confirm({
      title: localize("settings.changeLanguageTitle"),
      message: localize("settings.changeLanguageMessage"),
      okButtonText: localize("settings.close"),
      neutralButtonText: localize("general.cancel"),
    }).then((result) => {
      if (result === true) {
        overrideLocale(language);
        console.log(result)
        Utils.android.getCurrentActivity().finish();
      }

    });
  }
}
