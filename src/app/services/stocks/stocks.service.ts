import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StocksService {
  private apiUrl = environment.firebaseConfig.databaseUrl + '/stocks.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all stocks from the API.
   * @returns Observable<any>
   */
  getStocks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
