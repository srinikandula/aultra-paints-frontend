import { Component } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination],
  templateUrl: './payouts.component.html',
  styleUrl: './payouts.component.css'
})
export class PayoutsComponent {
  cashFreeTransactions: any[] = []; // Store the fetched transactions
  limit: number = 10; // Default page size
  currentPage: number = 1; // Default current page
  totalTransactions: number = 0; // Total number of transactions
  limitOptions: number[] = [5, 10, 25, 50]; // Limit options for page size

  constructor( private apiRequestService: ApiRequestService,) {}

  ngOnInit(): void {
    this.loadTransactions(); // Load transactions on component init
  }

  // Method to fetch CashFree transactions with pagination
  loadTransactions(page: number = 1, limit: number = 10): void {
    this.apiRequestService.getCashFreeTransactions(page, limit).subscribe(
      (response) => {
        this.cashFreeTransactions = response.cashFreeTransactions;
        this.totalTransactions = response.pagination.totalTransactions;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  // Handle page change from pagination controls
  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions(page, this.limit); // Load transactions for the new page
  }

  // Handle page size change from the selector
  handleLimitChange(): void {
    this.loadTransactions(this.currentPage, this.limit); // Reload transactions with the new limit
  }
}
