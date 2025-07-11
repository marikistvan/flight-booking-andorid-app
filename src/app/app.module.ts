import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
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
import { BlogComponent } from './pages/blog/blog.component'
import { BlogCreateComponent } from './pages/blog/blogCreate/blogCreate.component'
import { BasketComponent } from './pages/basket/basket.component'
import { AiChatComponent } from './pages/aichat/aichat.component'

@NgModule({
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
    BlogComponent,
    BlogCreateComponent,
    BasketComponent,
    AiChatComponent
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