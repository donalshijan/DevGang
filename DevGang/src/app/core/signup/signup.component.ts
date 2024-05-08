import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';  // Ensure correct path
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UserServiceService } from '../../user-service.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private authService: AuthService,private router: Router,private mainLayout: MainLayoutComponent,private userService: UserServiceService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      const { username, password, email } = this.signupForm.value;
      // Call AuthService to handle the actual signup logic
      this.authService.signup(username, password).subscribe({
        next: (res) => {
          if(res.signupResponse.message === 'Signup successful'){
            console.log('Signup successful', res);
            this.mainLayout.loginChecked();
            this.userService.setUsername(res.message.user.username)
          // Handle response and navigate or show a message
          // this.router.createUrlTree(['/login']);
          this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Signup error:', error);
          // Optionally handle errors, such as displaying an error message
        }
      });
    }
  }
}
