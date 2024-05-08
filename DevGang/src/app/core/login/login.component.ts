import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UserServiceService } from '../../user-service.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder, // Inject FormBuilder
    private authService: AuthService, // AuthService injection
    private router: Router,
    private mainLayout: MainLayoutComponent,
    private userService: UserServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], // Initialize form controls with validation
      password: ['', Validators.required]
    });
  }
  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.authService.login(username, password).subscribe({
        next: (res) => {
          if(res.message === 'Login successful'){
            console.log('Login successful', res);
            this.mainLayout.loginChecked();
            this.userService.setUsername(res.user.username);
            localStorage.setItem('username', res.user.username);
            if (isPlatformBrowser(this.platformId)) {
              console.log(localStorage.getItem('username'))
            }
            
          // Handle response and navigate or show a message
          this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Signup error:', error);
          // Optionally handle errors, such as displaying an error message
        }
      });
    } else {
      console.error('Form is not valid');
    }
  }

}
