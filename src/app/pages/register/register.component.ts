import { Component, LOCALE_ID, NO_ERRORS_SCHEMA, OnChanges, OnInit, signal, SimpleChanges } from "@angular/core";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import localeHu from '@angular/common/locales/hu';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { action, Application, DatePicker, Dialogs } from '@nativescript/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";
import { NativeScriptCommonModule, NativeScriptFormsModule, RouterExtensions } from "@nativescript/angular";
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";
import { NativeScriptPickerModule } from "@nativescript/picker/angular";
import { passwordMatchValidator } from '~/app/validators/password-match.validator';
import { emailRegexValidator } from '~/app/validators/email-regex.validator';
import { AuthService } from "~/app/services/auth.service";

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
  isRegisterStarted = signal(false);
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
    passwordAgain: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {
    validators: passwordMatchValidator,
  })
  minBornDate: string;
  ispasswordMatch: boolean = true;

  constructor(
    public datePipe: DatePipe,
    private authService: AuthService,
    private routerExtensions: RouterExtensions) { }

  ngOnInit(): void {
    this.minBornDate = this.getAdultThresholdDate();
  }

  get lastName() {
    return this.registerFormGroup.get('lastName').value;
  }

  get firstName() {
    return this.registerFormGroup.get('firstName').value;
  }

  get email() {
    return this.registerFormGroup.get('email').value;
  }

  get sex() {
    return this.registerFormGroup.get('sex').value;
  }

  get born() {
    return this.datePipe.transform(this.registerFormGroup.get('bornDate').value,'YYYY.MM.dd');;
  }

  get password() {
    return this.registerFormGroup.get('password').value;
  }

  get passWordAgain() {
    return this.registerFormGroup.get('passwordAgain').value;
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
      Object.keys(this.registerFormGroup.controls).forEach(key => {
        const control = this.registerFormGroup.get(key);
        if (control?.invalid) {
          console.log(`${key} hibás:`, control.errors);
        }
      });
      return;
    } else {
      this.isRegisterStarted.set(true);
      this.authService.register(this.email, this.password, this.firstName, this.lastName, this.sex, this.born).then(() => {
        this.isRegisterStarted.set(false);
          Dialogs.alert({
            title: 'Sikeres regisztáricó!',
            message: 'Küldtünk egy megerősítő emailt, kérjük végezze el, a megerősítést!',
            okButtonText: 'OK',
            cancelable: true,
          }).then(() => {
            this.routerExtensions.navigate(['login']);
          })
      })
        .catch((error) => {
          this.isRegisterStarted.set(false);
          console.log('hiba történt regisztrálásnál: ' + error);
          Dialogs.alert({
            title: 'Hiba!',
            message: 'Kérem próbálja meg később!',
            okButtonText: 'OK',
            cancelable: true,
          })
        }
        )
      console.log('Sikeres regisztráció');
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

