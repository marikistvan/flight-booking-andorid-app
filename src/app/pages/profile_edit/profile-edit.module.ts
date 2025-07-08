import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule,NativeScriptFormsModule } from '@nativescript/angular'
import { FormsModule } from '@angular/forms';
import { ProfileEditRoutingModule } from './profile-edit-routing.module'
import { ProfileEditComponent } from './profile-edit.component'
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
  imports: [NativeScriptCommonModule, ProfileEditRoutingModule,NativeScriptFormsModule,FormsModule,NativeScriptUIListViewModule],
  declarations: [ProfileEditComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfileEditModule {

  
}
