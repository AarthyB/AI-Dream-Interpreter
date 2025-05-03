
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}


  signup() {
    this.authService.signup(this.email, this.password)
      .then(() => {
        this.router.navigate(['/journal']);
      })
      .catch(() => {
        alert('❌ Signup failed.');
      });
  }
}
