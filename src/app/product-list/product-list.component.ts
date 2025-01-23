import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  currentProduct: any = { name: '' };
  searchQuery: string = '';  
  isSearching: boolean = false;  
  submitted = false; 
  errors: string[] = [];

  // Pagination variables
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  limit: number = 10;

  constructor(private apiService: ApiRequestService, private modalService: NgbModal) {}
  @ViewChild('productForm', { static: false }) productForm!: NgForm;  // Reference to the form

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts({ page: this.currentPage, limit: this.limit }).subscribe(
      (data) => {
        this.products = data.products;  
        this.totalPages = data.pagination.totalPages;  
        this.totalProducts = data.pagination.totalProducts; 
      },
      (error) => {
      }
    );
  }
  
    // Search products by name
  searchProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.loadProducts();  
      return;
    }

    this.isSearching = true;
    this.apiService.searchProductByName(this.searchQuery, this.currentPage, this.limit).subscribe(
      (data) => {
        if (data && data.data && data.data.length > 0) {
          this.products = data.data;  
          this.totalPages = data.pages;
          this.totalProducts = data.total;
        } else {
          this.products = [];
          
        }
        this.isSearching = false;
      },
      (error) => {
        this.products = [];
        this.isSearching = false;
      }
    );
  }


  // Method to open the modal for adding a new product
  addProduct(content: any): void {
    this.currentProduct = { name: '' };  
    this.submitted = false; 
    this.errors = [];  
    this.modalService.open(content, { size: 'lg' });  
  }

  saveProduct(modal: any): void {
    this.submitted = true; 
  
    // Clear previous errors before validating
    this.errors = [];
  
    // If the form is invalid, stop here
    if (this.productForm.invalid) {
      this.errors.push('Please fill in all required fields.');
      return;  
    }
  
    // Show confirmation dialog before proceeding with save
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Check if we are editing an existing product or adding a new one
        const saveRequest = this.currentProduct._id
          ? this.apiService.updateProduct(this.currentProduct._id, this.currentProduct)
          : this.apiService.createProduct(this.currentProduct);
  
        // Call the API to save the product
        saveRequest.subscribe({
          next: () => {
            this.loadProducts();  
            this.showSuccess(this.currentProduct._id ? 'Product updated successfully!' : 'Product added successfully!');  // Show success message
            this.modalService.dismissAll();  
          },
          error: (error) => {
            console.error('Error:', error);
            const errorMessage = error?.error || 'Something error occurred while saving the product';
            this.errors.push(errorMessage);
          }
        });
      }
    });
  }
  
  // Method to open modal for editing a product
  editProduct(product: any, content: any): void {
    this.currentProduct = { ...product };  
    this.submitted = false;  
    this.errors = [];  
    this.modalService.open(content, { size: 'lg' });  
  }

  // Delete a product by ID
  deleteProduct(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteProduct(id).subscribe(
          (data) => {
            this.loadProducts();
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
          },
          (error) => {
            this.showError('Error deleting product!');
          }
        );
      }
    });
  }

  
   nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts(); 
    }
  }
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();  
    }
  }

  showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  }

  showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }
}
