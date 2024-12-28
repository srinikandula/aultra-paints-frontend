import { Component } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css'
})
export class BrandListComponent {
  brands: any[] = [];
  products: any[] = [];  // Array to hold the list of products
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

  // Method to load brands
  loadBrands(): void {
    const data = { page: this.page, limit: this.limit };
    this.apiRequestService.getAllBrands(data).subscribe({
      next: (response) => {
        this.brands = response; 
      },
      error: (error) => {
        this.errorMessage = 'Error fetching brands!';
        console.error(error);
      }
    });
  }

  // Method to load products
  loadProducts(): void {
    this.apiRequestService.getProducts({ page: 1, limit: 10 }).subscribe(
      (data) => {
        this.products = data;  
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Method to open modal and add a new brand
  addBrand(brandModal: any): void {
    this.currentBrand = { proId: '', brands: '' }; 
    this.modalService.open(brandModal);  
  }

  // Method to open modal and edit an existing brand
  editBrand(brand: any, brandModal: any): void {
    this.currentBrand = { ...brand }; 
    this.modalService.open(brandModal);  
  }

  // Method to save brand (add or update)
  saveBrand(): void {
    if (this.currentBrand._id) {
      this.apiRequestService.updateBrand(this.currentBrand._id, this.currentBrand).subscribe({
        next: () => {
          this.loadBrands(); 
          this.currentBrand = { proId: '', brands: '' }; 
        },
        error: (error) => {
          this.errorMessage = 'Error updating brand!';
          console.error(error);
        }
      });
    } else {
      // Otherwise, create a new brand
      this.apiRequestService.createBrand(this.currentBrand).subscribe({
        next: () => {
          this.loadBrands(); 
          this.currentBrand = { proId: '', brands: '' }; 
        },
        error: (error) => {
          this.errorMessage = 'Error creating brand!';
          console.error(error);
        }
      });
    }
  }

  // Method to delete a brand by its ID
  deleteBrand(id: string): void {
    this.apiRequestService.deleteBrand(id).subscribe({
      next: () => {
        this.loadBrands(); 
      },
      error: (error) => {
        this.errorMessage = 'Error deleting brand!';
        console.error(error);
      }
    });
  }
}