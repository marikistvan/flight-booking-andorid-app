import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { BasketRoutingModule } from './basket-routing.module'
import { BasketComponent } from './basket.component'

@NgModule({
  imports: [NativeScriptCommonModule, BasketRoutingModule,NativeScriptUIListViewModule],
  declarations: [BasketComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BasketModule {}
