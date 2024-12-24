import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {ApiUrlsService} from "./api-urls.service";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  returnUrl: string = '';


  constructor(private http: HttpClient,
              private apiUrls: ApiUrlsService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('authToken')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): string {
    // @ts-ignore
    return localStorage.getItem('authToken');
  }

  logIn(email: string, password: string): any {
    return this.http.post<any>(this.apiUrls.mainUrl + '/auth/login', {email, password})
        .pipe(map(response => {
          if (response) {
            console.log(response)
            localStorage.setItem('authToken', JSON.stringify(response));
            this.router.navigate([this.returnUrl]);
            this.currentUserSubject.next(response);
          }
          return response;
        }));
  }

  logOut(): any {
    // @ts-ignore
    localStorage.clear('authToken');
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
  }
}
