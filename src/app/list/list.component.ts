import { Component, OnInit } from '@angular/core';
import {OrderService} from '../order.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [CommonModule, FormsModule, NgSelectComponent],
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    branches: any[] = [];
    currentPage = 1;
    totalPages = 1;
    totalBranches = 0;
    limit = 10;
    searchQuery: string = '';
    showUpdateModal = false;
    selectedBranch: any = {
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        products: {},
        brands: {}
    };
    products: any = [];
    brandData: any = [];

    constructor(private orderService: OrderService,
                private router: Router,
                private ApiUrls: ApiUrlsService,
                private apiRequest: ApiRequestService) {
    }

    ngOnInit(): void {
        this.loadBranches();
        this.apiRequest.getAll(this.ApiUrls.getAllProducts).subscribe((response: any) => {
            this.products = response;
        })
    }

    loadBranches(page: number = this.currentPage): void {
        this.apiRequest.post(this.ApiUrls.getBatches, {page: page, limit: this.limit, searchQuery: this.searchQuery}).subscribe((response) => {
            this.branches = response.branches;
            this.totalBranches = response.total;
            this.totalPages = response.pages;
            this.currentPage = response.currentPage;
        }, (error) => {
            console.error('Error loading branches:', error);
        });
    }

    // Search branches by BatchNumber when the user types in the search box
    onSearch(): void {
        if (this.searchQuery.trim() !== '') {
            // Call search API if there is a search query
            this.apiRequest.searchBranch(this.ApiUrls.searchBranch, this.searchQuery).subscribe(
                (response) => {
                    this.branches = [response];  // If only one branch is found, it will return a single branch
                    this.totalBranches = 1;  // Only one branch will be found
                    this.totalPages = 1;  // One page only
                },
                (error) => {
                    console.error('Error searching branch:', error);
                    this.branches = [];  // Clear the branches if no match is found
                    this.totalBranches = 0;  // No results
                }
            );
        } else {
            // If search query is empty, load all branches
            this.loadBranches();
        }
    }

    onCreateBatch(): void {
        this.router.navigate(['/dashboard/order']);
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.loadBranches(this.currentPage);
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage = this.currentPage + 1
            this.loadBranches(this.currentPage);
        }
    }

    onUpdate(branch: any): void {
        this.selectedBranch = {...branch};
        this.selectedBranch.CreationDate = new Date(branch.CreationDate)
        this.selectedBranch.ExpiryDate = new Date(branch.ExpiryDate)
        this.getBrandes()
        this.showUpdateModal = true;
    }

    // In list.component.ts

    onUpdateSubmit(): void {
        // Pass the selectedBranch and its BatchNumber to the updateBranch method
        this.apiRequest.update(this.ApiUrls.updateBatch + this.selectedBranch._id, this.selectedBranch).subscribe((response) => {
            alert('Branch updated successfully!');
            this.loadBranches(); // Reload the branches list
            this.closeUpdateModal(); // Close the modal
        }, (error) => {
            console.error('Error updating branch:', error);
            alert('Error updating branch');
        });
    }

    onDelete(batchNumber: string): void {
        const confirmDelete = confirm('Are you sure you want to delete this branch?');
        if (confirmDelete) {
            this.orderService.deleteBranch(batchNumber).subscribe(
                (response) => {
                    alert('Branch deleted successfully!');
                    this.loadBranches(); // Reload branches after deletion
                },
                (error) => {
                    console.error('Error deleting branch:', error);
                }
            );
        }
    }

    // Method to close the update modal
    closeUpdateModal(): void {
        this.showUpdateModal = false; // Hide the modal
    }
    getBrandes() {
        this.apiRequest.getAll(this.ApiUrls.getAllBrandsForSelect + this.selectedBranch.ProductName).subscribe((response: any) => {
            this.brandData = response;
        })
    }
}
