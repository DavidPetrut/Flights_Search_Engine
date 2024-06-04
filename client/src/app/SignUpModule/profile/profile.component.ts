import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../ServicesSignUp/Profile/profile.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../ServicesSignUp/Auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    // Fetching the username from AuthService
    const username = this.authService.getUsername();
    if (username) {
      this.profileService.getProfile(username).subscribe(
        (data) => {
          this.profileData = data;
          console.log('Profile data loaded:', this.profileData);
        },
        (error) => {
          console.error('Failed to load profile data:', error);
        }
      );
    } else {
      console.error('Username is not available.');
    }
  }

  handleFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    const username = this.authService.getUsername();
    if (!username) {
      console.error('Username is not available for file upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // Using ProfileService to handle file upload
    this.profileService.uploadImage(username, file).subscribe(
      (response: any) => {
        console.log('Image uploaded successfully:', response);
        // Reloading the profile data to reflect the new image
        this.loadProfileData();
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }

  navigateToUpdateProfile(): void {
    this.router.navigate(['/updateProfile']);
  }


  navigateToPredictionFlights(): void {
    window.open("http://127.0.0.1:8000/", '_blank')
  }
}
