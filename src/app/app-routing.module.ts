import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { FlightSearchComponent } from './pages/flightSearch/flightSearch.component'
import { SettingsComponent } from './pages/settings/settings.component'
import { LoginComponent } from './pages/login/login.component'
import { FlightSearchDestinationSelectorComponent } from './pages/flightSearch/flight-search-destination-selector/flightSearchDestinationSelector.component'
import { FlightSearchPassengersSelectorComponent } from './pages/flightSearch/flight-search-passengers-selector/flightSearchPassengersSelector.component'
import { HomeComponent } from './pages/home/home.component'
import { RegisterComponent } from './pages/register/register.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { BlogListComponent } from './pages/blog-list/blog-list.component'
import { CreateBlogComponent } from './pages/blog-list/create-blog/create-blog.component'
import { BasketComponent } from './pages/basket/basket.component'
import { AiChatComponent } from './pages/aichat/aichat.component'
import { FlightDetailsComponent } from './pages/flightSearch/fligthList/flightList-row/flight-details/flight-details.component'
import { FlightListRowComponent } from './pages/flightSearch/fligthList/flightList-row/flightList-row.component'
import { PassengerInfoComponent } from './pages/flight-booking/passenger-info.component'
import { SetpassengerComponent } from './pages/flight-booking/set-passenger/set-passenger.component'
import { SelectSeatComponent } from './pages/flight-booking/select-seat/select-seat.component'
import { SeatDetailsModalComponent } from './pages/flight-booking/select-seat/seat-details-modal/seat-details-modal.component'
import { FlightSummaryComponent } from './pages/flight-booking/flight-summary/flight-summary.component'
import { PassengerDetailsComponent } from './pages/flight-booking/flight-summary/passenger-details/passenger-details.component'
const routes: Routes = [
  { path: '', redirectTo: '/passengerInfo', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'passDetails',
    component: PassengerDetailsComponent,
  },
  {
    path: 'flightSummary',
    component: FlightSummaryComponent,
  },
  {
    path: 'seatDetails',
    component: SeatDetailsModalComponent,
  },
  {
    path: 'seat',
    component: SelectSeatComponent,
  },
  {
    path: 'setPassenger',
    component: SetpassengerComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'passengerInfo',
    component: PassengerInfoComponent,
  },
  {
    path: 'flightSearch',
    component: FlightSearchComponent,
  },
  {
    path: 'flightSearchDestinationSelectorComponent',
    component: FlightSearchDestinationSelectorComponent,
  },
  {
    path: 'flightSearchPassengersSelectorComponent',
    component: FlightSearchPassengersSelectorComponent,
  },
  {
    path: 'flightListRow',
    component: FlightListRowComponent,
  },
  {
    path: 'flightDetails',
    component: FlightDetailsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'blogList',
    component: BlogListComponent,
  },
  {
    path: 'blogCreate',
    component: CreateBlogComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
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
    path: 'profile-edit',
    loadChildren: () => import('~/app/pages/profile_edit/profile-edit.module').then((m) => m.ProfileEditModule),
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
