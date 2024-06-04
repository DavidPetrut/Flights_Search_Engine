import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmadeusService {

  private djangoUrl = 'http://127.0.0.1:8000/'; // Update with the correct URL

  // Define httpOptions as a property of the class
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getOriginAirports(searchTerm: string): Observable<any> {
    return this.http.get(`${this.djangoUrl}origin_airport_search/`, {
      params: { term: searchTerm },
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
    });
  }
}
