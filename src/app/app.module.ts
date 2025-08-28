import { LOCALE_ID, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { FormControl, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { firebase } from '@nativescript/firebase-core';
import { DropDownModule } from "nativescript-drop-down/angular";
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";
import { NativeScriptPickerModule } from "@nativescript/picker/angular";
import { MenusComponent } from './components/menus/menus.component';
import { HeaderComponent } from './components/menus/header/header.component';
import { FlightSearchComponent } from './pages/flightSearch/flightSearch.component';
import { FlightSearchDestinationSelectorComponent } from './pages/flightSearch/flight-search-destination-selector/flightSearchDestinationSelector.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { FlightSearchPassengersSelectorComponent } from './pages/flightSearch/flight-search-passengers-selector/flightSearchPassengersSelector.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BlogItemComponent } from './pages/blog-list/blog-item/blog-item.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { CreateBlogComponent } from './pages/blog-list/create-blog/create-blog.component';
import { BasketComponent } from './pages/basket/basket.component';
import { AiChatComponent } from './pages/aichat/aichat.component';
import { ReadBlogComponent } from './pages/blog-list/read-blog/read-blog.component';
import { registerLocaleData } from '@angular/common';
import { SetpassengerComponent } from './pages/flight-booking/set-passenger/set-passenger.component';
import localeHu from '@angular/common/locales/hu';
import { SelectSeatComponent } from './pages/flight-booking/select-seat/select-seat.component';
import { SeatDetailsModalComponent } from './pages/flight-booking/select-seat/seat-details-modal/seat-details-modal.component';
import { FlightTicketComponent } from './pages/flight-ticket-list/flight-ticket/flight-ticket.component';
import { FlightTicketListComponent } from './pages/flight-ticket-list/flight-ticket-list.component';
import { FlightTicketRowComponent } from './pages/flight-ticket-list/flight-ticket-row/flight-ticket-row.component';

registerLocaleData(localeHu);

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'hu', }],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
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
    NativeScriptUIListViewModule,
  ],

  declarations: [
    AppComponent,
    HeaderComponent,
    FlightSearchComponent,
    SettingsComponent,
    MenusComponent,
    FlightSearchDestinationSelectorComponent,
    FlightSearchPassengersSelectorComponent,
    HomeComponent,
    ProfileComponent,
    BlogListComponent,
    CreateBlogComponent,
    BasketComponent,
    AiChatComponent,
    BlogItemComponent,
    ReadBlogComponent,
    SetpassengerComponent,
    SelectSeatComponent,
    SeatDetailsModalComponent,
    FlightTicketComponent,
    FlightTicketListComponent,
    FlightTicketRowComponent
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