import { Component, NO_ERRORS_SCHEMA, signal, ViewContainerRef } from '@angular/core';
import {
    ModalDialogOptions,
    ModalDialogService,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    RouterExtensions,
} from '@nativescript/angular';
import '@nativescript/firebase-auth';
import '@nativescript/firebase-firestore';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application, Dialogs } from '@nativescript/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '~/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { registerElement } from '@nativescript/angular';
import { GoogleSignin } from '@nativescript/google-signin';
import { localize } from '@nativescript/localize';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { emailRegexValidator } from '~/app/validators/email-regex.validator';
registerElement(
    'GoogleSignInButton',
    () => require('@nativescript/google-signin').GoogleSignInButton
);
@Component({
    selector: 'ns-login',
    standalone: true,
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        FormsModule,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class LoginComponent {
    isLoginStarted = signal(false);
    isBadEmailOrPassword = signal(false);
    isNeedEmailValidate = signal(false);

    loginFormGroup = new FormGroup({
        email: new FormControl<string | null>('', [Validators.required, emailRegexValidator]),
        password: new FormControl<string | null>('', Validators.required),
    });

    constructor(
        private routerExtensions: RouterExtensions,
        private authService: AuthService,
        private viewContainerRef: ViewContainerRef,
        private modalDialogService: ModalDialogService
    ) { }

    signInWithGoogle() {
        this.authService
            .signInWithGoogle()
            .then(() => {
                this.routerExtensions.navigate(['flightSearch']);
            })
            .catch((error) => {
                console.log(
                    'hiba történt google bejelentkezés során: ' + error
                );
                Dialogs.alert({
                    title: localize('general.errorTitle'),
                    message: localize('general.errorOccured'),
                    okButtonText: localize('general.ok'),
                });
            });
    }

    register() {
        this.routerExtensions.navigate(['register']);
    }

    async onLogin(): Promise<void> {
        this.isBadEmailOrPassword.set(false);
        this.isNeedEmailValidate.set(false);

        if (this.loginFormGroup.invalid) {
            this.isBadEmailOrPassword.set(true);
            return;
        }

        this.isLoginStarted.set(true);

        try {
            await this.authService.login(
                this.loginFormGroup.get('email').value.trim(),
                this.loginFormGroup.get('password').value
            );
        } catch (error: any) {
            if (error?.message === 'need-email-validate') {
                this.isNeedEmailValidate.set(true);
            } else {
                this.isBadEmailOrPassword.set(true);
            }
        } finally {
            this.isLoginStarted.set(false);
        }
    }

    async onForgotPassword() {
        const options: ModalDialogOptions = {
            context: "email",
            fullscreen: false,
            viewContainerRef: this.viewContainerRef,
        };
        const result = await this.modalDialogService.showModal(
            ForgetPasswordComponent,
            options
        );
        if (result === 'success') {
            Dialogs.alert({
                title: 'Siker!',
                message: 'Jelszó visszaállító elküldve az emailedre.',
                okButtonText: 'OK',
                cancelable: true,
            })
        } else {
            Dialogs.alert({
                title: 'Sikertelen próbálkozás!',
                message: 'Jelszó visszaállító email nem lett elküldve.',
                okButtonText: 'OK',
                cancelable: true,
            })
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
