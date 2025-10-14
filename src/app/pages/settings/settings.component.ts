import { Component, OnInit, signal, ViewContainerRef } from '@angular/core'
import { action, Application, Color, Dialogs, EventData, Switch, Utils } from '@nativescript/core'
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
import { HttpClient } from '@angular/common/http';
import { LocalNotifications } from '@nativescript/local-notifications';

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  isNotificationEnabled = signal<boolean>(false);
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
    private modalDialogService: ModalDialogService,
    private http: HttpClient) {
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
    this.requestPermission();
    const notification = getString('isNotificationEnabled', 'True');
    notification === 'True' ? this.isNotificationEnabled.set(true) : this.isNotificationEnabled.set(false);
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
      setString('defaultDestiontionIATACode', result.iataCode);
      this.defaultDestionation.set(defaultDes);
    }
  }

  formatName(detailedName: string, iataCode: string): string {
    const parts = detailedName.split('/');
    return parts.join(', ') + ` (${iataCode})`;
  }

  requestPermission() {
    LocalNotifications.requestPermission().then(granted => {
      if (granted && getString('isNotificationEnabled', 'True') === 'True') {
        this.scheduleMonthlyPromo();
      }
      else {
        console.log('Nincs engedély értesítésre');
      }
    });
  }

  scheduleMonthlyPromo() {
    const savedTime = Number(getString('promoNext', '0'));
    let firstTrigger: Date;

    if (savedTime) {
      firstTrigger = new Date(savedTime);
    } else {
      firstTrigger = new Date();
      firstTrigger.setDate(firstTrigger.getDate() + 30);
      setString('promoNext', firstTrigger.getTime().toString());
    }

    LocalNotifications.schedule([{
      id: 200,
      title: 'Ne maradj le a repülőjáratokról!',
      body: 'Nézd meg a mai ajánlatokat!',
      at: firstTrigger,
      interval: { month: 1 },
      sound: 'default'
    }]).then(
      scheduledIds => console.log('Havi promóció ütemezve, ID:', scheduledIds),
      error => console.log('Hiba az ütemezésnél:', error)
    );
  }

  async onCheckedChange(event: EventData) {
    const mySwitch = event.object as Switch;
    if (mySwitch.checked) {
      this.requestPermission();
      setString('isNotificationEnabled', 'True');
    } else {
      setString('isNotificationEnabled', 'False');
      LocalNotifications.cancelAll().then(() => {
        console.log('Értesítések letiltva');
      });
    }
  }
}
