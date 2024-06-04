import { Component } from '@angular/core';

declare var grecaptcha: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  siteKey = '6LdKEZopAAAAAJ2B0tapjWLq4aYp5q_ZOdIBcHpc';

  constructor() {}

  verifyRecaptcha() {
    const response = grecaptcha.getResponse();
    console.log('reCAPTCHA response:', response);
    // Call your service to verify reCAPTCHA response
  }
}
