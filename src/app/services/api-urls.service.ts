import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiUrlsService {

    constructor() {
    }

    mainUrl = "http://localhost:4300/api/";
    // mainUrl = "https://paintsapi.whizzard.in/api/";

    // Users API URLs
    getUsers = 'users/all';
    addUser = 'users/add';
    updateUser = 'users';
    deleteUser = 'users';
    searchUser = 'users/searchUser';
    toggleUserStatus = 'users/toggle-status';

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
    getProductById = 'products';
    updateProduct = 'products';
    deleteProduct = 'products';

    // API Urls for Brands
    createBrand = 'brands';
    getBrands = 'brands';
    getBrandsByProductId = 'brands';
    updateBrand = 'brands';
    deleteBrand = 'brands';
    getAllBrandsForSelect = 'brands/getAllBrandsForSelect/'
}
