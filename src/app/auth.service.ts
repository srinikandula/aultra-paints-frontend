import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4300/auth'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // Register method
  register(name: string, email: string, password: string): Observable<any> {
    const registerData = { name, email, password };
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

}
