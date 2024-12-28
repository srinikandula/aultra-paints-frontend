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
    return this.http.get<any>(this.ApiUrls.mainUrl+ subUrl + '/' +batchNumber).pipe(map((res: any) => {
      return res;
    }));
  }

  getCouponSeries(subUrl: any) {
    return this.http.get<any>(this.ApiUrls.mainUrl + subUrl).pipe(map((res: any) => {
      return res;
    }));
  }




  // Create a new product
  createProduct(data: any) {
    return this.http.post(this.ApiUrls.mainUrl + this.ApiUrls.createProduct, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Get all products
  getProducts(data: any) {
    const params = new HttpParams()
      .set('page', data.page.toString())
      .set('limit', data.limit.toString());

    return this.http.get(this.ApiUrls.mainUrl + this.ApiUrls.getProducts, { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Get a product by its ID
  getProductById(id: string) {
    return this.http.get(this.ApiUrls.mainUrl + this.ApiUrls.getProductById + '/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Update a product by its ID
  updateProduct(id: string, data: any) {
    return this.http.put(this.ApiUrls.mainUrl + this.ApiUrls.updateProduct + '/' + id, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Delete a product by its ID
  deleteProduct(id: string) {
    return this.http.delete(this.ApiUrls.mainUrl + this.ApiUrls.deleteProduct + '/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

   // Create a new brand
   createBrand(data: any) {
    return this.http.post(this.ApiUrls.mainUrl + this.ApiUrls.createBrand, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Get all brands
  getAllBrands(data: any) {
    const params = new HttpParams()
      .set('page', data.page.toString())
      .set('limit', data.limit.toString());
    
    return this.http.get(this.ApiUrls.mainUrl + this.ApiUrls.getBrands, { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Get brands by Product ID
  getBrandsByProductId(proId: string) {
    return this.http.get(this.ApiUrls.mainUrl + this.ApiUrls.getBrandsByProductId + '/' + proId).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Update a brand
  updateBrand(id: string, data: any) {
    return this.http.put(this.ApiUrls.mainUrl + this.ApiUrls.updateBrand + '/' + id, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Delete a brand
  deleteBrand(id: string) {
    return this.http.delete(this.ApiUrls.mainUrl + this.ApiUrls.deleteBrand + '/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
