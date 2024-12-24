import { Component } from '@angular/core';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  branches: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalBranches = 0;
  limit = 10;
  searchQuery: string = '';  // Search query for BatchNumber
  showUpdateModal = false; // Flag to show modal
  selectedBranch: any = {}; // Store the selected branch for update

  constructor(private orderService: OrderService,
              private router: Router,
              private ApiUrls: ApiUrlsService,
              private apiRequest: ApiRequestService) { }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(page: number = this.currentPage): void {
    this.apiRequest.get(this.ApiUrls.getBatches, {page: page, limit: this.limit}).subscribe(
      (response) => {
        this.branches = response.branches;
        this.totalBranches = response.total;
        this.totalPages = response.pages;
        this.currentPage = response.currentPage;
      },
      (error) => {
        console.error('Error loading branches:', error);
      }
    );
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
      this.loadBranches(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadBranches(this.currentPage + 1);
    }
  }

  onUpdate(branch: any): void {
    this.selectedBranch = { ...branch }; 
    this.showUpdateModal = true; 
  }

  // In list.component.ts

onUpdateSubmit(): void {
  // Pass the selectedBranch and its BatchNumber to the updateBranch method
  this.orderService.updateBranch(this.selectedBranch, this.selectedBranch.BatchNumber).subscribe(
    (response) => {
      alert('Branch updated successfully!');
      this.loadBranches(); // Reload the branches list
      this.closeUpdateModal(); // Close the modal
    },
    (error) => {
      console.error('Error updating branch:', error);
      alert('Error updating branch');
    }
  );
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
}
