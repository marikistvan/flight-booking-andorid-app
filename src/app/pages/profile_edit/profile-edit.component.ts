import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { FirebaseAuth, User } from "@nativescript/firebase-auth";
import { firebase } from "@nativescript/firebase-core";
import { BlogService } from "../../services/blog.service";
import {AppComponent} from "../../app.component"
import {UserService} from "../../services/user.service"
import { HttpClient } from '@angular/common/http';
import { RouterExtensions } from "@nativescript/angular";
import { cwd } from "process";

export interface Blog {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  author_id: string;
}
@Component({
  selector: "ProfileEdit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.css"],
})
export class ProfileEditComponent implements OnInit {
  user = firebase().auth().currentUser;
  public genreArray: Array<string>;
  isPressed:boolean;
  errorok: Array<string>;
  newEmail:string;
  isFullNameEdit:boolean;
  isPasswordEdit:boolean;
  currentPassword:string;
  newPassword:string;
  newPasswordAgain:string;
  isEmailEdit:boolean;
  isBornEdit:boolean;
  gender = "";
  isGengreOk = false;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  born: Date;
  genre: string;
  selectedDate:Date;
  bornDateIsOk:boolean;
  bornDate:Date;

  constructor(private userService:UserService,private app:AppComponent,private http: HttpClient,private routerExtensions: RouterExtensions) {

  }

  ngOnInit() {
    this.bornDateIsOk=false;
    this.isFullNameEdit=false;
    this.isEmailEdit=false;
    this.isBornEdit=false;
    this.isPasswordEdit=false;
    this.newEmail=this.user.email;

    this.isPressed=false;
    if (this.user != null) {
      firebase()
        .firestore()
        .collection("users")
        .doc(this.user.uid)
        .get()
        .then((cred) => {
          if (cred && !cred.exists) {
            console.log("Document does not exist");
            return;
          }
          this.firstName = cred.data()["firstName"];
          this.lastName = cred.data()["lastName"];
          this.fullName = this.firstName + " " + this.lastName;
          this.born = cred.data()["born"];
          this.genre = cred.data()["genre"];
        });
    }
    this.genreArray = [];
    this.genreArray.push("Neme");
    this.genreArray.push("Férfi");
    this.genreArray.push("Nő");
    this.genreArray.push("Egyéb")
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
  async ModifyCheck(){
    this.errorok=[];
    if(this.isEmailEdit){
        const valami=this.userService.isValidEmail(this.newEmail);
        if(valami!=""){
          this.errorok.push(valami);
        }
    }
    if(this.isFullNameEdit){
      this.errorok=this.errorok.concat(this.userService.isValidName(this.lastName,this.firstName));
    }
    if(this.isBornEdit){
      if (this.bornDate === undefined) {
        this.errorok.push("Válassza ki a születési dátumát!");
      } else if (!this.bornDateIsOk) {
        this.errorok.push(this.userService.checkIfAdult(this.bornDate));
      } 
    }
    if(this.isPasswordEdit){
      console.log("currentPassword: "+this.currentPassword);
        if(await this.userService.reauthenticate(this.user.email,this.currentPassword)){
          this.errorok=this.errorok.concat(this.userService.isValidPasswords(this.currentPassword,this.newPassword,this.newPasswordAgain));
    }else{
        this.errorok.push("Hiba történt, próbálja meg legközelebb!");
      }
    }
    if(this.errorok.length==0){
      this.userDataModify(this.isEmailEdit,this.isFullNameEdit,this.isBornEdit,this.isPasswordEdit);
    }else{
      console.log(this.errorok);
    }
  }
  async userDataModify(email:boolean,fullName:boolean,born:boolean,password:boolean){
    if(email){
      console.log(this.newEmail);
     await this.userService.updateEmail(this.newEmail);
    }
    if(password){
      await this.userService.updatePassword(this.newPassword);
    }
    if(fullName){
      await this.userService.updateFullName(this.firstName,this.lastName);
    }
    if(born){
      await this.userService.updateBorn(this.bornDate);
    }
    console.log("navigálás történik...");
    this.routerExtensions.navigate(['profile']);
  }
  editField(fieldId: number): void {
    switch (fieldId) {
      case 0:
        this.isFullNameEdit = !this.isFullNameEdit;
        break;
      case 1:
        this.isEmailEdit = !this.isEmailEdit;
        break;
      case 2:
        this.isBornEdit = !this.isBornEdit;
        break;
      case 3:
        this.isPasswordEdit=!this.isPasswordEdit;
        break;
      default:
        console.warn('Unknown field ID:', fieldId);
    }
  }
  onDateChange(event: any) {
    const isAdult = this.userService.checkIfAdult(event.value);
    if(isAdult==""){
      this.bornDateIsOk=true;
    }else{
      this.bornDateIsOk=false;
    }
    this.bornDate=event.value;
  }
  Back(){
    this.routerExtensions.navigate(['profile']);
  }
  
  onBlogTap($event): void {}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
}
