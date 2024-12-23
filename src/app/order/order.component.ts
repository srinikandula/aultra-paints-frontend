import { Component } from '@angular/core';
import { OrderService } from '../order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbDatepickerModule, NgbAlertModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  branchName: string = '';
  creationDate: NgbDateStruct | null = null;
  expiryDate: NgbDateStruct | null = null;
  BatchNumbers: any[] = [
    { BatchNumber: '', Brand: '', ProductName: '', Volume: 0, Quantity: 0 }
  ];

  // Array for the Branch Names dropdown
  branchNames: string[] = ['Central Hub', 'Main Street', 'Pine Valley', 'Lakeview', 'Sunset Boulevard', 'Riverside', 'Hillside'];
  
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}


  addProduct() {
    this.BatchNumbers.push({ BatchNumber: '', Brand: '', ProductName: '', Volume: 0, Quantity: 0 });
  }

  // Delete a product from the products array
  deleteProduct(index: number): void {
    if (this.BatchNumbers.length > 1) {
      this.BatchNumbers.splice(index, 1);
    } else {
      alert('At least one product is required.');
    }
  }

  
  convertToISODate(date: NgbDateStruct | null): string {
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

submitForm() {

  const confirmation = window.confirm('Are you sure you want to submit the form?');

  if (confirmation) {
    const newBranch = {
      Branch: this.branchName,
      CreationDate: this.convertToISODate(this.creationDate),
      ExpiryDate: this.convertToISODate(this.expiryDate),
      BatchNumbers: this.BatchNumbers
    };

    this.orderService.createBranch(newBranch).subscribe(
      (response: any) => {
         console.log('Branch created successfully:', response.message);

        // Reset the form after successful submission
        this.resetForm();
      },
      (error: any) => {
        console.error('Error creating branch:', error);
        
      }
    );
  } 
}


  // Reset the form after submission
  resetForm() {
    this.branchName = '';
    this.creationDate = null;
    this.expiryDate = null;
    this.BatchNumbers = [{ BatchNumber: '', Brand: '', ProductName: '', Volume: 0, Quantity: 0 }];
  }
}
