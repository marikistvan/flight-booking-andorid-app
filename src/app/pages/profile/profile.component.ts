import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { RouterExtensions } from "@nativescript/angular";
import { AuthService } from '~/app/services/auth.service';


@Component({
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {

  constructor(private routerExtensions: RouterExtensions, public authService:AuthService) {
  }

  async ngOnInit(): Promise<void> {
  }
  userDataModify():boolean{
    return true;
  }
  editPassword(){

  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  SetProfil(): void{
    console.log("set");
  }
}
