import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { BlogCreateComponent } from './blogCreate.component'

const routes: Routes = [{ path: '', component: BlogCreateComponent }]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class BlogCreateRoutingModule {}
