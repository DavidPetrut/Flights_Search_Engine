import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../ServicesSignUp/Email/email.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private emailService: EmailService, private router: Router) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log("Extracted token:", token);
    if (token) {
      this.emailService.verifyEmail(token).subscribe({
        next: () => {
          console.log('Email verification successful. Redirecting to login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Verification failed:', error);
          // Here, you might want to handle the error more gracefully
          // For example, showing an error message to the user
        }
      });
    }
  }
}
