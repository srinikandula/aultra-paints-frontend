import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiUrlsService } from "./api-urls.service";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  returnUrl: string = '';

  constructor(
      private http: HttpClient,
      private apiUrls: ApiUrlsService,
      private router: Router,
      private route: ActivatedRoute
  ) {
    // Check if `localStorage` is available before accessing it
    const storedToken = this.isLocalStorageAvailable()
        ? JSON.parse(localStorage.getItem('authToken') || 'null')
        : null;

    this.currentUserSubject = new BehaviorSubject<any>(storedToken);
    this.currentUser = this.currentUserSubject.asObservable();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Helper to check if `localStorage` is available
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): string | null {
    if (this.isLocalStorageAvailable()) {
      return JSON.parse(localStorage.getItem('authToken') || 'null');
    }
    return null;
  }

  logIn(mobile: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrls.mainUrl + 'auth/login', { mobile, password })
        .pipe(map(response => {
          if (response) {
            if (this.isLocalStorageAvailable()) {
              localStorage.setItem('authToken', JSON.stringify(response));
            }
            this.router.navigate([this.returnUrl]);
            this.currentUserSubject.next(response);
          }
          return response;
        }));
  }

  logOut(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('authToken');
    }
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
  }
}
