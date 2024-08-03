import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private apiUrl = 'http://localhost:3000/stocks';

  constructor(private http: HttpClient) { }

  getStocks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
