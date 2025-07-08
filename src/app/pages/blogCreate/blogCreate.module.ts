import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule,NativeScriptFormsModule } from '@nativescript/angular'
import { BlogCreateRoutingModule } from './blogCreate-routing.module'
import { FormsModule } from '@angular/forms';
import { BlogCreateComponent } from './blogCreate.component'

@NgModule({
  imports: [NativeScriptCommonModule,NativeScriptFormsModule, BlogCreateRoutingModule,FormsModule],
  declarations: [BlogCreateComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BlogCreateModule {}
