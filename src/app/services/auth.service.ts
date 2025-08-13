import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { Firestore } from '@nativescript/firebase-firestore';


import { RouterExtensions } from '@nativescript/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = firebase().auth();
  private authStatusSub = new BehaviorSubject<any | null>(null);
  private _fullName: string;
  private _firstName: string;
  private _lastName: string;
  private _bornDate: string;
  private _sex: string;

  currentAuthStatus = this.authStatusSub.asObservable();

  constructor(private routerExtensions: RouterExtensions) {
    firebase().auth().addAuthStateChangeListener((user) => {
      this.authStatusSub.next(user);
    });
    if (this.currentUser) {
      this.setUserProperties();
    }

  }

  get currentUser() {
    return this.auth.currentUser;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(lastname: string) {
    this._lastName = lastname;

  }
  get email(): string {
    return this.currentUser.email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get userName() {
    return this._fullName;
  }

  get born(): string {
    return this._bornDate;
  }

  get sex(): string {
    return this._sex;
  }

  register(email: string, password: string, list: {}) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login(email: string, password: string): string {
    firebase()
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        const user = cred.user;
        if (user && !user.emailVerified) {
          firebase().auth().signOut();
          return "need email validate";
        }
        this.setUserProperties();
        this.routerExtensions.navigate(['flightSearch']);
        return 'ok';
      })
      .catch((error) => {
        return "error during logging";
      });
    return 'ok';
  }

  signIn(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('Logged in:', res.user);
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  }

  signOut() {
    return this.auth.signOut().then(() => {
      this._lastName = '';
      this._firstName = '';
      this._bornDate = '';
      this._fullName = '';
      this._sex = '';
      this.routerExtensions.navigate(['login']);
    });
  }

  resetPassword(data) {
    return this.auth.sendPasswordResetEmail(data);
  }

  setUserProperties() {
    firebase()
      .firestore()
      .collection("users")
      .doc(this.currentUser.uid)
      .get()
      .then((cred) => {
        if (cred && !cred.exists) {
          return;
        }
        this._firstName = cred.data()['firstName'];
        this._lastName = cred.data()['lastName'];
        this._sex = cred.data()['genre'];
        this._bornDate = cred.data()['born'];
        this._fullName = this._firstName + ' ' + this._lastName;
      });
  }
}
