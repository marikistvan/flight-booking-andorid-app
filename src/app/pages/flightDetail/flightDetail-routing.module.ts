import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { FlightDetailComponent } from './flightDetail.component'

const routes: Routes = [{ path: '', component: FlightDetailComponent }]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class FlightDetailRoutingModule {}
