import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "~/app/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "ns-login",
  standalone: true,
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
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
  ) {}

  loginWithGoogle() { }

  register() {
    this.routerExtensions.navigate(['register']);
  }

  onLogin(): void {
      console.log(this.loginFormGroup.get('email').value + 'test' + this.loginFormGroup.get('password').value.trim());
      const res = this.authService.login(this.loginFormGroup.get('email').value.trim(), this.loginFormGroup.get('password').value);
      if (res === 'need email validate') {
        console.log("need email validate");
      }
      else if (res === 'error during logging') {
        console.log('error during logging');
      }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}

