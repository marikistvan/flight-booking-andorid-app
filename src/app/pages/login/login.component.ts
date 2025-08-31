import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptFormsModule, RouterExtensions } from "@nativescript/angular";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "~/app/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "ns-login",
  standalone: true,
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    FormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class LoginComponent {
  loginFormGroup = new FormGroup({
    email: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', Validators.required),
  })

  constructor(
    private routerExtensions: RouterExtensions,
    private authService: AuthService
  ) { }

  loginWithGoogle() { }

  register() {
    this.routerExtensions.navigate(['register']);
  }

  onLogin(): void {
    this.authService.login(this.loginFormGroup.get('email').value.trim(), this.loginFormGroup.get('password').value);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}

