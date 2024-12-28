import { Component } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent {
  brands: any[] = [];
  products: any[] = [];
  currentBrand: any = { proId: '', brands: '' };
  errorMessage: string = '';
  page = 1;
  limit = 10;

  constructor(
    private apiRequestService: ApiRequestService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
  }

  loadBrands(): void {
    const data = { page: this.page, limit: this.limit };
    this.apiRequestService.getAllBrands(data).subscribe({
      next: (response) => {
        this.brands = response;
      },
      error: (error) => {
        this.showError('Error fetching brands!');
      }
    });
  }

  loadProducts(): void {
    this.apiRequestService.getProducts({ page: 1, limit: 10 }).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        this.showError('Error fetching products!');
      }
    });
  }

  // Add brand: Open the modal
  addBrand(brandModal: any): void {
    this.currentBrand = { proId: '', brands: '' };  
    this.modalService.open(brandModal);  
  }

  // Edit brand: Open the modal with current brand data
  editBrand(brand: any, brandModal: any): void {
    this.currentBrand = { ...brand }; 
    this.modalService.open(brandModal);  
  }


  brandExists(productId: string, brandName: string): boolean {
    return this.brands.some(brand => brand.proId === productId && brand.brands.toLowerCase() === brandName.toLowerCase());
  }

  // Save brand (add or update)
  saveBrand(brandModal: any): void {
    if (this.brandExists(this.currentBrand.proId, this.currentBrand.brands)) {
      this.showError('Brand already exists for this product!');
      return;  
    }

    const successMessage = this.currentBrand._id ? 'Brand updated successfully!' : 'Brand added successfully!';
    const errorMessage = this.currentBrand._id ? 'Error updating brand!' : 'Error creating brand!';

    if (this.currentBrand._id) {
      // Update brand
      this.apiRequestService.updateBrand(this.currentBrand._id, this.currentBrand).subscribe({
        next: () => {
          this.loadBrands();
          this.showSuccess(successMessage).then(() => {
            this.modalService.dismissAll();  
          });
        },
        error: () => {
          this.showError(errorMessage).then(() => {
            this.modalService.dismissAll();  
          });
        }
      });
    } else {
      // Create brand
      this.apiRequestService.createBrand(this.currentBrand).subscribe({
        next: () => {
          this.loadBrands();
          this.showSuccess(successMessage).then(() => {
            this.modalService.dismissAll();  
          });
        },
        error: () => {
          this.showError(errorMessage).then(() => {
            this.modalService.dismissAll();  
          });
        }
      });
    }
    this.currentBrand = { proId: '', brands: '' }; 
  }

  // Delete brand
  deleteBrand(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiRequestService.deleteBrand(id).subscribe(() => {
          this.loadBrands();
          Swal.fire('Deleted!', 'Your brand has been deleted.', 'success');
        }, (error) => {
          this.showError('Error deleting brand!');
        });
      }
    });
  }

  // Show success alert
  showSuccess(message: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  }

 
  showError(message: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }
}
