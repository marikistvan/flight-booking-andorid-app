import { Injectable, OnInit, signal } from '@angular/core';
import { async, BehaviorSubject, firstValueFrom, last } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { RouterExtensions } from '@nativescript/angular';
import {
    EmailAuthProvider,
    GoogleAuthProvider,
} from '@nativescript/firebase-auth';
import { GoogleSignin } from '@nativescript/google-signin';
import { localize } from '@nativescript/localize';
import { environment } from '~/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User, UserDetails } from '~/app/models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    sexTypeDict: Record<string, string> = {
        woman: localize('register.woman'),
        man: localize('register.man'),
        other: localize('register.other'),
    };
    private auth = firebase().auth();
    private authStatusSub = new BehaviorSubject<any | null>(null);
    private _fullName = signal<string>('');
    private _firstName = signal<string>('');
    private _lastName = signal<string>('');
    private _bornDate = signal<string>('');
    private _sex = signal<string>('');
    private _isAdmin = signal<boolean>(false);
    private _profilePhoto = signal<string>(null);

    currentAuthStatus = this.authStatusSub.asObservable();

    constructor(
        private routerExtensions: RouterExtensions,
        private http: HttpClient
    ) {
        firebase()
            .auth()
            .addAuthStateChangeListener((user) => {
                this.authStatusSub.next(user);
            });
        if (this.auth.currentUser) this.setUserProperties();
    }

    async getUsers() {
        return await firstValueFrom(
            this.http.get<User[]>(environment.backendUrl + 'api/users/all')
        );
    }

    async getUsersDetails() {
        return await firstValueFrom(
            this.http.get<UserDetails[]>(environment.backendUrl + 'api/users')
        );
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

    get profilePhoto(): string {
        return this._profilePhoto();
    }

    get sex(): string {
        return this._sex();
    }

    get isAdmin(): boolean {
        return this._isAdmin();
    }

    private createUser(email: string, password: string) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    private createUserProfile(
        uid: string,
        firstName: string,
        lastName: string,
        genre: string,
        born: string
    ) {
        return firebase().firestore().collection('users').doc(uid).set({
            firstName,
            lastName,
            genre,
            born,
            createdAt: new Date(),
        });
    }

    register(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        genre: string,
        born: string
    ) {
        return this.createUser(email, password)
            .then(async (credential) => {
                if (!credential.user) return;

                await this.createUserProfile(
                    credential.user.uid,
                    firstName,
                    lastName,
                    genre,
                    born
                );
                await credential.user.sendEmailVerification();
                await firebase().auth().signOut();
            })
            .catch((error) => {
                console.error('Hiba a regisztráció során:', error);
                throw error;
            });
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async login(email: string, password: string) {
        try {
            const cred = await firebase()
                .auth()
                .signInWithEmailAndPassword(email, password);
            const user = cred.user;

            if (user && !user.emailVerified) {
                await firebase().auth().signOut();
                throw new Error('need-email-validate');
            }

            this.setUserProperties();
            this.routerExtensions.navigate(['flightSearch']);
        } catch (error) {
            throw error;
        }
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
        if (this.isGoogleUser) {
            GoogleSignin.disconnect();
        }
        return this.auth.signOut().then(() => {
            this._lastName.set('');
            this._firstName.set('');
            this._bornDate.set('');
            this._fullName.set('');
            this._sex.set('');
            this._profilePhoto.set(null);
            this.routerExtensions.navigate(['login']);
        });
    }

    resetPassword(data) {
        return this.auth.sendPasswordResetEmail(data);
    }

    async isUserDocExists(): Promise<boolean> {
        const doc = await firebase()
            .firestore()
            .collection('users')
            .doc(this.currentUser.uid)
            .get();

        return doc.exists;
    }

    setUserProperties() {
        return firebase()
            .firestore()
            .collection('users')
            .doc(this.currentUser.uid)
            .onSnapshot((doc) => {
                if (!doc.exists) return;

                const data = doc.data();
                this._firstName.set(data?.firstName ?? '');
                this._lastName.set(data?.lastName ?? '');
                this._sex.set(this.sexTypeDict[data?.genre] ?? '');
                this._bornDate.set(data?.born ?? '');
                this._fullName.set(this._firstName() + ' ' + this._lastName());
                this._isAdmin.set(data?.admin ?? false);
                this._profilePhoto.set(data?.profileImageUrl ?? null);
            });
    }

    isGoogleUser(): boolean {
        const user = this.auth.currentUser;
        if (!user) return false;

        return user.providerData.some((p) => p.providerId === 'google.com');
    }

    async Reauthenticate(password: string): Promise<boolean> {
        const user = firebase().auth().currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        try {
            await user.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            await GoogleSignin.configure({});
            const user = await GoogleSignin.signIn().then((user) => {
                const credential = GoogleAuthProvider.credential(
                    user.idToken,
                    user.accessToken
                );
                firebase().auth().signInWithCredential(credential);
            });
        } catch (e) {
            console.error('Google Sign-In hiba:', e);
            throw e;
        }
    }
}
