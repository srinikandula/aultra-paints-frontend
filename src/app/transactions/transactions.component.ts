import {Component, OnInit} from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrderService } from "../order.service";
import { Router } from "@angular/router";
import { ApiUrlsService } from "../services/api-urls.service";
import { ApiRequestService } from "../services/api-request.service";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";

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
        FormsModule,
        NgbPagination
    ],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
    currentPage = 1;
    totalPages = 1;
    limit = 10;
    transactions: any = [];
    qrUrl: any;
    showUpdateModal: boolean = false;
    userId: string | null = '';
    limitOptions: Array<any> = [10, 20, 50, 100];

    constructor(private orderService: OrderService,
                private router: Router,
                private ApiUrls: ApiUrlsService,
                private apiRequest: ApiRequestService) { }

    ngOnInit(): void {
        this.filterBasedOnUser();
    }

    getAllTransactions(page: number = this.currentPage) {
        this.apiRequest.create(this.ApiUrls.getTransactions, {page: page, limit: this.limit, userId: this.userId}).subscribe(
          (response: any) => {
            this.transactions = response.transactionsData;
            // Ensure totalPages is calculated correctly
            this.totalPages = Math.ceil(response.total / this.limit);
            console.log('Fetched transactions:', response);
          },
          (error: any) => {
            console.error('Error loading transactions:', error);
          }
        );
      }
      


    setQrUrl(qr_code: any) {
        this.showUpdateModal = true;
        this.qrUrl = qr_code;
    }

    closeUpdateModal(): void {
        this.showUpdateModal = false; // Hide the modal
    }

    filterBasedOnUser() {
        const urlParams = new URLSearchParams(this.router.url.split('?')[1]);
        this.userId = urlParams.get('userId');
        this.getAllTransactions();
    }

    onReset() {
        this.userId = null;
        this.getAllTransactions();
        this.router.navigate(['/transactions']);
    }

    handlePageChange($event: number) {
        this.currentPage = $event;
        this.getAllTransactions();
    }

    handleLimitChange() {
        this.currentPage = 1;
        this.getAllTransactions();
    }
}