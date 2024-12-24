import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';


@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {
  constructor(
      private router: Router,
      private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentAccessToken = this.authService.currentUserValue;

    // If token exists and user tries to access login, redirect to dashboard
    if (state.url === '/login' && currentAccessToken && this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }

    if (currentAccessToken && this.authService.isAuthenticated()) {
      return true; // Token exists, allow access to protected routes
    }

    // Redirect to login if no valid token
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
