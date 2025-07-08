import { AfterViewInit, Component, OnInit, ViewContainerRef } from "@angular/core";
import { Dialogs, prompt } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { AppComponent } from "../../app.component"
import { firebase } from "@nativescript/firebase-core";
import { HomeComponent } from "../home/home.component";

@Component({
  selector: "ns-login",
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.css"],
})

export class LoginComponent {
  public selectedIndex = 0;
  public genreArray: Array<string>;
  selectedDate: Date;
  dateTime = new Date();
  isLoggingIn = true;
  email = "";
  password = "";
  confirmPassword = "";
  firstName = "";
  lastName = "";
  date = "";
  gender = "";
  bornDateIsOk = false;
  isGengreOk = false;
  errorok: Array<string>;
  errorOsszefuzz = "";
  szuletesiEv: string;

  constructor(private routerExtensions: RouterExtensions,
    private app: AppComponent,
  ) {
    this.genreArray = [];
    this.errorok = [];
    this.genreArray.push("Neme");
    this.genreArray.push("Férfi");
    this.genreArray.push("Nő");
    this.genreArray.push("Egyéb");

  }
  public onchange(args: SelectedIndexChangedEventData) {
    if (args.newIndex == 0) {
      this.isGengreOk = false;
    } else if (args.newIndex == 1) {
      this.gender = "Férfi";
    } else if (args.newIndex == 2) {
      this.gender = "Nő";
    } else if (args.newIndex == 3) {
      this.gender = "Egyéb";
    }
    if (args.newIndex != 0) {
      this.isGengreOk = true;
    }
  }
  ControlisLoginIn(): void {
    this.isLoggingIn = !this.isLoggingIn;
  }
  onDateChange(event: any) {
    this.selectedDate = event.value;
    console.log(event.value);
    const isAdult = this.checkIfAdult(this.selectedDate);
    console.log("Elmúlt 18 éves:", isAdult);
    this.bornDateIsOk = isAdult;
  }

  checkIfAdult(birthDate: Date): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    this.szuletesiEv = birthDate.getFullYear() + "-" + (birthDate.getMonth() + 1) + "-" + birthDate.getDate();
    console.log(this.szuletesiEv);

    return hasHadBirthdayThisYear ? age >= 18 : age - 1 >= 18;
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  onLogin(): void {
    if (this.isLoggingIn) {
      firebase()
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((cred) => {
          const user = cred.user;
          if (user && !user.emailVerified) {
            Dialogs.alert({
              title: "Email megerősítés szükséges",
              message:
                "Kérlek, ellenőrizd az email fiókod és erősítsd meg az email címedet!",
              okButtonText: "Ok!",
            });
            return firebase().auth().signOut();
          }
          console.log("Bejelentkezés sikeres!");
          Dialogs.alert({
            title: "Siker!",
            message: "Be vagy jelentkezve!",
            okButtonText: "Ok!",
            cancelable: true,
          });
          this.routerExtensions.navigate(['home']);
        })
        .catch((error) => {
          console.error("Hiba történt a bejelentkezés során:", error.message);
          Dialogs.alert({
            title: "Hiba!",
            message: "Hibás email cím, vagy jelszó!",
            okButtonText: "Ok!",
            cancelable: true,
          });
        });
    } else {
      if (!this.isValidEmail(this.email)) {
        this.errorok.push("Az email cím nem helyes!");
      }
      if (this.firstName === undefined || this.firstName.length == 0) {
        this.errorok.push("Írja be a keresztnevét!");
      }
      if (this.lastName === undefined || this.lastName.length == 0) {
        this.errorok.push("Írja be a vezetéknevét!");
      }
      if (!this.isGengreOk) {
        this.errorok.push("Válassza ki a nemét!");
      }
      if (this.selectedDate === undefined) {
        this.errorok.push("Válassza ki a születési dátumát!");
      } else if (!this.bornDateIsOk) {
        this.errorok.push("Csak felnőttek regisztrálhatnak!");
      }
      if (this.password.length < 8) {
        this.errorok.push("A jelszó túl rövid, minimum 8 karakter legyen.");
      }
      if (this.password === this.confirmPassword) {
        console.log("jelszavak megegyeznek!");
      } else {
        console.log("jelszavak különböznek!");
        this.errorok.push("jelszavak különböznek!");
      }
      if (this.errorok.length != 0) {
        for (var error of this.errorok) {
          this.errorOsszefuzz += error + "\n";
        }
        Dialogs.alert({
          title: "Hiba regisztrálás során",
          message: this.errorOsszefuzz,
          okButtonText: "OK",
          cancelable: true,
        });
        this.errorok = [];
        this.errorOsszefuzz = "";
      } else {
        firebase()
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((cred) => {
            const user = firebase().auth().currentUser;

            if (user && !user.emailVerified) {
              user.sendEmailVerification();
            }
            console.log("Felhasználó létrehozva!", cred.user?.uid);
            return firebase()
              .firestore()
              .collection("users")
              .doc(cred.user?.uid)
              .set({
                born: this.szuletesiEv,
                firstName: this.firstName,
                lastName: this.lastName,
                genre: this.gender,
              });
          })
          .then(() => {
            console.log("Felhasználói adatok elmentve!");
            this.isLoggingIn = true;
            Dialogs.alert({
              title: "Küldtünk egy emailt!",
              message: "Kérlek validáld az email címed!",
              okButtonText: "Ok!",
              cancelable: true,
            });
          })
          .catch((error) => {
            console.error("Hiba történt:", error.message);
            Dialogs.alert({
              title: "Hiba regisztrálás során",
              message: `${this.email} - Ez az email cím már foglalt.`,
            });
          });
      }
    }
  }
  forgotPassword(): void {
    prompt({
      title: "Forgot Password",
      message: "Adja meg az email címét, amire elküldhetjük a jelszócserét!",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel",
    }).then((cred) => {
      if (cred.result) {
        alert({
          title: "Sikeres jelszó módosítás!",
          message:
            "A jelszva sikeresen frissítve lett. Kérem, nézze meg az email címét a további információkért.",
          okButtonText: "Ok",
        });
      }
    });
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}

