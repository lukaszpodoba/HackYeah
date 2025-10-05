// // src/app/services/auth.service.ts
// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private http = inject(HttpClient);
//   // Dostosuj do swojego backendu FastAPI:
//   private baseUrl = 'http://127.0.0.1:8000';

//   async login(email: string, password: string): Promise<void> {
//     // Przykład kontraktu: POST /auth/login -> { access_token, token_type }
//     try {
//       const res = await this.http.post<{ access_token: string; token_type: string }>(
//         `${this.baseUrl}/auth/login`,
//         { email, password }
//       ).toPromise();

//       if (!res?.access_token) {
//         throw new Error('Brak tokenu w odpowiedzi.');
//       }
//       localStorage.setItem('access_token', res.access_token);
//     } catch (err: any) {
//       // Mapuj błąd według swojej odpowiedzi z API
//       const msg = err?.error?.detail || err?.message || 'Błąd logowania.';
//       throw new Error(msg);
//     }
//   }

//   logout() {
//     localStorage.removeItem('access_token');
//   }

//   get token() {
//     return localStorage.getItem('access_token');
//   }

//   isAuthenticated() {
//     return !!this.token;
//   }
// }
