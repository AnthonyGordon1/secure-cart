// auth.ts
// Combined login and register component.
// Uses the current route to determine which form to show.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent implements OnInit {

  // Controls which form is shown
  isLoginMode = true;

  // The reactive form
  authForm!: FormGroup;

  // Error message from the backend
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Set mode based on current route
    this.isLoginMode = this.route.snapshot.url[0]?.path !== 'register';

    // Build the form
    this.authForm = this.fb.group({
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { username, email, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          // Save JWT to localStorage
          this.authService.saveToken(response.token);
          // Redirect to product page
          this.router.navigate(['/products']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
        }
      });
    } else {
      this.authService.register(username, email, password).subscribe({
        next: () => {
          // After register redirect to login
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'Registration failed. Username or email may already exist.';
        }
      });
    }
  }

  // Toggle between login and register
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.router.navigate([this.isLoginMode ? '/login' : '/register']);
  }
}