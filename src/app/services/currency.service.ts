import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ExchangeApi } from '~/app/models/exchangeApi';
import { getString, setString } from '@nativescript/core/application-settings';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
    private baseUrl = 'https://api.exchangerate.host';
    private key = environment.exChangeRateApiAccessKey;
    currentCurreny: Observable<ExchangeApi>;
    constructor(private http: HttpClient) { }

    getRates(): Promise<ExchangeApi["quotes"]> {
        const lastExchangeApiUpdate = getString('lastExchangeApiUpdate');

        if (lastExchangeApiUpdate === new Date().toDateString()) {
            return Promise.resolve(JSON.parse(getString('lastExchangeApiQuotes')));
        }

        return new Promise((resolve, reject) => {
            this.http.get<ExchangeApi>(`${this.baseUrl}/live?access_key=${this.key}&currencies=HUF,CHF,EUR`)
                .subscribe({
                    next: (res) => {
                        setString('lastExchangeApiQuotes', JSON.stringify(res.quotes));
                        setString('lastExchangeApiUpdate', new Date().toDateString());
                        resolve(res.quotes);
                    },
                    error: (err) => reject(err)
                });
        });
    }

}
