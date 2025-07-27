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
import { ReadBlogComponent } from './pages/blog-list/read-blog/read-blog.component'
import { FlightDetailsComponent } from './pages/flightSearch/fligthList/flightList-row/flight-details/flight-details.component'
import { FlightListRowComponent } from './pages/flightSearch/fligthList/flightList-row/flightList-row.component'


const routes: Routes = [
  { path: '', redirectTo: '/flightDetails', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
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
