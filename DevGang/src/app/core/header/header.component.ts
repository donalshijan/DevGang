import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Update the path as necessary
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf], // Import necessary Angular or your own modules
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        // Fetch and display the username
        this.authService.getCurrentUser().subscribe(user => {
          this.username = user.username;
        });
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = null;
    // Add any additional logic here, like redirecting the user
  }
}
