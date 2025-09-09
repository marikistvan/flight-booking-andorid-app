import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BasketComponent } from './pages/basket/basket.component';
import { AiChatComponent } from './pages/aichat/aichat.component';
import { FlightSearchComponent } from './pages/flightSearch/flightSearch.component';
import { FlightTicketListComponent } from './pages/flight-ticket-list/flight-ticket-list.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'blogList',
    component: BlogListComponent,
  },
  {
    path: 'flightSearch',
    component: FlightSearchComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'aichat',
    component: AiChatComponent,
  },
  {
    path: 'basket',
    component: BasketComponent,
  },
  {
    path: 'flightTicketList',
    component: FlightTicketListComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },

  {
    path: 'passDetails',
    loadComponent: () =>
      import('./pages/flight-booking/flight-summary/passenger-details/passenger-details.component')
        .then(m => m.PassengerDetailsComponent),
  },
  {
    path: 'flightSummary/:flightId',
    loadComponent: () =>
      import('./pages/flight-booking/flight-summary/flight-summary.component')
        .then(m => m.FlightSummaryComponent),
  },
  {
    path: 'seatDetails',
    loadComponent: () =>
      import('./pages/flight-booking/select-seat/seat-details-modal/seat-details-modal.component')
        .then(m => m.SeatDetailsModalComponent),
  },
  {
    path: 'seat',
    loadComponent: () =>
      import('./pages/flight-booking/select-seat/select-seat.component')
        .then(m => m.SelectSeatComponent),
  },
  {
    path: 'setPassenger',
    loadComponent: () =>
      import('./pages/flight-booking/set-passenger/set-passenger.component')
        .then(m => m.SetpassengerComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component')
        .then(m => m.RegisterComponent),
  },
  {
    path: 'passengerInfo/:flightId',
    loadComponent: () =>
      import('./pages/flight-booking/passenger-info.component')
        .then(m => m.PassengerInfoComponent),
  },
  {
    path: 'flightSearchDestinationSelectorComponent',
    loadComponent: () =>
      import('./pages/flightSearch/flight-search-destination-selector/flightSearchDestinationSelector.component')
        .then(m => m.FlightSearchDestinationSelectorComponent),
  },
  {
    path: 'flightSearchPassengersSelectorComponent',
    loadComponent: () =>
      import('./pages/flightSearch/flight-search-passengers-selector/flightSearchPassengersSelector.component')
        .then(m => m.FlightSearchPassengersSelectorComponent),
  },
  {
    path: 'flightList',
    loadComponent: () =>
      import('./pages/flightSearch/fligthList/flightList.component')
        .then(m => m.FlightListComponent),
  },
  {
    path: 'flightListRow',
    loadComponent: () =>
      import('./pages/flightSearch/fligthList/flightList-row/flightList-row.component')
        .then(m => m.FlightListRowComponent),
  },
  {
    path: 'flightDetails/:flightId',
    loadComponent: () =>
      import('./pages/flightSearch/fligthList/flightList-row/flight-details/flight-details.component')
        .then(m => m.FlightDetailsComponent),
  },
  {
    path: 'flightDetails',
    loadComponent: () =>
      import('./pages/flightSearch/fligthList/flightList-row/flight-details/flight-details.component')
        .then(m => m.FlightDetailsComponent),
  },
  {
    path: 'blogCreate',
    loadComponent: () =>
      import('./pages/blog-list/create-blog/create-blog.component')
        .then(m => m.CreateBlogComponent),
  },
  {
    path: 'profile-edit',
    loadComponent: () =>
      import('./pages/profile_edit/profile-edit.module')
        .then(m => m.ProfileEditModule),
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
