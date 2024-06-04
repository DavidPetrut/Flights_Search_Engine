import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/SignUpModule/ServicesSignUp/Auth/auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from 'src/app/SignUpModule/ServicesSignUp/Auth/auth.service';


// @Injectable({
//   providedIn: 'root'
// })
// export class A implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (!this.authService.isAuthenticated()) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
// }
