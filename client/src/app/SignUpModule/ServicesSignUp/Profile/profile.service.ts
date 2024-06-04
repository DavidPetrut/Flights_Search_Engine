// app/sign-up-module/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl = 'http://localhost:8001/api/users'; // Base URL for your API

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method adjusted to accept username
  getProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${username}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Method adjusted to accept username and profileData
  updateProfile(username: string, profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/update/${username}`, profileData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Method adjusted to accept username and file
  uploadImage(username: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}/upload/${username}`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
  }
}
