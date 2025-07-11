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
import { BlogComponent } from './pages/blog/blog.component'
import { BlogCreateComponent } from './pages/blog/blogCreate/blogCreate.component'
import { BasketComponent } from './pages/basket/basket.component'
import { AiChatComponent } from './pages/aichat/aichat.component'
const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
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
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'blogCreate',
    component: BlogCreateComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'aichat',
    component:AiChatComponent,
  },
  {
    path: 'basket',
   component: BasketComponent,
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('~/app/pages/profile_edit/profile-edit.module').then((m) => m.ProfileEditModule),
  },
  {
    path: 'flight-detail',
    loadChildren: () => import('~/app/pages/flightDetail/flightDetail.module').then((m) => m.FlightDetailModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
