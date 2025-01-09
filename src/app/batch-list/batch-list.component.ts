import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../order.service';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";
import { NgSelectComponent } from '@ng-select/ng-select';
import Swal from "sweetalert2";


@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectComponent],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.css'
})
export class BatchListComponent {
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
    volumes: string[] = ['10 LT', '20 LT', '30 LT', '50 LT', '100 LT'];

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
        this.router.navigate(['/create-batch']);
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
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update this batch?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiRequest.update(this.ApiUrls.updateBatch + this.selectedBranch._id, this.selectedBranch).subscribe((response) => {
                    this.loadBranches(); // Reload the branches list
                    this.closeUpdateModal(); // Close the modal
                    Swal.fire({icon: 'success', title: 'Success', text: 'Batches updated'});
                }, (error) => {
                    console.error('Error updating batch:', error);
                });
            }
        });
    }

    onDelete(id: string): void {
        this.apiRequest.getCouponSeries(this.ApiUrls.branchDeletedAffectedCouponsCount + id).subscribe((response) => {
            console.log(response)
            let text = response.message;
            Swal.fire({
                title: 'Are you sure?',
                html: `${response.message} <br>  You won\'t be able to revert this!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.apiRequest.delete(this.ApiUrls.deleteBatch + id).subscribe((response) => {
                        this.loadBranches();
                    }, (error) => {
                        console.error('Error deleting branch:', error);
                    });
                }
            });
        }, (error) => {
            console.error(error);
        });
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

