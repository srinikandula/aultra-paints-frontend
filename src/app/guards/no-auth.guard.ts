import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Redirect to dashboard if already authenticated
      this.router.navigate(['/']);
      return false;
    }
    return true; // Allow access to the public route
  }
}

