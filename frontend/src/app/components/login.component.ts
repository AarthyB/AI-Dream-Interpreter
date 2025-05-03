
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router,private snackBar: MatSnackBar) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/journal']);
      })
      .catch(() => {
        alert('❌ Login failed.');
      });
  }
 
  forgotPassword() {
    if (!this.email) {
      this.snackBar.open('Please enter your email to reset password', 'Close', { duration: 3000 });
      return;
    }
  
    const auth = getAuth(); // get Firebase Auth instance
  
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
        this.snackBar.open('Password reset email sent ✅', 'Close', { duration: 3000 });
      })
      .catch(error => {
        this.snackBar.open('Error: ' + error.message, 'Close', { duration: 3000 });
      });
  }
  
}
