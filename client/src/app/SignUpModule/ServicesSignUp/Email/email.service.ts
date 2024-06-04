// app/sign-up-module/email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`http://localhost:8001/api/users/verify-email?token=${token}`);
  }
}
