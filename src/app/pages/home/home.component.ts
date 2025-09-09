import { Component, OnInit } from "@angular/core";
import { ModalDialogParams, RouterExtensions } from "@nativescript/angular";
import { Dialogs } from "@nativescript/core";
import { topmost } from "@nativescript/core/ui/frame";
import { AuthService } from "~/app/services/auth.service";
import { localize } from "@nativescript/localize";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})

export class HomeComponent implements OnInit {
  constructor(private routerExtensions: RouterExtensions, private authService: AuthService) { }
  
  ngOnInit(): void {
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.routerExtensions.navigate(['flightSearch']);
    }).catch((error) => {
      console.log('hiba történt google bejelentkezés során: ' + error);
      Dialogs.alert({
        title: localize('home.errorTitle'),
        message: localize('home.errorOccured'),
        okButtonText: localize('home.ok'),
      });
    })
  }
  login() {
    this.routerExtensions.navigate(['login']);
  }
  register() {
    this.routerExtensions.navigate(['register']);
  }
  tryApp() {
    this.routerExtensions.navigate(['flightSearch']);
  }
}
