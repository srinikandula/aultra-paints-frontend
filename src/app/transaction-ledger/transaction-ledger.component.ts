import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../services/api-request.service';

@Component({
  selector: 'app-transaction-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './transaction-ledger.component.html',
  styleUrls: ['./transaction-ledger.component.css']
})
export class TransactionLedgerComponent {
  transactions: any[] = [];
  currentPage: number = 1;
  limit: number = 10;
  totalTransactions: number = 0;
  totalPages: number = 0;
  limitOptions: number[] = [5, 10, 20, 50];
  isLoading: boolean = false;

  constructor(private apiRequestService: ApiRequestService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;

    const payload = { page: this.currentPage, limit: this.limit };

    this.apiRequestService.getTransactionLedger(payload).subscribe({
      next: (response) => {
        this.transactions = response.transactions || [];
        this.totalTransactions = response.pagination?.totalTransactions || 0;
        this.totalPages = response.pagination?.totalPages || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.isLoading = false;
      }
    });
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  handleLimitChange(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }
}
