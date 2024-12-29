import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {first} from "rxjs";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // email: string = '';
  mobile: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService.logIn(this.mobile, this.password).pipe(first()).subscribe((data: any) => {
      console.log("Loggedin Successfully..!")
          // this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        (error: any) => {
      this.errorMessage = error.error.message;
      console.log(error.error.message);

    });
  }
}
