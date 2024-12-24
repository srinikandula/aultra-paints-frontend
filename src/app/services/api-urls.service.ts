import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {

  constructor() { }
  mainUrl = "http://localhost:4300/api/";

  // API Urls
  register = 'auth/register';

  // batchApiUrls
  createBatch = 'batchNumbers'
  getBatches = 'batchNumbers';
  searchBranch = 'batchNumbers/';

//   transactions
  getTransactions = 'transaction';
}
