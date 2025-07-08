import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { topmost } from "@nativescript/core/ui/frame";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})

export class HomeComponent implements OnInit {
  constructor(private modalDialogParams: ModalDialogParams) { }
  ngOnInit(): void {
  }
  loginWithGoogle(){
    this.modalDialogParams.closeCallback('google');
  }
  login(){
    this.modalDialogParams.closeCallback('login');
  }
  register(){
    this.modalDialogParams.closeCallback('register');
  }
  tryApp(){
    this.modalDialogParams.closeCallback('try');
  }
}
