import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserProfile } from 'src/app/SignUpModule/ServicesSignUp/Auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  userProfile$ = this.authService.userProfile$;
  showDropdown = false;

  constructor(private authService: AuthService) {
    this.userProfile$ = this.authService.userProfile$;
  }

  toggleDropdown($event: MouseEvent): void {
    $event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: Event): void {
    this.showDropdown = false;
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(event: Event): void {
    this.showDropdown = false;
  }

  logout($event: MouseEvent): void {
      $event.preventDefault(); // Prevent default anchor action
      $event.stopPropagation(); // Prevent event bubbling
      this.authService.logout();
      this.showDropdown = false; // Close dropdown on logout
      // Additional logic for after logout if necessary, e.g., redirect to homepage
  } 
}
