import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification-success',
  templateUrl: './email-verification-success.component.html',
  styleUrls: ['./email-verification-success.component.css']
})
export class EmailVerificationSuccessComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000); // Redirect after 5 seconds
  }
}
