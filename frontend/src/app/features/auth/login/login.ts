import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';

  protected readonly authService = inject(AuthService);

  constructor(private router: Router) {}

  login() {
    alert(`Zalogowano jako: ${this.email}`);
    this.authService.login();
    this.router.navigate(['/feed']);
  }
}
