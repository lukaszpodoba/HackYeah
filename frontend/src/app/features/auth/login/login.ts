import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  login() {
    alert(`Zalogowano jako: ${this.email}`);
    // po kliknięciu OK na alercie przechodzi na mapę (feed)
    this.router.navigate(['/feed']);
  }
}
