import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { BlogRoutingModule } from './blog-routing.module'
import { BlogComponent } from './blog.component'
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
  imports: [NativeScriptUIListViewModule,NativeScriptCommonModule, BlogRoutingModule],
  declarations: [BlogComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BlogModule {}
