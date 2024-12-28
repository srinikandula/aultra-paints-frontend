import { Component } from '@angular/core';
import {CommonModule, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../order.service";
import {Router} from "@angular/router";
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";

@Component({
  selector: 'app-transactions',
  standalone: true,
    imports: [
        DatePipe,
        FormsModule,
        NgForOf,
        NgIf,
        NgClass,
        NgOptimizedImage,
        CommonModule,
        FormsModule
    ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
    currentPage = 1;
    totalPages = 1;
    limit = 10;
    transactions: any = [];
    qrUrl: any;
    showUpdateModal: any = false;

    constructor(private orderService: OrderService,
                private router: Router,
                private ApiUrls: ApiUrlsService,
                private apiRequest: ApiRequestService) { }

    ngOnInit(): void {
        this.getAllTransactions();
    }

    getAllTransactions(page: number = this.currentPage) {
        this.apiRequest.create(this.ApiUrls.getTransactions, {page: page, limit: this.limit}).subscribe(
            (response) => {
                this.transactions = response.transactionsData;
                this.totalPages = response.pages;
                // this.currentPage = response.currentPage;
            },
            (error) => {
                console.error('Error loading branches:', error);
            }
        );
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.getAllTransactions(this.currentPage - 1);
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage = this.currentPage + 1
            this.getAllTransactions(this.currentPage);
        }
    }

    setQrUrl(qr_code: any) {
        this.showUpdateModal = true;
        this.qrUrl = qr_code;
    }

    closeUpdateModal(): void {
        this.showUpdateModal = false; // Hide the modal
    }
}
