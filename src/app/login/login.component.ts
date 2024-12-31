import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {first} from "rxjs";
import Swal from 'sweetalert2';


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


        this.authService.logIn(this.mobile, this.password).pipe(first()).subscribe({
          next: (data: any) => {
            console.log("Logged in successfully!");

            // SweetAlert for success
            Swal.fire({
              title: 'Success!',
              text: 'Login successful. Redirecting to your dashboard.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/dashboard']); 
            });
          },
          error: (error: any) => {
            this.errorMessage = error.error.message || 'An error occurred during login.';
            console.log(this.errorMessage);

            // SweetAlert for error
            Swal.fire({
              title: 'Error!',
              text: this.errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
  }
}
