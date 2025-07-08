import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule,NativeScriptFormsModule } from '@nativescript/angular'
import { FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module'
import { ProfileComponent } from './profile.component'
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
  imports: [NativeScriptCommonModule, ProfileRoutingModule,NativeScriptFormsModule,FormsModule,NativeScriptUIListViewModule],
  declarations: [ProfileComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfileModule {}
