// app/sign-up-module/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, of } from 'rxjs';


export interface UserProfile {
  username: string;
  email: string;
  profileImage?: any; 
  isStudent?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8001/api/users';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; password: string; recaptchaResponse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }


  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (!response.token) {
          console.error('Login response is missing the token');
        } else {
          // Manually constructing the user object from the response
          const user = {
            username: response.username,
            email: response.email,
            profileImage: response.profileImage,
            isStudent: response.isStudent,
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.isAuthenticatedSubject.next(true);
          this.userProfileSubject.next(user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Failed to login'));
      })
    );
  }
  
  
  


  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private fetchAndUpdateUserProfile(username: string): void {
    this.http.get<any>(`${this.apiUrl}/profile/${username}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(
      userProfile => {
        // Update local storage and BehaviorSubject with the fetched profile data
        localStorage.setItem('user', JSON.stringify(userProfile));
        this.userProfileSubject.next(userProfile);
      },
      error => console.error('Failed to fetch user profile:', error)
    );
  }



  public getUserProfile(): Observable<UserProfile | null> {
    return this.userProfileSubject.asObservable();
  }


  public getUsername(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user ? user.username : null;
  }
  

  updateUserProfile(updatedProfile: any): void {
    localStorage.setItem('user', JSON.stringify(updatedProfile));
    this.userProfileSubject.next(updatedProfile);
  }


  isUserAStudent(): Observable<boolean> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Directly return the isStudent status from the local storage user information
    const isStudent = user.isStudent || false;
    return of(isStudent); 
  }


  // In AuthService
isUserAStudentAndOfferUsed(): Observable<{isStudent: boolean, offerUsed: boolean}> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const email = user.email;

  if(email) {
    return this.http.get<{isVerified: boolean, studentOfferUsed: boolean}>(`http://localhost:8001/api/users/isVerified?email=${email}`)
      .pipe(
        map(response => ({isStudent: response.isVerified, offerUsed: response.studentOfferUsed})),
        catchError(() => of({isStudent: false, offerUsed: false}))
      );
  } else {
    return of({isStudent: false, offerUsed: false});
  }
}




}



