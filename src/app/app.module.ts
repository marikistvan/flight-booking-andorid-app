import { LOCALE_ID, NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptFormsModule, NativeScriptModule } from '@nativescript/angular'
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'
import { FormControl, FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { firebase } from '@nativescript/firebase-core'
import { DropDownModule } from "nativescript-drop-down/angular"
import { AppComponent } from './app.component'
import { HttpClient } from '@angular/common/http'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular"
import { NativeScriptPickerModule } from "@nativescript/picker/angular"
import { MenusComponent } from './components/menus/menus.component'
import { HeaderComponent } from './components/menus/header/header.component'
import { FlightSearchComponent } from './pages/flightSearch/flightSearch.component'
import { FlightSearchDestinationSelectorComponent } from './pages/flightSearch/flight-search-destination-selector/flightSearchDestinationSelector.component'
import { SettingsComponent } from './pages/settings/settings.component'
import { LoginComponent } from './pages/login/login.component'
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular'
import { FlightListComponent } from './pages/flightSearch/fligthList/flightList.component'
import { FlightSearchPassengersSelectorComponent } from './pages/flightSearch/flight-search-passengers-selector/flightSearchPassengersSelector.component'
import { CommonModule } from '@angular/common'
import { HomeComponent } from './pages/home/home.component'
import { RegisterComponent } from './pages/register/register.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { BlogItemComponent } from './pages/blog-list/blog-item/blog-item.component'
import { BlogListComponent } from './pages/blog-list/blog-list.component'
import { CreateBlogComponent } from './pages/blog-list/create-blog/create-blog.component'
import { BasketComponent } from './pages/basket/basket.component'
import { AiChatComponent } from './pages/aichat/aichat.component'
import { ReadBlogComponent } from './pages/blog-list/read-blog/read-blog.component'
import { FlightListRowComponent } from './pages/flightSearch/fligthList/flightList-row/flightList-row.component'
import { FlightDetailsComponent } from './pages/flightSearch/fligthList/flightList-row/flight-details/flight-details.component'
import { PassengerInfoComponent } from './pages/flight-booking/passenger-info.component'
import { registerLocaleData } from '@angular/common'
import { SetpassengerComponent } from './pages/flight-booking/set-passenger/set-passenger.component'
import localeHu from '@angular/common/locales/hu';

registerLocaleData(localeHu);

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'hu' }],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    NativeScriptModule,
    ReactiveFormsModule,
    CommonModule,
    NativeScriptUISideDrawerModule,
    DropDownModule,
    FormsModule,
    HttpClientModule,
    NativeScriptUISideDrawerModule,
    NativeScriptModule,
    NativeScriptDateTimePickerModule,
    NativeScriptPickerModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule],

  declarations: [
    AppComponent,
    HeaderComponent,
    FlightSearchComponent,
    SettingsComponent,
    MenusComponent,
    LoginComponent,
    FlightListComponent,
    FlightSearchDestinationSelectorComponent,
    FlightSearchPassengersSelectorComponent,
    HomeComponent,
    RegisterComponent,
    ProfileComponent,
    BlogListComponent,
    CreateBlogComponent,
    BasketComponent,
    AiChatComponent,
    BlogItemComponent,
    ReadBlogComponent,
    FlightListRowComponent,
    FlightDetailsComponent,
    PassengerInfoComponent,
    SetpassengerComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
  constructor() {
    firebase()
      .initializeApp()
      .then(() => console.log('Firebase initialized successfully'))
      .catch((error) => console.error('Firebase initialization failed:', error));
  }
}