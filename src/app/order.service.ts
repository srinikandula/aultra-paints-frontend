import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Create a new branch with products
  createBranch(branchData: Branch): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, branchData);
  }

  // Method to get all branches with pagination
  getBranches(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Search a branch by BatchNumber
  searchBranch(batchNumber: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/${batchNumber}`);
  }
  
    // Update branch by BatchNumber
  updateBranch(updatedBranch: any, batchNumber: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${batchNumber}`, updatedBranch);
  }
  
  // Method to delete a branch by BatchNumber
  deleteBranch(batchNumber: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${batchNumber}`);
  }
}
