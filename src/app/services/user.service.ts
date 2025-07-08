import { Injectable } from "@angular/core";
import { firstValueFrom } from 'rxjs';
import { firebase } from "@nativescript/firebase-core";
import { ObservableArray } from "@nativescript/core";
import {EmailAuthProvider } from "@nativescript/firebase-auth";
import { FieldValue } from "@nativescript/firebase-firestore";
import { HttpClient } from '@angular/common/http';
import { firestore } from "firebase-admin";
import { environment } from "~/environments/environment";
@Injectable({ providedIn: "root" })

export class UserService {
bornYear:string;
errorok:Array<string>;
  user = firebase().auth().currentUser;
  auth = firebase().auth();


  constructor(private http: HttpClient) {}
  checkIfAdult(birthDate: Date): string {
    let felnott="";
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
        this.bornYear=birthDate.getFullYear()+"-"+(birthDate.getMonth()+1)+"-"+birthDate.getDate();
        if(hasHadBirthdayThisYear ? age >= 18 : age - 1 >= 18){
          felnott="";
        }else{
          felnott="Csak felnőttek regisztrálhatnak!";
        }
        return felnott;
  }
  isValidEmail(email: string): string {
    let validEmail="";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)===false){
      validEmail="Az email cím nem helyes!";
    }
    return validEmail;
  }  async updateEmail(email: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post(environment.backendUrl+"api/user/updateEmail", {
          uid: this.user.uid,
          newEmail: email,
        })
      );
      console.log("Siker", res);
    } catch (err) {
      console.error("Hiba", err);
      throw err;
    }
  }
  
  async updatePassword(password: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post(environment.backendUrl+"api/user/updatePassword", {
          uid: this.user.uid,
          newPassword: password,
        })
      );
      console.log("Siker", res);
    } catch (err) {
      console.error("Hiba", err);
      throw err;
    }
  }
/*  deleteUser(){
    this.user.delete();
  }*/
async updateFullName(firstname: string, lastname: string) {
  try {
    const res = await firstValueFrom(
      this.http.post(environment.backendUrl+"api/user/updateFullName", {
        uid: this.user.uid,
        firstName: firstname,
        lastName: lastname,
      })
    );
    console.log("Siker", res);
  } catch (err) {
    console.error("Hiba", err);
    throw err;
  }
}
  async updateBorn(bornDate:Date){
    try{
      const res = await firstValueFrom(
        this.http.post(environment.backendUrl+"api/user/updateBornDate", {
        uid: this.user.uid,
        born:bornDate,
      })
    );
    console.log("Siker", res);
  } catch (err) {
    console.error("Hiba", err);
    throw err;
  }
  }
  isValidPasswords(currentPassword:string,password:string,anotherPassowrd:string):Array<string>{
    let passworderrors=[];
    if(password == undefined || anotherPassowrd == undefined){
      passworderrors.push("Nincs kitoltve minden mezo");
      return passworderrors;
    }
    if (password.length < 8) {
      passworderrors.push("A jelszó túl rövid, minimum 8 karakter legyen.");
      return passworderrors;
    }
    if (password != anotherPassowrd) {
      passworderrors.push("jelszavak különböznek!");
      return passworderrors;
    }
    if(password === currentPassword){
      passworderrors.push("Nem lehet ugyan az a jelszo, mint ami volt eddig!");
      return passworderrors;
    }
    return passworderrors;
  }
  async reauthenticate(email:string,password:string):Promise<boolean>{
    const credential = EmailAuthProvider.credential(this.user.email, password);
    try{
      const valami=await this.user.reauthenticateWithCredential(credential);
    }
    catch(error){
      console.log("error történt "+error);
     return false;
    }
    return true;
  }
  isValidName(lastName: string, firstName:string):Array<string>{
    let nameErrors=[];
    console.log(lastName +" "+ firstName);
      if (firstName === undefined || firstName.length == 0) {
        nameErrors.push("Írja be a keresztnevét!");
      }
      if (lastName === undefined || lastName.length == 0) {
        nameErrors.push("Írja be a vezetéknevét!");
      }
      return nameErrors;
  }
  validateDeatils(email:string,firstName:string,lastName:string,isGengreOk:boolean,bornDateIsOk:boolean,password:string,confirmPassword:string,selectedDate:Date):Array<string>{
    if (!this.isValidEmail(email)) {
      this.errorok.push("Az email cím nem helyes!");
    }
    if (firstName === undefined || firstName.length == 0) {
      this.errorok.push("Írja be a keresztnevét!");
    }
    if (lastName === undefined || lastName.length == 0) {
      this.errorok.push("Írja be a vezetéknevét!");
    }
    if (!isGengreOk) {
      this.errorok.push("Válassza ki a nemét!");
    }
    if (selectedDate === undefined) {
      this.errorok.push("Válassza ki a születési dátumát!");
    } else if (!bornDateIsOk) {
      this.errorok.push("Csak felnőttek regisztrálhatnak!");
    }
    if (password.length < 8) {
      this.errorok.push("A jelszó túl rövid, minimum 8 karakter legyen.");
    }
    if (password === confirmPassword) {
      console.log("jelszavak megegyeznek!");
    } else {
      console.log("jelszavak különböznek!");
      this.errorok.push("jelszavak különböznek!");
    }
    return this.errorok;
  }
}
