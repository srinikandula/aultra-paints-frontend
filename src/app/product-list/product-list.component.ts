import { Component, OnInit } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private apiService: ApiRequestService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load all products from the API
  loadProducts(): void {
    this.apiService.getProducts({ page: 1, limit: 10 }).subscribe(
      (data) => {
        this.products = data;  
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Open modal for adding a new product
  addProduct(content: any): void {
    this.currentProduct = { name: '' };  
    this.modalService.open(content, { size: 'lg' });
  }

  // Save new or updated product
  saveProduct(): void {
    if (this.currentProduct._id) {
      this.apiService.updateProduct(this.currentProduct._id, this.currentProduct).subscribe(
        (data) => {
          this.loadProducts();
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    } else {
      this.apiService.createProduct(this.currentProduct).subscribe(
        (data) => {
          this.loadProducts();
        },
        (error) => {
          console.error('Error creating product:', error);
        }
      );
    }
  }

  // Open modal to edit a product
  editProduct(product: any, content: any): void {
    this.currentProduct = { ...product };  
    this.modalService.open(content, { size: 'lg' });
  }

  // Delete a product by ID
  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe(
        (data) => {
          this.loadProducts();
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }
}
