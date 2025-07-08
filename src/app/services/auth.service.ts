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
  currentAuthStatus = this.authStatusSub.asObservable();

  constructor(private routerExtensions: RouterExtensions) {
    firebase().auth().addAuthStateChangeListener((user) => {
      this.authStatusSub.next(user);
    });
    if (this.currentUser) {
      firebase()
        .firestore()
        .collection("users")
        .doc(this.currentUser.uid)
        .get()
        .then((cred) => {
          if (cred && !cred.exists) {
            return;
          }
          this._fullName = cred.data()['firstName'] + ' ' + cred.data()['lastName'];
        });
    }
  }
  get currentUser() {
    return this.auth.currentUser;
  }

  get userName() {
    return this._fullName;
  }
  register(email: string, password: string, list: {}) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
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
      this.routerExtensions.navigate(['login']);
      console.log('Logged out');
    });
  }
  resetPassword(data) {
    return this.auth.sendPasswordResetEmail(data);
  }
}
