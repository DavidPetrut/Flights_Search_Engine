import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-student-id-check',
  templateUrl: './student-id-check.component.html',
  styleUrls: ['./student-id-check.component.css']
})
export class StudentIdCheckComponent implements OnInit {
  displayVerificationPopup = false;
  verificationSent = false; 
  studentEmail = '';
  studentNumber = '';
  selectedUniversity = '';
  universities: any[] = [];
  showAlert = false;
  alertMessage = '';
  isSuccessAlert = false;
  isVerified = false;

  userId = '';

  @ViewChild('verificationCodeInput') verificationCodeInput?: ElementRef<any>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUniversities();
    emailjs.init("XCpsheUoiGXeu2TVH");
    this.checkVerificationStatus();
  }



  // New method to check if the user is verified
checkVerificationStatus() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.warn("User not logged in.");
    return;
  }
  
  const user = JSON.parse(userStr);
  // Assuming you have an endpoint `/api/user/isVerified` that returns { isVerified: true/false }
  this.http.get<{isVerified: boolean}>(`http://localhost:8001/api/users/isVerified?email=${user.email}`).subscribe({
    next: response => {
      this.isVerified = response.isVerified;
    },
    error: error => {
      console.error("Error fetching verification status:", error);
    }
  });
}

  fetchUniversities() {
    this.http.get('http://localhost:8001/api/users/universities').subscribe(data => {
      this.universities = data as any[];
    }, error => {
      this.customAlert("Failed to fetch universities data. Please try again.", false);
    });
  }

  onVerifyEmail() {
    if (!this.studentNumber || !this.studentEmail || !this.selectedUniversity) {
      this.customAlert("Please ensure all fields are filled correctly.", false);
      return;
    }
  
    const emailToSendVerification = this.getLocalStorageEmail();
    if (!emailToSendVerification) {
      this.customAlert("User email not found. Please log in.", false);
      return;
    }
  
    const emailDomain = this.studentEmail.split('@')[1];
    const isDomainValid = this.universities.some(u => u.name === this.selectedUniversity && u.domains.includes(emailDomain));
  
    if (!isDomainValid) {
      this.customAlert("Email domain does not match the selected university.", false);
      return;
    }
  
    // Trigger backend to generate and send the verification code to the studentEmail, but for verification purposes, use emailToSendVerification
    this.http.post('http://localhost:8001/api/users/send-verification', { email: emailToSendVerification })
      .subscribe({
        next: (response: any) => {
          // Trigger EmailJS to send the verification code email to the student's email
          emailjs.send("service_da87pyk", "template_39kkkdf", {
            to_email: this.studentEmail,
            from_name: "University Verification System",
            message: `Your verification code is: ${response.code}`,
          })
          .then(() => {
            this.customAlert("A verification code has been sent to your student email. Please check your inbox.", true);
            this.displayVerificationPopup = true; // To show code input field
          })
          .catch((error) => {
            console.error('EmailJS error:', error);
            this.customAlert("Failed to send verification email. Please try again.", false);
          });
          this.displayVerificationPopup = true;
        },
        error: (error) => {
          console.error('Backend verification initiation failed:', error);
          this.customAlert("Failed to initiate verification process. Please try again.", false);
        }
      });
      this.verificationSent = true;
  }
  
  getLocalStorageEmail() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).email : null;
  }

  onVerifyCode() {
    const verificationCode = this.verificationCodeInput?.nativeElement.value;
    this.http.post('http://localhost:8001/api/users/verify-code', { code: verificationCode })
    .subscribe({
      next: () => {
        this.isVerified = true; // Update verification status
        this.displayVerificationPopup = false; // Optionally hide the verification input and button
        this.customAlert("Verification successful. You are now verified as a student.", true);
      },
      error: () => {
        this.customAlert("Verification failed. Please try again.", false);
      }
    });
  }
  
    
  
  


  customAlert(message: string, isSuccess: boolean) {
    this.alertMessage = message;
    this.isSuccessAlert = isSuccess;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 5000); // Auto-hide alert
  }
}
