import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  errorMessage = '';
  successMessage = '';
  loading = false;

  otpSent = false;
  otpVerified = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CUSTOMER', [Validators.required]]
    });
  }

  // ✅ Send OTP
  sendOtp(): void {
    const email = this.registerForm.get('email')?.value;

    if (!email) {
      this.errorMessage = 'Please enter email first';
      return;
    }

    this.loading = true;

    this.auth.sendOtp(email).subscribe({
      next: () => {
        this.loading = false;
        this.otpSent = true;
        this.successMessage = 'OTP sent successfully to your email';
        this.errorMessage = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to send OTP';
      }
    });
  }

  // ✅ Verify OTP (FIXED: only send email + otp)
  verifyOtp(): void {

  const requestData = {
    email: this.registerForm.value.email,
    otp: this.registerForm.value.otp
  };

  this.loading = true;

  this.auth.verifyOtp(requestData).subscribe({
    next: () => {
      this.loading = false;
      this.otpVerified = true;
      this.successMessage = 'OTP verified successfully';
      this.errorMessage = '';
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'Invalid or expired OTP';
    }
  });
}
  // ✅ Final Registration (NEW FIX)
  onSubmit(): void {

    if (!this.otpVerified) {
      this.errorMessage = 'Please verify OTP first';
      return;
    }

    const userData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    this.loading = true;

    this.auth.register(userData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registered successfully! Redirecting to login...';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Registration failed';
      }
    });
  }
}
``