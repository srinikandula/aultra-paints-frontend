import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
// import {ApiServiceService, AuthService} from "@app/shared/services";
// import {ApiUrls} from "@app/shared/services/apiUrls";
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private apiUrs: ApiUrlsService,
              private apiService: ApiRequestService,
              private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.authService.logOut()
      }
      const error = err.error || err.statusText;
      return throwError(error);
    }));
  }
}
