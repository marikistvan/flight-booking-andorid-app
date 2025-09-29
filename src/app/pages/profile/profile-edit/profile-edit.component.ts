import { DatePipe } from "@angular/common";
import { Component, NgZone, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators, FormsModule } from "@angular/forms";
import { ModalDialogParams } from "@nativescript/angular";
import { UserService } from "~/app/services/user.service";
import { emailRegexValidator } from "~/app/validators/email-regex.validator";
import { passwordMatchValidator } from '~/app/validators/password-match.validator';
import { localize } from "@nativescript/localize";
import { action, ImageAsset, ImageSource, knownFolders, path } from "@nativescript/core";
import * as imagePickerPlugin from '@nativescript/imagepicker';
import { ImagePicker } from "@nativescript/imagepicker";

@Component({
  selector: "ProfileEdit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.scss"],
})
export class ProfileEditComponent implements OnInit {
  imageAssets = ImageAsset;
  imageSrc: any;
  isSingleMode: boolean = true;
  previewSize: number = 300;

  sexTypeDict: Record<string, string> = {
    'woman': localize('register.woman'),
    'man': localize('register.man'),
    'other': localize('register.other')
  };
  modalProperty: string = "";
  minBornDate: string;
  profileForm = new FormGroup({
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
  get lastName() {
    return this.profileForm.get('lastName').value;
  }

  get firstName() {
    return this.profileForm.get('firstName').value;
  }

  get email() {
    return this.profileForm.get('email').value;
  }

  get sex() {
    return this.profileForm.get('sex').value;
  }

  get born() {
    return this.datePipe.transform(this.profileForm.get('bornDate').value, 'YYYY.MM.dd');;
  }

  get password() {
    return this.profileForm.get('password').value;
  }

  get passWordAgain() {
    return this.profileForm.get('passwordAgain').value;
  }
  constructor(
    private modalDialogParams: ModalDialogParams,
    private userService: UserService,
    private datePipe: DatePipe,
    private _ngZone: NgZone
  ) {
    this.modalProperty = modalDialogParams.context.name;
  }
  ngOnInit(): void {
    this.minBornDate = this.getAdultThresholdDate();
  }
  submit() {
    if (this.modalProperty == "full-name") this.updateFullName();
    else if (this.modalProperty == "Születési dátum") this.updateBornDate();
    else if (this.modalProperty == "Neme") this.updateSexType();
    else if (this.modalProperty == "password") this.updatePassword();
    this.modalDialogParams.closeCallback(true);
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

  updateFullName() {
    this.userService.updateFullName(this.firstName, this.lastName)
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err) });
  }
  updateBornDate() {
    this.userService.updateBorn(this.born)
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err) });
  }

  updateSexType() {
    this.userService.updateSex(this.sex)
      .then((res) => { console.log("updateSexType response: " + res); })
      .catch((err) => { console.log(err) });
  }

  updatePassword() {
    if (this.password.length > 7 && this.password === this.passWordAgain) {
      this.userService.updatePassword(this.password)
        .then((res) => { console.log("updatePassword response: " + res); })
        .catch((err) => { console.log(err) });
    } else {
      console.log("Nem jó a password");
    }
  }

  selectSex() {
    action({
      message: localize('register.chooseYourSex'),
      cancelButtonText: localize('general.cancel'),
      actions: Object.values(this.sexTypeDict)
    }).then(result => {
      if (result !== localize('general.cancel')) {
        const sex = (Object.keys(this.sexTypeDict) as Array<string>).find(key => this.sexTypeDict[key] === result);
        this.profileForm.get('sex').setValue(sex);
        console.log("profileForm sex" + this.sex);
      }
    });
  }

  public onSelectSingleTap() {
    this.isSingleMode = true;

    let imagePicker = imagePickerPlugin.create({
      mode: 'single',
    });
    this.startSelection(imagePicker);
  }

  private startSelection(imagePicker) {
    imagePicker
      .authorize()
      .then(() => imagePicker.present())
      .then((selection) => {
        this._ngZone.run(() => {
          if (selection.length > 0) {
            const picked = selection[0];
            console.log("Picked:", picked);

            // ebből lesz rendes ImageSource
            ImageSource.fromAsset(picked.asset).then((imageSource) => {
              if (imageSource) {
                // 1) elmented
                this.saveImageSource(imageSource);

                // 2) megjelenítéshez
                this.imageSrc = imageSource;
              } else {
                console.log("Nem sikerült ImageSource-t létrehozni");
              }
            });
          }
        });
      })
      .catch((e) => console.log(e));
  }

  private saveImageSource(imageSource: ImageSource) {
    const documents = knownFolders.documents();
    const savedPath = path.join(documents.path, "myImage.png");

    if (imageSource.saveToFile(savedPath, "png")) {
      console.log("Image saved at:", savedPath);
      this.imageSrc = savedPath; // <Image [src]> ezt is elfogadja
    } else {
      console.log("Mentés sikertelen");
    }
  }
}
