import { Component, LOCALE_ID, NO_ERRORS_SCHEMA, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import localeHu from '@angular/common/locales/hu';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { action, Application, DatePicker } from '@nativescript/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";
import { NativeScriptCommonModule, NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";
import { NativeScriptPickerModule } from "@nativescript/picker/angular";
import { passwordMatchValidator } from '~/app/validators/password-match.validator';
import { emailRegexValidator } from '~/app/validators/email-regex.validator';

registerLocaleData(localeHu);
@Component({

  providers: [{ provide: LOCALE_ID, useValue: 'hu', }, DatePipe],
  selector: "ns-register",
  standalone: true,
  templateUrl: "register.component.html",
  styleUrls: ["./register.component.scss"],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    FormsModule,
    NativeScriptDateTimePickerModule,
    NativeScriptPickerModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class RegisterComponent implements OnInit {
  sexType: Array<string> = ['Nő', 'Férfi', 'Egyéb'];
  registerFormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, emailRegexValidator],
      updateOn: "blur"
    }),
    lastName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    bornDate: new FormControl(null, Validators.required),
    sex: new FormControl('', Validators.required),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
    passwordAgain: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' })
  }, {
    validators: passwordMatchValidator,
  })
  minBornDate: string;
  ispasswordMatch: boolean = true;

  constructor(public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.minBornDate = this.getAdultThresholdDate();
  }

  getAdultThresholdDate() {
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = today.getMonth();
    const day = today.getDate();

    const pastDate = new Date(year, month, day);

    if (month === 1 && day === 29 && pastDate.getMonth() !== 1) {
      pastDate.setFullYear(year, 1, 28);
    }

    const isoString = pastDate.toISOString().split('T')[0];
    return isoString;
  }
  selectSex() {
    action({
      message: 'Válaszd ki a nemét.',
      cancelButtonText: 'Mégse',
      actions: this.sexType
    }).then(result => {
      if (result !== 'Mégse') {
        this.registerFormGroup.get('sex').setValue(result);
      }
    });
  }
  submitRegister() {
    const errors = this.registerFormGroup.errors;
    if (errors?.passwordMismatch) {
      this.registerFormGroup.get('password').markAllAsTouched;
      this.registerFormGroup.get('passwordAgain').markAllAsTouched;
      console.log('A jelszavak nem egyeznek!');
      this.ispasswordMatch = false;
    } else {
      this.ispasswordMatch = true;
    }
    if (errors?.emailRegex) {
      console.log('nem megfelelő az email');
    }
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
  }
  loginWithGoogle() {

  }
  get emailInvalid(): boolean {
    const control = this.registerFormGroup.get('email');
    return control && control.invalid && (control.dirty || control.touched);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  hasError(controlName: string, groupErrorName?: string): boolean {
    const control = this.registerFormGroup.get(controlName);

    const controlInvalid = control && control.invalid && (control.dirty || control.touched);

    const groupInvalid = groupErrorName
      ? this.registerFormGroup.hasError(groupErrorName) &&
      (control.dirty || control.touched)
      : false;

    return controlInvalid || groupInvalid;
  }
}

