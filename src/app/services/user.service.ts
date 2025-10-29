import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EmailAuthProvider } from '@nativescript/firebase-auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '~/environments/environment';
import { AuthService } from './auth.service';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase-core';
import { ImageSource, knownFolders, path } from '@nativescript/core';

@Injectable({ providedIn: 'root' })
export class UserService {
    bornYear: string;
    errors: Array<string>;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private routerExtension: RouterExtensions
    ) { }

    checkIfAdult(birthDate: Date): string {
        let adult = '';
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());
        this.bornYear =
            birthDate.getFullYear() +
            '-' +
            (birthDate.getMonth() + 1) +
            '-' +
            birthDate.getDate();
        if (hasHadBirthdayThisYear ? age >= 18 : age - 1 >= 18) {
            adult = '';
        } else {
            adult = 'Csak felnőttek regisztrálhatnak!';
        }
        return adult;
    }

    isValidEmail(email: string): string {
        let validEmail = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email) === false) {
            validEmail = 'Az email cím nem helyes!';
        }
        return validEmail;
    }
    async updateEmail(email: string): Promise<void> {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/updateEmail',
                    {
                        uid: this.authService.currentUser.uid,
                        newEmail: email,
                    }
                )
            );
            console.log('Siker', res);
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }

    async updatePassword(password: string): Promise<void> {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/updatePassword',
                    {
                        uid: this.authService.currentUser.uid,
                        newPassword: password,
                    }
                )
            );
            console.log('Siker', res);
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }
    deleteUser() {
        this.deleteUsersData(this.authService.currentUser.uid);
        this.authService.currentUser
            .delete()
            .then(() => {
                this.routerExtension.navigate(['login']);
            })
            .catch((error) => {
                throw error;
            });
    }

    private async deleteUsersData(userId: string) {
        firebase()
            .firestore()
            .collection('users')
            .doc(userId)
            .delete()
            .then(() => {
                console.log('sikeresen törölve a user a users kollekcióból.');
            })
            .catch((error) => {
                console.error(
                    'Valami hiba történt a user a users kollekcióból való törlés során: ' +
                    error
                );
            });
        firebase()
            .firestore()
            .collection('conversations')
            .doc(userId)
            .delete()
            .then(() => {
                console.log(
                    'sikeresen törölve a user a conversations kollekcióból.'
                );
            })
            .catch((error) => {
                console.error(
                    'Valami hiba történt a user a conversations kollekcióból való törlés során: ' +
                    error
                );
            });
        firebase()
            .firestore()
            .collection('userBasket')
            .doc(userId)
            .delete()
            .then(() => {
                console.log(
                    'sikeresen törölve a user a userBasket kollekcióból.'
                );
            })
            .catch((error) => {
                console.error(
                    'Valami hiba történt a user a userBasket kollekcióból való törlés során: ' +
                    error
                );
            });
    }

    async updateFullName(firstname: string, lastname: string) {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/updateFullName',
                    {
                        uid: this.authService.currentUser.uid,
                        firstName: firstname,
                        lastName: lastname,
                    }
                )
            );
            console.log('Siker', res);
            return res;
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }
    async updateBorn(bornDate: string) {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/updateBornDate',
                    {
                        uid: this.authService.currentUser.uid,
                        born: bornDate,
                    }
                )
            );
            console.log('Siker', res);
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }

    async updateSex(sex: string) {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/updateSexType',
                    {
                        uid: this.authService.currentUser.uid,
                        sexType: sex,
                    }
                )
            );
            console.log('Siker', res);
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }

    async updatePhoto(photo: string) {
        try {
            const res = await firstValueFrom(
                this.http.post(
                    environment.backendUrl + 'api/user/upload-profile-image',
                    {
                        uid: this.authService.currentUser.uid,
                        base64Image: photo,
                    }
                )
            );
            console.log('Siker', res);
        } catch (err) {
            console.error('Hiba', err);
            throw err;
        }
    }

    isValidPasswords(
        currentPassword: string,
        password: string,
        anotherPassowrd: string
    ): Array<string> {
        let passworderrors = [];
        if (password == undefined || anotherPassowrd == undefined) {
            passworderrors.push('Nincs kitoltve minden mezo');
            return passworderrors;
        }
        if (password.length < 8) {
            passworderrors.push(
                'A jelszó túl rövid, minimum 8 karakter legyen.'
            );
            return passworderrors;
        }
        if (password != anotherPassowrd) {
            passworderrors.push('jelszavak különböznek!');
            return passworderrors;
        }
        if (password === currentPassword) {
            passworderrors.push(
                'Nem lehet ugyan az a jelszo, mint ami volt eddig!'
            );
            return passworderrors;
        }
        return passworderrors;
    }
    async reauthenticate(email: string, password: string): Promise<boolean> {
        const credential = EmailAuthProvider.credential(
            this.authService.currentUser.email,
            password
        );
        try {
            const userCreacical =
                await this.authService.currentUser.reauthenticateWithCredential(
                    credential
                );
        } catch (error) {
            console.log('error történt ' + error);
            return false;
        }
        return true;
    }
    isValidName(lastName: string, firstName: string): Array<string> {
        let nameErrors = [];
        console.log(lastName + ' ' + firstName);
        if (firstName === undefined || firstName.length == 0) {
            nameErrors.push('Írja be a keresztnevét!');
        }
        if (lastName === undefined || lastName.length == 0) {
            nameErrors.push('Írja be a vezetéknevét!');
        }
        return nameErrors;
    }
    validateDeatils(
        email: string,
        firstName: string,
        lastName: string,
        isGengreOk: boolean,
        bornDateIsOk: boolean,
        password: string,
        confirmPassword: string,
        selectedDate: Date
    ): Array<string> {
        if (!this.isValidEmail(email)) {
            this.errors.push('Az email cím nem helyes!');
        }
        if (firstName === undefined || firstName.length == 0) {
            this.errors.push('Írja be a keresztnevét!');
        }
        if (lastName === undefined || lastName.length == 0) {
            this.errors.push('Írja be a vezetéknevét!');
        }
        if (!isGengreOk) {
            this.errors.push('Válassza ki a nemét!');
        }
        if (selectedDate === undefined) {
            this.errors.push('Válassza ki a születési dátumát!');
        } else if (!bornDateIsOk) {
            this.errors.push('Csak felnőttek regisztrálhatnak!');
        }
        if (password.length < 8) {
            this.errors.push('A jelszó túl rövid, minimum 8 karakter legyen.');
        }
        if (password === confirmPassword) {
            console.log('jelszavak megegyeznek!');
        } else {
            console.log('jelszavak különböznek!');
            this.errors.push('jelszavak különböznek!');
        }
        return this.errors;
    }

    public loadSavedImage(): ImageSource {
        const documents = knownFolders.documents();
        const filePath = path.join(documents.path, 'myImage.png');

        const imageSource = ImageSource.fromFileSync(filePath);
        if (imageSource) {
            return imageSource; // bármilyen <Image [src]="imageSrc"> meg tudja jeleníteni
        } else {
            console.log('Kép nem található: ' + filePath);
            return imageSource;
        }
    }
}
