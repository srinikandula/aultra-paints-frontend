import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiRequestService} from "../services/api-request.service";
import {
  NgbAlertModule,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbModal,
  NgbModalRef,
  NgbPagination
} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {ApiUrlsService} from "../services/api-urls.service";
import {FormsModule, NgForm} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";

@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination, NgbAlertModule, NgbInputDatepicker],
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.css',
  providers: [DatePipe]
})
export class ProductOffersComponent implements OnInit {
  @ViewChild('productOfferForm') productOfferForm!: NgForm;
  productOffers: any[] = [];
  currentOffer: any = {
    productOfferImageUrl: '',
    productOfferDescription: '',
    validUntil: '',
    productOfferStatus: 'Active',
    cashback: 0,        
  redeemPoints: 0      
  };

  productOffersQuery: any = {
    page: 1,
    limit: 10,
    searchQuery: ''
  };

  limitOptions: number[] = [10, 20, 30, 50];  
  limit: number = 10;  
  totalUsers: number = 0;  
  currentPage: number = 1;
  totalPages: number = 1;
  uploadImageWidth: string = '20%';
  imageWidth: string = '20%';
  errorArray: Array<any> = [];
  timestamp: number = new Date().getTime();
  submitted = false;
  constructor(private apiRequestService: ApiRequestService, private modalService: NgbModal, public apiUrls: ApiUrlsService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadProductOffers();
  }

  loadProductOffers() {
    this.productOffers = []; 
    this.apiRequestService.create(this.apiUrls.searchProductOffers, this.productOffersQuery).subscribe((response: any) => {
      this.productOffers = response.data;
      this.totalUsers = response.total;  
      this.totalPages = Math.ceil(this.totalUsers / this.productOffersQuery.limit); 
    });
  }
  

  addOrEditOffer(modal: any, offer: any) {
    this.errorArray = [];
    if (offer._id) {
      this.currentOffer = { ...offer };
      const defaultDate = new Date(offer.validUntil);
      this.currentOffer.validUntil = {
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth() + 1, // getMonth() returns 0-based month
        day: defaultDate.getDate(),
      };
      this.submitted = false;
      this.currentOffer.productOfferStatus = offer.productOfferStatus;
      
    } else {
      this.currentOffer = {};
      const defaultDate = new Date();
      this.currentOffer.validUntil = {
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth() + 1, // getMonth() returns 0-based month
        day: defaultDate.getDate(),
      };
      this.currentOffer.productOfferStatus = 'Active';
    }
    const modalRef: NgbModalRef = this.modalService.open(modal, { 
      size: 'md', 
      windowClass: 'custom-modal-size' 
    });
    modalRef.result.then(() => { this.currentOffer = {}; }, () => { this.currentOffer = {}; });
  }    

  saveOffer(modalRef: NgbModalRef) {
    this.submitted = true;
    if (this.productOfferForm.form) {
      Object.keys(this.productOfferForm.form.controls).forEach(field => {
        const control = this.productOfferForm.form.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  
    const addImageControl = this.productOfferForm.form.get('addImage');
    if (addImageControl) {
      if (
        (this.currentOffer.productOfferImageUrl && !this.currentOffer.productOfferImage) ||
        (this.currentOffer.productOfferImageUrl && this.currentOffer.productOfferImage) ||
        (!this.currentOffer.productOfferImageUrl && this.currentOffer.productOfferImage)
      ) {
        addImageControl.setErrors(null); // Valid state
      } else {
        addImageControl.setErrors({ invalid: true }); // Invalid state
      }
    }
  
    if (this.productOfferForm.valid) {
      let oldDate = this.currentOffer.validUntil;
      this.currentOffer.validUntil = `${this.currentOffer.validUntil.year}-${this.currentOffer.validUntil.month}-${this.currentOffer.validUntil.day}`;
      
      const formData = new FormData();
      if (this.currentOffer.productOfferImage) {
        formData.append('productOfferImage', this.currentOffer.productOfferImage);
      }
      if (this.currentOffer.productOfferImageUrl) {
        formData.append('productOfferImageUrl', this.currentOffer.productOfferImageUrl);
      }
      formData.append('productOfferDescription', this.currentOffer.productOfferDescription);
      // formData.append('productOfferTitle', this.currentOffer.productOfferTitle); 
      formData.append('validUntil', this.currentOffer.validUntil);
      formData.append('productOfferStatus', this.currentOffer.productOfferStatus);
      formData.append('cashback', this.currentOffer.cashback.toString()); // Added cashback
      formData.append('redeemPoints', this.currentOffer.redeemPoints.toString()); // Added redeemPoints
  
      if (this.currentOffer._id) {
        this.apiRequestService.updateWithImage(this.apiUrls.updateProductOffer + this.currentOffer._id, formData).subscribe((response) => {
          if (response) {
            modalRef.close();
            Swal.fire('Success', 'Product offer updated successfully', 'success');
            this.timestamp = new Date().getTime();
            this.currentOffer = {};
            this.errorArray = [];
            this.loadProductOffers();
          }
        }, (error) => {
          console.error('Error updating product offer:', error);
          this.errorArray = [];
          this.currentOffer.validUntil = oldDate;
          if (error && error.message) {
            this.errorArray.push(error.message);
          } else {
            this.errorArray.push(error);
          }
        });
      } else {
        this.apiRequestService.createWithImage(this.apiUrls.createProductOffer, formData).subscribe((response) => {
          if (response) {
            modalRef.close();
            Swal.fire('Success', 'Product offer added successfully', 'success');
            this.currentOffer = {};
            this.loadProductOffers();
            this.errorArray = [];
            this.timestamp = new Date().getTime();
          }
        }, (error) => {
          console.error('Error creating product offer:', error);
          this.currentOffer.validUntil = oldDate;
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
  

  deleteOffer(offerId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this offer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiRequestService.delete(this.apiUrls.deleteProductOffer + offerId).subscribe(() => {
          this.loadProductOffers();
          Swal.fire('Deleted!', 'Your offer has been deleted.', 'success');
        });
      }
    });
  }

  handlePageChange(page: number) {
    this.productOffersQuery.page = page; // Update page number in the query
    this.loadProductOffers(); // Reload product offers with updated page number
  }
  
  handleLimitChange() {
    this.productOffersQuery.limit = this.limit; // Update limit in the query
    this.productOffersQuery.page = 1; // Reset to first page when limit changes
    this.loadProductOffers(); // Reload product offers with updated limit
  }
  

  editOffer(offer: any, productModal: any) {
    this.addOrEditOffer(productModal, offer);
  }

  handleImageChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentOffer.productOfferImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleOfferStatus(offer: any): void {
    console.log('Toggle offer status', offer);
    offer.productOfferStatus = offer.productOfferStatus === 'Active' ? 'Inactive' : 'Active';
    Swal.fire({
      title: `Are you sure you want to mark this product offer as ${offer.productOfferStatus}?`,
      text: `You are about to mark this product offer as ${offer.productOfferStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, mark as ${offer.productOfferStatus}`,
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiRequestService.update(this.apiUrls.updateProductOffer + offer._id, offer).subscribe((response) => {
          if (response) {
            this.timestamp = new Date().getTime();
            this.loadProductOffers();
            Swal.fire('Status updated', 'Product offer status has been updated successfully', 'success');
          }
        })
      } else {
        offer.productOfferStatus = offer.productOfferStatus === 'Inactive'? 'Active' : 'Inactive';
      }
    });
  }

  statusChanged(offerStatus: any): void {
    console.log('Status changed', offerStatus);
    offerStatus = !offerStatus;
    this.currentOffer.productOfferStatus = !offerStatus ? 'Active' : 'Inactive';
    // console.log(this.currentOffer.productOfferStatus);
  }

  toggleProductOfferStatus(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentOffer.productOfferStatus = isChecked ? 'Active' : 'Inactive';
  }
}
