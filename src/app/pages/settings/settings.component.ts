import { Component, OnInit, signal, ViewContainerRef } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { action, Application, Dialogs, Utils } from '@nativescript/core'
import { AuthService } from '~/app/services/auth.service';
import { overrideLocale } from '@nativescript/localize';
import { localize } from "@nativescript/localize";
import { Device } from '@nativescript/core';
import { ApplicationSettings } from '@nativescript/core';
import { getString, setString } from '@nativescript/core/application-settings';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { FlightSearchDestinationSelectorComponent } from '../flightSearch/flight-search-destination-selector/flightSearchDestinationSelector.component';
import { LocationResponse } from '~/app/models/location-response';
import { Message } from "nativescript-push";

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  languages = signal(['Hungary', 'English']);
  defaultDestionation = signal('');
  currencies = signal(['HUF', 'EUR', 'USD', 'CHF']);
  actualLanguage = signal(null);
  actualLCurrency = signal('HUF');
  languageDict: Record<string, string> = {
    'Hungary': 'hu',
    'English': 'en'
  };
  currencyDict: Record<string, string> = {
    'HUF': 'Ft',
    'EUR': '€',
    'USD': '$',
    'CHF': 'Fr.'
  };
  constructor(
    public authService: AuthService,
    private searchState: FlightSearchStateService,
    private viewContainerRef: ViewContainerRef,
    private modalDialogService: ModalDialogService) {

    console.log(`Notifications enabled? ${Message.areNotificationsEnabled()}`);
  }

  ngOnInit(): void {
    const appLang = ApplicationSettings.getString('__app__language__');
    if (appLang !== null || appLang !== undefined) {
      const language = (Object.keys(this.languageDict) as Array<string>).find(key => this.languageDict[key] === appLang);
      this.actualLanguage.set(language);
    } else {
      const deviceLan = Device.language.split('-')[0];
      const language = (Object.keys(this.languageDict) as Array<string>).find(key => this.languageDict[key] === deviceLan);
      this.actualLanguage.set(language ?? '');
    }
    this.actualLCurrency.set(getString('appCurrency', 'EUR'));
    this.defaultDestionation.set(getString('defaultDestiontion', ''));
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

  setCurrency() {
    action({
      message: localize('settings.chooseCurrency'),
      cancelButtonText: localize('general.cancel'),
      actions: this.currencies(),
    }).then(result => {
      if (result !== localize('general.cancel')) {
        this.actualLCurrency.set(result);
        this.searchState.setCurrency(result);
        this.searchState.setPriceSymbol(this.currencyDict[result]);
        setString('appCurrency', result);
        setString('appCurrencySymbol', this.currencyDict[result]);

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

  async chooseDestination(): Promise<void> {
    const options: ModalDialogOptions = {
      context: { type: "defaultDestination" },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(FlightSearchDestinationSelectorComponent, options);

    if (result as LocationResponse) {
      const defaultDes = this.formatName(result.detailedName, result.iataCode);
      setString('defaultDestiontion', defaultDes);
      this.defaultDestionation.set(defaultDes);
    }
  }
  formatName(detailedName: string, iataCode: string): string {
    const parts = detailedName.split('/');
    return parts.join(', ') + ` (${iataCode})`;
  }

}
