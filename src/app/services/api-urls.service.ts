import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {

  constructor() { }
  mainUrl = "http://localhost:4300/api/";
  // mainUrl = "https://paintsapi.whizzard.in/api/";

  // API Urls
  register = 'auth/register';

  // batchApiUrls
  createBatch = 'batchNumbers/add'
  getBatches = 'batchNumbers';
  searchBranch = 'batchNumbers/';
  couponSeries = 'batchNumbers/couponSeries'

//   transactions
  getTransactions = 'transaction';


    // Product URLs
    createProduct = 'products'; 
    getProducts = 'products';   
    getProductById = 'products'; 
    updateProduct = 'products';  
    deleteProduct = 'products';  

    // API Urls for Brands
  createBrand = 'brands'; 
  getBrands = 'brands';   
  getBrandsByProductId = 'brands'; 
  updateBrand = 'brands'; 
  deleteBrand = 'brands'; 
}
