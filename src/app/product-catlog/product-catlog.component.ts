import { Component, ViewChild } from '@angular/core';
import { ApiRequestService } from "../services/api-request.service";
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgbAlertModule,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbModal,
  NgbModalRef,
  NgbPagination
} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ApiUrlsService } from "../services/api-urls.service";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-catlog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination, NgbAlertModule, NgbInputDatepicker, NgSelectModule],
  templateUrl: './product-catlog.component.html',
  styleUrl: './product-catlog.component.css',
  providers: [DatePipe]
})
export class ProductCatlogComponent {
     @ViewChild('productCatlogForm') productCatlogForm!: NgForm;
    productCatlogs: any[] = [];
    currentUser: any = {};
    currentCatlog: any = {
      productImageUrl: '',
      productDescription: '',
      productStatus: 'Active',
      price: ''
    };
  
    productCatlogsQuery: any = {
      page: 1,
      limit: 10,
      searchQuery: ''
    };
  
    limitOptions: number[] = [10, 20, 50, 100];
    limit: number = 10;
    totalProductCatlogs: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
    uploadImageWidth: string = '20%';
    imageWidth: string = '20%';
    errorArray: Array<any> = [];
    timestamp: number = new Date().getTime();
    submitted = false;
    groupedDropdownData: any[] = [];
    cart: { [id: string]: { count: number, price: number } } = {};
    stateList: Array<{ stateName: string; stateId: string }> = [];
    zoneList: Array<{ zoneName: string; zoneId: string }> = [];
    districtList: Array<{ districtName: string; districtId: string }> = [];

priceValue: number | null = null;
priceList: Array<{ selectedKey: string; price: number }> = [{ selectedKey: 'All', price: 0 }];
  
    constructor(private apiRequestService: ApiRequestService, private modalService: NgbModal, public apiUrls: ApiUrlsService, private datePipe: DatePipe,private AuthService:AuthService ) {    this.currentUser = this.AuthService.currentUserValue;
    }
  
    ngOnInit(): void {
      this.loadProductCatlogs();
      this.getAllStatesZonesAndDistricts();
    }
  
    loadProductCatlogs() {
      this.productCatlogs = [];
      this.apiRequestService.create(this.apiUrls.searchProductCatlog, this.productCatlogsQuery).subscribe((response: any) => {
        this.productCatlogs = response.data;
        this.totalProductCatlogs = response.total;
        this.totalPages = Math.ceil(this.totalProductCatlogs / this.productCatlogsQuery.limit);
      });
    }
  
    getAllStatesZonesAndDistricts() {
      Promise.all([
        this.apiRequestService.getStates().toPromise() as Promise<any>,
        this.apiRequestService.getZones().toPromise() as Promise<any>,
        this.apiRequestService.getDistricts().toPromise() as Promise<any>,
      ])
        .then(([states, zones, districts]) => {
          // Prepare grouped data for ng-select
          this.groupedDropdownData = [
            { id: 'All', label: 'All', },
            ...states.data.map((state: any) => ({
              id: state.stateId,
              label: state.stateName,
              group: 'States',
            })),
            ...zones.data.map((zone: any) => ({
              id: zone.zoneId,
              label: zone.zoneName,
              group: 'Zones',
            })),
            ...districts.data.map((district: any) => ({
              id: district.districtId,
              label: district.districtName,
              group: 'Districts',
            })),
          ];
        })
        .catch((error) => {
          console.error('Error fetching dropdown data:', error);
        });
    }
  
    addPrice() {
      this.priceList.push({ selectedKey: 'All', price: 0 });
    }
    getProductById(id: string) {
      return this.productCatlogs.find(p => p._id === id);
    }
    
    

    updateCart(product: any, change: number) {
      const id = product._id;
      const price = product.productPrice;
  
      if (!this.cart[id]) {
        this.cart[id] = { count: 0, price };
      }
  
      this.cart[id].count += change;
  
      if (this.cart[id].count <= 0) {
        delete this.cart[id];
      }
    }
  
    cartKeys(): string[] {
      return Object.keys(this.cart);
    }
  
    get cartItemCount(): number {
      return Object.values(this.cart).reduce((sum, item) => sum + item.count, 0);
    }
  
    openCartModal(modal: any) {
      this.modalService.open(modal, { size: 'md' });
    }
  
    addOrEditCatlog(modal: any, catlog: any) {
      this.errorArray = [];
  
      if (catlog && catlog._id) {
        this.currentCatlog = { ...catlog };
  
        this.priceList = catlog.price && catlog.price.length > 0
          ? catlog.price.map((item: any) => ({
              selectedKey: item.refId || '',
              price: item.price || 0,
              _id: item._id || null
            }))
          : [{ selectedKey: 'All', price: 100 }];
      } else {
        this.currentCatlog = {
          productImageUrl: '',
          productDescription: '',
          productStatus: 'Active',
        };
  
        this.priceList = [{ selectedKey: 'All', price: 100 }];
      }
  
      const modalRef: NgbModalRef = this.modalService.open(modal, {
        size: 'md',
        windowClass: 'custom-modal-size',
      });

      modalRef.result.then(
        () => (this.currentCatlog = {}),
        () => (this.currentCatlog = {})
      );
    }


    getCartTotalPrice(): number {
      let total = 0;
      for (const id of Object.keys(this.cart)) {
        const item = this.cart[id];
        total += item.price * item.count;
      }
      return total;
    }
  
    saveCatlog(modalRef: NgbModalRef) {
      console.log(this.currentCatlog);
      this.submitted = true;
  
      if (this.productCatlogForm.form) {
        Object.keys(this.productCatlogForm.form.controls).forEach(field => {
          const control = this.productCatlogForm.form.get(field);
          if (control) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      }
  
      const addImageControl = this.productCatlogForm.form.get('addImage');
      if (addImageControl) {
        if (
          (this.currentCatlog.productImageUrl && !this.currentCatlog.productImage) ||
          (this.currentCatlog.productImageUrl && this.currentCatlog.productImage) ||
          (!this.currentCatlog.productImageUrl && this.currentCatlog.productImage)
        ) {
          addImageControl.setErrors(null); 
        } else {
          addImageControl.setErrors({ invalid: true }); 
        }
      }
  
      // price payload dynamically based on state or zone
      this.currentCatlog.price = this.priceList
        .filter((item) => item.selectedKey && item.price)
        .map((item) => ({
          [item.selectedKey]: item.price,
        }));
  
      if (this.productCatlogForm.valid) {
        let oldDate = this.currentCatlog.productDescription;
        this.currentCatlog.productDescription = `${this.currentCatlog.productDescription}`;
  
        const formData = new FormData();
        if (this.currentCatlog.productImage) {
          formData.append('productImage', this.currentCatlog.productImage);
        }
        if (this.currentCatlog.productImageUrl) {
          formData.append('productImageUrl', this.currentCatlog.productImageUrl);
        }
        formData.append('productDescription', this.currentCatlog.productDescription);
        formData.append('productStatus', this.currentCatlog.productStatus);
        formData.append('price', JSON.stringify(this.currentCatlog.price));
  
        // Update or Create Catlog
        if (this.currentCatlog._id) {
          this.apiRequestService
            .updateWithImage(this.apiUrls.updateProductCatlog + this.currentCatlog._id, formData)
            .subscribe(
              (response) => {
                if (response) {
                  modalRef.close();
                  Swal.fire('Success', 'Product catalog updated successfully', 'success');
                  this.timestamp = new Date().getTime();
                  this.currentCatlog = {};
                  this.errorArray = [];
                  this.loadProductCatlogs();
                }
              },
              (error) => {
                console.error('Error updating product catalog:', error);
                this.errorArray = [];
                this.currentCatlog.productDescription = oldDate;
                if (error && error.message) {
                  this.errorArray.push(error.message);
                } else {
                  this.errorArray.push(error);
                }
              });
        } else {
          this.apiRequestService
            .createWithImage(this.apiUrls.createProductCatlog, formData)
            .subscribe(
              (response) => {
                if (response) {
                  modalRef.close();
                  Swal.fire('Success', 'Product catalog added successfully', 'success');
                  this.currentCatlog = {};
                  this.loadProductCatlogs();
                  this.errorArray = [];
                  this.timestamp = new Date().getTime();
                }
              },
              (error) => {
                console.error('Error creating product catalog:', error);
                this.currentCatlog.productDescription = oldDate;
                this.errorArray = [];
                if (error && error.message) {
                  this.errorArray.push(error.message);
                } else {
                  this.errorArray.push(error);
                }
              });
        }
      }
    }
  
    deleteCatlog(catlogId: string, productDescription: string) {
      Swal.fire({
        title: 'Confirm Deletion',
        text: `You want to delete the catalog: "${productDescription}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiRequestService.delete(this.apiUrls.deleteProductCatlog + catlogId).subscribe({
            next: () => {
              this.loadProductCatlogs();
              Swal.fire('Catlog Deleted!', 'The catlog has been successfully removed.', 'success');
            },
            error: (error) => Swal.fire('Error', error?.error?.message || 'Failed to delete catlog', 'error')
          });
        }
      });
    }
  
    handlePageChange(page: number) {
      this.productCatlogsQuery.page = page;
      this.loadProductCatlogs();
    }
  
    handleLimitChange() {
      this.productCatlogsQuery.limit = this.limit;
      this.productCatlogsQuery.page = 1;
      this.loadProductCatlogs();
    }
  
    editCatlog(catlog: any, productModal: any) {
      this.addOrEditCatlog(productModal, catlog);
    }
  
    handleImageChange($event: Event) {
      const file = ($event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.currentCatlog.productImage = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  
    toggleCatlogStatus(catlog: any): void {
      console.log('Toggle catlog status', catlog);
      catlog.productStatus = catlog.productStatus === 'Active' ? 'Inactive' : 'Active';
      Swal.fire({
        title: `Are you sure you want to mark this product catlog as ${catlog.productStatus}?`,
        text: `You are about to mark this product catalog as ${catlog.productStatus}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, mark as ${catlog.productStatus}`,
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiRequestService.update(this.apiUrls.updateProductCatlog + catlog._id, catlog).subscribe((response) => {
            if (response) {
              this.timestamp = new Date().getTime();
              this.loadProductCatlogs();
              Swal.fire('Status updated', 'Product catalog status has been updated successfully', 'success');
            }
          });
        } else {
          catlog.productStatus = catlog.productStatus === 'Inactive' ? 'Active' : 'Inactive';
        }
      });
    }
  
    statusChanged(catlogStatus: any): void {
      console.log('Status changed', catlogStatus);
      catlogStatus = !catlogStatus;
      this.currentCatlog.productStatus = !catlogStatus ? 'Active' : 'Inactive';
    }
  
    toggleProductCatlogStatus(event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.currentCatlog.productStatus = isChecked ? 'Active' : 'Inactive';
    }


    proceedToCheckout() {
      
    }
  }
  

