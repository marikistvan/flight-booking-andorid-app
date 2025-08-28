import { Component, OnInit } from "@angular/core";
import { ModalDialogParams, RouterExtensions } from "@nativescript/angular";
import { topmost } from "@nativescript/core/ui/frame";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})

export class HomeComponent implements OnInit {
  constructor(private routerExtension: RouterExtensions) { }
  ngOnInit(): void {
  }
  loginWithGoogle() {

  }
  login() {
    this.routerExtension.navigate(['login']);
  }
  register() {
    this.routerExtension.navigate(['register']);
  }
  tryApp() {
    this.routerExtension.navigate(['flightSearch']);
  }
}
