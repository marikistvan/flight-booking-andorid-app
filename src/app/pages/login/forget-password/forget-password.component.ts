import { CommonModule, DatePipe } from '@angular/common';
import { Component, NgZone, NO_ERRORS_SCHEMA, OnInit, signal, ViewContainerRef } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ModalDialogParams, NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { emailRegexValidator } from '../../../../app/validators/email-regex.validator';
import * as imagePickerPlugin from '@nativescript/imagepicker';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { AuthService } from '~/app/services/auth.service';

@Component({
    standalone: true,
    selector: 'ns-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss'],
    imports:
        [ReactiveFormsModule,
            CommonModule,
            NativeScriptCommonModule,
            NativeScriptFormsModule,
            FormsModule,
            NativeScriptLocalizeModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ForgetPasswordComponent implements OnInit {
    isTappedAndWrong = signal(false);
    form = new FormGroup(
        {
            email: new FormControl<string | null>('', [Validators.required, emailRegexValidator])
        },
    );

    get email() {
        return this.form.get('email').value;
    }
    constructor(private modalDialogParams: ModalDialogParams, private authService: AuthService
    ) { }
    ngOnInit(): void {
    }
    onEmailChange() {
        if (this.isTappedAndWrong()) {
            this.isTappedAndWrong.set(false);
        }
    }

    submit() {
        if (!this.form.invalid) {
            this.authService.sendPasswordResetEmail(this.email);
            this.modalDialogParams.closeCallback('success');
        }
        else {
            this.isTappedAndWrong.set(true);
        }
    }

}