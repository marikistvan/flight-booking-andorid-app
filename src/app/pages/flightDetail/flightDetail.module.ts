import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { FlightDetailRoutingModule } from './flightDetail-routing.module'
import { FlightDetailComponent } from './flightDetail.component'

@NgModule({
  imports: [NativeScriptCommonModule, FlightDetailRoutingModule],
  declarations: [FlightDetailComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FlightDetailModule {}
