import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpClientModule } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AmadeusService {
  private tokenUrl = environment.amadeusTokenUrl;
  private clientId = environment.amadeusClientId;
  private clientSecret = environment.amadeusClientSecret;
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);

    return this.http.post(this.tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  searchFlights(origin: String, destination: String, departureDate: String,returnDate: String,adults:String,childrens:String, max:string): Observable<any> {
    let url;
    if((childrens==undefined || childrens=="") && (returnDate==undefined || returnDate=="")){
      url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&nonStop=false`;
    }
    else if(childrens==undefined || childrens==""){
      url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&nonStop=false`;
    }else if(returnDate==undefined || returnDate==""){
      url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&children=${childrens}&nonStop=false`;
    }
      else{
      url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&children=${childrens}&nonStop=false`;
    }
        return this.http.get(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
  }
  
  searchAirports(keywords: string): Observable<any> {
    const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${keywords}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=LIGHT`;
    return this.http.get(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
  }
}
