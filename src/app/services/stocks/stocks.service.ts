import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiUrl = 'https://ivwchatbot-default-rtdb.europe-west1.firebasedatabase.app/stocks.json';

  constructor(private http: HttpClient) { }

  getStocks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
