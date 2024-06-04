import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../ServicesSignUp/Profile/profile.service';
import { AuthService } from '../ServicesSignUp/Auth/auth.service';

@Component({
  selector: 'app-profile-description',
  templateUrl: './profile-description.component.html',
  styleUrls: ['./profile-description.component.css']
})
export class ProfileDescriptionComponent implements OnInit {
  profileForm: FormGroup;
  username: string | null = null;
  predefinedQuestions = [
    "What's your favorite hobby?",
    "What's the last book you read?",
    "What's a fun fact about you?",
    "What's your dream vacation destination?",
    "If you could have any superpower, what would it be?",
    "What's your favorite movie of all time?",
    "What's your favorite way to relax?",
    "If you could learn any skill, what would it be?",
    "What's your favorite thing to do on weekends?",
    "What's the best meal you've ever had?",
    "What's one goal you have for this year?",
    "If you could meet anyone, alive or dead, who would it be?",
    "What's your favorite memory from childhood?",
    "What's something you're proud of?",
    "If you could live anywhere, where would it be?"
  ];

  constructor(
    private authService: AuthService, // Inject AuthService
    private fb: FormBuilder, 
    private profileService: ProfileService, 
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      bio: ['', Validators.required],
      status: [''],
      favorites: [''],
      vision: [''],
      contact: [''],
      faq: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Fetch the username
    if (this.username) {
      this.loadProfileData(this.username); // Pass username to loadProfileData
    } else {
      console.error('Username is not available');
    }
  }

  loadProfileData(username: string): void {
    this.profileService.getProfile(username).subscribe(data => { // Pass username to service
      this.profileForm.patchValue(data);
      if (data.faq && data.faq.length > 0) {
        this.faq.clear(); // Clear existing form array
        data.faq.forEach((faq: any) => this.addFaq(faq));
      }
    }, error => {
      console.error('Failed to load profile data', error);
    });
  }

  get faq(): FormArray {
    return this.profileForm.get('faq') as FormArray;
  }

  addFaq(faqData: any = { question: '', answer: '' }): void {
    const faqGroup = this.fb.group({
      question: [faqData.question, Validators.required],
      answer: [faqData.answer]
    });
    this.faq.push(faqGroup);
  }

  removeFaq(index: number): void {
    this.faq.removeAt(index);
  }

  handleFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.username) { // Check if username is available
      this.profileService.uploadImage(this.username, file).subscribe(() => { // Pass username to service
        alert('Image uploaded successfully');
        this.loadProfileData(this.username as string); // Reload profile data
      }, error => {
        console.error('Failed to upload image', error);
      });
    }
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    if (this.username) { // Check if username is available
      this.profileService.updateProfile(this.username, this.profileForm.value).subscribe({ // Pass username and form value to service
        next: () => {
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']); // Adjust as necessary
        },
        error: (error) => {
          console.error('Failed to update profile', error);
        }
      });
    } else {
      console.error('Username is not available');
    }
  }
}
