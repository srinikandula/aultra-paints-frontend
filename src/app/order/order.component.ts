import {Component, OnInit} from '@angular/core';
import {OrderService} from '../order.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbAlertModule, NgbDatepickerModule, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiUrlsService} from "../services/api-urls.service";
import {ApiRequestService} from "../services/api-request.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [FormsModule, CommonModule, NgbDatepickerModule, NgbAlertModule],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    branchName: string = '';
    ProductName: string = '';
    couponSeriesList: string[] = ['Series A', 'Series B', 'Series C']; // Example data
    creationDate = new Date();
    expiryDate = new Date();

    BatchNumbers: any[] = [
        // { BatchNumber: '', Brand: '', ProductName: '', Volume: 0, Quantity: 0 }
        {BatchNumber: 0, Brand: '', redeemablePoints: 0, value: 0, Volume: '', Quantity: 0},
        // {BatchNumber: '2', Brand: 'SONY', ProductName: 'TV', Volume: 0, Quantity: 0}
    ];

    volumes: number[] = [10, 20, 30, 50, 100];
    branchNames: string[] = ['Central Hub', 'Main Street', 'Pine Valley', 'Lakeview'];

    constructor(private ApiUrls: ApiUrlsService, private ApiRequest: ApiRequestService, private router: Router,) {
    }

    ngOnInit() {
        this.ApiRequest.getCouponSeries(this.ApiUrls.couponSeries).subscribe(
            (data: any[]) => {
                this.couponSeriesList = data.map(series => series.name); // Assuming API returns an array of objects with a 'name' field
            },
            error => console.error('Error fetching coupon series:', error)
        );
    }

    submitForm() {
        const newBranch = {
            Branch: this.branchName,
            ProductName: this.ProductName,
            CreationDate: this.convertToISODate(this.creationDate),
            ExpiryDate: this.convertToISODate(this.expiryDate),
            BatchNumbers: this.BatchNumbers,
        };

        this.ApiRequest.create(this.ApiUrls.createBatch, newBranch).subscribe(
            (response: any) => {
                console.log('Branch created successfully:', response.message);
                this.resetForm();
                this.router.navigate(['dashboard/list']);
            },
            (error: any) => console.error('Error creating branch:', error)
        );
    }

    resetForm() {
        this.branchName = '';
        this.ProductName = '';
        this.creationDate = new Date();
        this.expiryDate = new Date();
        this.BatchNumbers = [{BatchNumber: 0, Brand: '', redeemablePoints: 0, value: 0, Volume: '', Quantity: 0}];
    }

    convertToISODate(date: any) {
        if (!date) return '';
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    }

    addProduct() {
        this.BatchNumbers.push({BatchNumber: 0, Brand: '', redeemablePoints: 0, value: 0, Volume: '', Quantity: 0});
    }

    // Delete a product from the products array
    deleteProduct(index: number): void {
        if (this.BatchNumbers.length > 1) {
            this.BatchNumbers.splice(index, 1);
        } else {
            alert('At least one product is required.');
        }
    }

  cancel(): void {
    this.router.navigate(['dashboard/list']);
  }
}
