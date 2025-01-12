import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiUrlsService {

    constructor() {
    }

    mainUrl = "http://localhost:4300/api/";
    // mainUrl = "https://api.aultrapaints.com/api/";

    // Users API URLs
    getUsers = 'users/all';
    addUser = 'users/add';
    updateUser = 'users';
    deleteUser = 'users';
    searchUser = 'users/searchUser';
    toggleUserStatus = 'users/toggle-status';
    resetPassword = 'users/resetPassword';
    userDashboard = 'users/userDashboard';

    // API Urls
    register = 'auth/register';

    // batchApiUrls
    createBatch = 'batchNumbers/add'
    getBatches = 'batchNumbers';
    searchBranch = 'batchNumbers/';
    couponSeries = 'batchNumbers/couponSeries';
    updateBatch = 'batchNumbers/update/';
    deleteBatch = 'batchNumbers/delete/';
    branchDeletedAffectedCouponsCount = 'batchNumbers/branchDeletedAffectedCouponsCount/'

//   transactions
    getTransactions = 'transaction';


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
    getAllBrandsForSelect = 'brands/getAllBrandsForSelect/'
    searchBrandsByName = 'brands/search'

    // API Urls for Product Offers
    createProductOffer = 'productOffers/create';
    searchProductOffers = 'productOffers/searchProductOffers'
    getProductOffers = 'productOffers/getProductOffers';
    getProductOfferById = 'productOffers/getProductOfferById/';
    updateProductOffer = 'productOffers/update/';
    deleteProductOffer = 'productOffers/delete/';

    // API Urls for Reward Schemes
    createRewardScheme = 'rewardSchemes/create';
    searchRewardSchemes = 'rewardSchemes/searchRewardSchemes'
    getRewardSchemes = 'rewardSchemes/getRewardSchemes';
    getRewardSchemeById = 'rewardSchemes/getRewardSchemeById/';
    updateRewardScheme = 'rewardSchemes/update/';
    deleteRewardScheme = 'rewardSchemes/delete/';
}
