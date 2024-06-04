// app/sign-up-module/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../ServicesSignUp/Auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  alertMsg = '';
  alertColor = 'text-green-500';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  

  handleLogin() {
    console.log("This is the this.loginForm.value", this.loginForm.value)
    console.log("handleLogin start")
    if (this.loginForm.invalid) {
      this.alertMsg = "Please correct the errors before submitting.";
      this.alertColor = 'text-red-500';
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    console.log(`Attempting login for email: ${email} with password: [REDACTED]`);

    this.authService.login({ email, password }).subscribe({
      next: (data) => {
        // Handle successful login here
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.alertMsg = error.error.message || 'An error occurred during login.';
        this.alertColor = 'text-red-500';
        this.isLoading = false;
      }
    });
  }
  
}
