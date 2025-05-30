import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: SpinnerService) {}

  // tslint:disable-next-line:typedef
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    // console.log("No of requests--->" + this.requests.length);
    this.loaderService.isLoading.next(true);
    return Observable.create((observer: any) => {
      const subscription = next.handle(req).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.removeRequest(req);
          observer.next(event);
        }
      }, err => {
        this.removeRequest(req);
        observer.error(err);
        }, () => {
        this.removeRequest(req);
        observer.complete();
      });
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
