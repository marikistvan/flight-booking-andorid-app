import { Injectable, OnInit, signal } from '@angular/core';
import { BehaviorSubject, last } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

import { RouterExtensions } from '@nativescript/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = firebase().auth();
  private authStatusSub = new BehaviorSubject<any | null>(null);
  private _fullName = signal<string>("");
  private _firstName = signal<string>("");
  private _lastName = signal<string>("");
  private _bornDate = signal<string>("");
  private _sex = signal<string>("");

  currentAuthStatus = this.authStatusSub.asObservable();

  constructor(private routerExtensions: RouterExtensions) {
    firebase().auth().addAuthStateChangeListener((user) => {
      this.authStatusSub.next(user);
    });
    if(this.auth.currentUser) this.setUserProperties();
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  get lastName() {
    return this._lastName();
  }

  set lastName(lastname: string) {
    this._lastName.set(lastname);

  }
  get email(): string {
    return this.currentUser.email;
  }

  get firstName(): string {
    return this._firstName();
  }

  get userName() {
    return this._fullName();
  }

  get born(): string {
    return this._bornDate();
  }

  get sex(): string {
    return this._sex();
  }

  private createUser(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  private createUserProfile(uid: string, firstName: string, lastName: string, genre: string, born: string) {
    return firebase().firestore()
      .collection("users")
      .doc(uid)
      .set({
        firstName,
        lastName,
        genre,
        born,
        createdAt: new Date()
      });
  }

  register(email: string, password: string, firstName: string, lastName: string, genre: string, born: string) {
    return this.createUser(email, password).then(async (credential) => {
      if (!credential.user) return;

      await this.createUserProfile(credential.user.uid, firstName, lastName, genre, born);
      await credential.user.sendEmailVerification();
      await firebase().auth().signOut();
    })
      .catch((error) => {
        console.error("Hiba a regisztráció során:", error);
        throw error;
      });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login(email: string, password: string): Promise<string> {
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
      this._lastName.set('');
      this._firstName.set('');
      this._bornDate.set('');
      this._fullName.set('');
      this._sex.set('');
      this.routerExtensions.navigate(['login']);
    });
  }

  resetPassword(data) {
    return this.auth.sendPasswordResetEmail(data);
  }

  setUserProperties() {
    console.log('hallo itt vagyok');
    return firebase().firestore()
      .collection("users")
      .doc(this.currentUser.uid)
      .onSnapshot((doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        this._firstName.set(data?.firstName ?? '');
        this._lastName.set(data?.lastName ?? '');
        this._sex.set(data?.genre ?? '');
        this._bornDate.set(data?.born ?? '');
        this._fullName.set(this._firstName() + ' ' + this._lastName());
      });
  }

}
