import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {

  constructor() { }

  // Use dynamic URL from environment file
  mainUrl = environment.apiUrl;

  // Users API URLs
  getUsers = 'users/all';
  addUser = 'users/add';
  updateUser = 'users';
  deleteUser = 'users';
  searchUser = 'users/searchUser';
  toggleUserStatus = 'users/toggle-status';
  resetPassword = 'users/resetPassword';
  userDashboard = 'users/userDashboard';

   //api urls for unverifed users
   getUnverifiedUsers = 'users/unverified-users';

  // API Urls
  register = 'auth/register';

  // batchApiUrls
  createBatch = 'batchNumbers/add';
  getBatches = 'batchNumbers';
  searchBranch = 'batchNumbers/';
  couponSeries = 'batchNumbers/couponSeries';
  updateBatch = 'batchNumbers/update/';
  deleteBatch = 'batchNumbers/delete/';
  branchDeletedAffectedCouponsCount = 'batchNumbers/branchDeletedAffectedCouponsCount/';

  // Transactions
  getTransactions = 'transaction';


//cashFree
getcashfreetransaction = 'cashFree/getTransactions';

  // Product URLs
  createProduct = 'products';
  getProducts = 'products';
  getAllProducts = 'products/getAllProducts';
  getProductByName = 'products/search'; 
  updateProduct = 'products';
  deleteProduct = 'products';

  // API Urls for Brands
  createBrand = 'brands';
  getBrands = 'brands';
  getBrandsByProductId = 'brands';
  updateBrand = 'brands';
  deleteBrand = 'brands';
  getAllBrandsForSelect = 'brands/getAllBrandsForSelect/';
  searchBrandsByName = 'brands/search';

  // API Urls for Product Offers
  createProductOffer = 'productOffers/create';
  searchProductOffers = 'productOffers/searchProductOffers';
  getProductOffers = 'productOffers/getProductOffers';
  getProductOfferById = 'productOffers/getProductOfferById/';
  updateProductOffer = 'productOffers/update/';
  deleteProductOffer = 'productOffers/delete/';

  // API Urls for Reward Schemes
  createRewardScheme = 'rewardSchemes/create';
  searchRewardSchemes = 'rewardSchemes/searchRewardSchemes';
  getRewardSchemes = 'rewardSchemes/getRewardSchemes';
  getRewardSchemeById = 'rewardSchemes/getRewardSchemeById/';
  updateRewardScheme = 'rewardSchemes/update/';
  deleteRewardScheme = 'rewardSchemes/delete/';
}
