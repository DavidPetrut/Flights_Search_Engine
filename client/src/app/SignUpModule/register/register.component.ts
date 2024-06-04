// app/sign-up-module/register/register.component.ts
import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../ServicesSignUp/Auth/auth.service';
import { Router } from '@angular/router';

declare let grecaptcha: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  isLoading = false;
  alertMsg = '';
  alertColor = 'text-green-500';
  recaptchaReady: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private renderer: Renderer2
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, this.customUsernameValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    }, { validators: this.checkPasswords.bind(this) });
  }

  ngOnInit(): void {
    this.loadRecaptcha();
  }

  loadRecaptcha() {
    const script = this.renderer.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      this.recaptchaReady = true;
    };
  }

  customUsernameValidator(control: AbstractControl): { [key: string]: any } | null {
    // Implement your username validation logic here
    // For demonstration, returning null which means valid
    return null;
  }

  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('repeatPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  handleSignUp() {
    if (this.signUpForm.invalid || !this.recaptchaReady) {
      this.alertMsg = "Please correct the errors before submitting.";
      this.alertColor = 'text-red-500';
      return;
    }

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      this.alertMsg = "Please verify you're not a robot.";
      this.alertColor = 'text-red-500';
      return;
    }

    this.isLoading = true;
    const { username, email, password } = this.signUpForm.value;
    this.authService.register({ username, email, password, recaptchaResponse: recaptchaResponse }).subscribe({
      next: (response) => {
        // Success logic here
        this.router.navigate(['/login']); // Example success route
        this.isLoading = false;
      },
      error: (error) => {
        // Error handling logic here
        this.isLoading = false;
      }
    });
  }
}
