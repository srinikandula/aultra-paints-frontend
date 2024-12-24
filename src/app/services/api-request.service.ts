import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest} from "@angular/common/http";
import {ApiUrlsService} from "./api-urls.service";
import {map, Observable} from "rxjs";
import {Branch} from "../order.service";

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(private http: HttpClient, private ApiUrls: ApiUrlsService) { }

  create(subUrl: any, data: any) {
    return this.http.post(this.ApiUrls.mainUrl + subUrl, data).pipe(map((res: any) => {
      return res;
    }));
  }

  get(subUrl: any, data:any) {
      const params = new HttpParams()
          .set('page', data.page.toString())
          .set('limit', data.limit.toString());
    return this.http.get(this.ApiUrls.mainUrl + subUrl, { params }).pipe(map((res: any) => {
      return res;
    }));
  }

  searchBranch(subUrl: any, batchNumber: any) {
    return this.http.get<Branch>(this.ApiUrls.mainUrl+ subUrl + '/' +batchNumber).pipe(map((res: any) => {
      return res;
    }));
  }


}
