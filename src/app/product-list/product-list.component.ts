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
    this.currentProduct = { name: '' };  // Reset product details
    this.submitted = false;  // Reset submission flag
    this.errors = [];  // Clear previous errors
    this.modalService.open(content, { size: 'lg' });  // Open modal
  }

  // Method to save (add or update) the product
  saveProduct(modal: any): void {
    this.submitted = true;  // Mark the form as submitted
    
    // Show validation errors if form is invalid
    if (this.productForm.invalid) {
      return;  // If the form is invalid, do not proceed
    }

    // Show confirmation dialog using Swal
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalService.dismissAll();  // Close the modal

        // Check if we are editing an existing product or adding a new one
        if (this.currentProduct._id) {
          // Proceed with updating an existing product
          const successMessage = 'Product updated successfully!';
          const errorMessage = 'Error updating product!';
          
          this.apiService.updateProduct(this.currentProduct._id, this.currentProduct).subscribe({
            next: () => {
              this.loadProducts();  // Reload product list
              this.showSuccess(successMessage);  // Show success message
            },
            error: () => {
              this.showError(errorMessage);  // Show error message
            }
          });
        } else {
          // If it's a new product, check if it already exists
          const productExists = this.products.some(product => product.name.toLowerCase() === this.currentProduct.name.toLowerCase());
          if (productExists) {
            this.showError('Product with this name already exists!');
            return;  // Stop execution if product name exists
          }

          // Proceed with creating a new product
          const successMessage = 'Product added successfully!';
          const errorMessage = 'Error creating product!';

          this.apiService.createProduct(this.currentProduct).subscribe({
            next: () => {
              this.loadProducts();  // Reload product list
              this.showSuccess(successMessage);  // Show success message
            },
            error: () => {
              this.showError(errorMessage);  // Show error message
            }
          });
        }

        // Reset current product after saving
        this.currentProduct = { name: '' };
      }
    });
  }

  // Method to open modal for editing a product
  editProduct(product: any, content: any): void {
    this.currentProduct = { ...product };  // Copy selected product's data
    this.submitted = false;  // Reset submission flag
    this.errors = [];  // Clear previous errors
    this.modalService.open(content, { size: 'lg' });  // Open modal
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
