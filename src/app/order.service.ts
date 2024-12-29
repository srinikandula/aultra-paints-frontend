import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface BatchNumber {
  BatchNumber: string;
  Brand: string;
  ProductName: string;
  Volume: number;
  Quantity: number;
}

export interface Branch {
  Branch: string;
  CreationDate: string;  // Could be Date if needed
  ExpiryDate: string;    // Could be Date if needed
  BatchNumbers: BatchNumber[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:4300/api/branches';  // Adjust if your API is hosted on a different URL
  searchBranches: any;

  constructor(private http: HttpClient) { }


    // Update branch by BatchNumber
  updateBranch(updatedBranch: any, batchNumber: string): Observable<any> {
    console.log(updatedBranch, batchNumber)
    return this.http.put<any>(`${this.apiUrl}/${batchNumber}`, updatedBranch);
  }
  
  // Method to delete a branch by BatchNumber
  deleteBranch(id: string): Observable<any> {
    let url = 'this.apiUrl' + '/delete/' + id
    console.log(url)
    // return this.http.delete<any>(url);
    return this.http.delete(url).pipe(map((res: any) => res)
    );
  }
}
