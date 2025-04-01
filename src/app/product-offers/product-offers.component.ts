import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiRequestService} from "../services/api-request.service";
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
import {ApiUrlsService} from "../services/api-urls.service";
import {FormsModule, NgForm} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";

@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination, NgbAlertModule, NgbInputDatepicker, NgSelectModule],
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
  redeemPoints: 0,
  price: ''

  };

  productOffersQuery: any = {
    page: 1,
    limit: 10,
    searchQuery: ''
  };

  limitOptions: number[] = [10, 20, 50, 100];  
  limit: number = 10;  
  totalProductOffers: number = 0;  
  currentPage: number = 1;
  totalPages: number = 1;
  uploadImageWidth: string = '20%';
  imageWidth: string = '20%';
  errorArray: Array<any> = [];
  timestamp: number = new Date().getTime();
  submitted = false;
  groupedDropdownData: any[] = [];

  // Track selected state and price
 // Fix Declaration
// Only keep this version
stateList: Array<{ stateName: string; stateId: string }> = [];
zoneList: Array<{ zoneName: string; zoneId: string }> = [];
districtList: Array<{ districtName: string; districtId: string }> = [];

priceValue: number | null = null;
priceList: Array<{ selectedKey: string; price: number }> = [{ selectedKey: 'All', price: 0 }];
  constructor(private apiRequestService: ApiRequestService, private modalService: NgbModal, public apiUrls: ApiUrlsService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadProductOffers();
    this.getAllStatesZonesAndDistricts();
  }

  loadProductOffers() {
    this.productOffers = []; 
    this.apiRequestService.create(this.apiUrls.searchProductOffers, this.productOffersQuery).subscribe((response: any) => {
      this.productOffers = response.data;
      this.totalProductOffers = response.total;  
      this.totalPages = Math.ceil(this.totalProductOffers / this.productOffersQuery.limit); 
    });
  }

  getAllStatesZonesAndDistricts() {
    Promise.all([
      this.apiRequestService.getStates().toPromise() as Promise<any>,
      this.apiRequestService.getZones().toPromise() as Promise<any>,
      this.apiRequestService.getDistricts().toPromise() as Promise<any>,
    ])
      .then(([states, zones, districts]) => {
        //  Prepare grouped data for ng-select
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
  

  
  addOrEditOffer(modal: any, offer: any) {
    this.errorArray = [];
  
    if (offer._id) {
      // Edit Mode: Load existing offer data
      this.currentOffer = { ...offer };
  
      // Convert validUntil date to NgbDateStruct
      const defaultDate = new Date(offer.validUntil);
      this.currentOffer.validUntil = {
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth() + 1,
        day: defaultDate.getDate(),
      };
  
     this.priceList = offer.price
  ? offer.price.map((item: any) => ({
      selectedKey: item.refId, 
      price: item.price,
      _id: item._id
    }))
  : [{ selectedKey: '', price: 0 }];

    } else {
      // Add Mode: Initialize default values
      this.currentOffer = {};
      const defaultDate = new Date();
      this.currentOffer.validUntil = {
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth() + 1,
        day: defaultDate.getDate(),
      };
      this.currentOffer.productOfferStatus = 'Active';
  
      // Initialize priceList with one empty row
      this.priceList = [{ selectedKey: 'All', price: 100}];
    }
  
    // Open Modal with Custom Size
    const modalRef: NgbModalRef = this.modalService.open(modal, {
      size: 'md',
      windowClass: 'custom-modal-size',
    });
  
    // Reset form after closing the modal
    modalRef.result.then(
      () => {
        this.currentOffer = {};
      },
      () => {
        this.currentOffer = {};
      }
    );
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

        // price payload dynamically based on state or zone
    this.currentOffer.price = this.priceList
    .filter((item) => item.selectedKey && item.price) 
    .map((item) => ({
      [item.selectedKey]: item.price, 
    }));
  
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
      formData.append('validUntil', this.currentOffer.validUntil);
      formData.append('productOfferStatus', this.currentOffer.productOfferStatus);
      formData.append('cashback', this.currentOffer.cashback.toString());
      formData.append('redeemPoints', this.currentOffer.redeemPoints.toString());
      formData.append('price', JSON.stringify(this.currentOffer.price)); 
  
      // Update or Create Offer
      if (this.currentOffer._id) {
        this.apiRequestService
          .updateWithImage(this.apiUrls.updateProductOffer + this.currentOffer._id, formData)
          .subscribe(
            (response) => {
              if (response) {
                modalRef.close();
                Swal.fire('Success', 'Product offer updated successfully', 'success');
                this.timestamp = new Date().getTime();
                this.currentOffer = {};
                this.errorArray = [];
                this.loadProductOffers();
              }
            },
            (error) => {
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
        this.apiRequestService
          .createWithImage(this.apiUrls.createProductOffer, formData)
          .subscribe(
            (response) => {
              if (response) {
                modalRef.close();
                Swal.fire('Success', 'Product offer added successfully', 'success');
                this.currentOffer = {};
                this.loadProductOffers();
                this.errorArray = [];
                this.timestamp = new Date().getTime();
              }
            },
            (error) => {
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
  

  deleteOffer(offerId: string, productOfferDescription: string) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `You want to delete the offer: "${productOfferDescription}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiRequestService.delete(this.apiUrls.deleteProductOffer + offerId).subscribe({
          next: () => {
            this.loadProductOffers();
            Swal.fire('Offer Deleted!', 'The offer has been successfully removed.', 'success');
          },
          error: (error) => Swal.fire('Error', error?.error?.message || 'Failed to delete offer', 'error')
        });
      }
    });
  }
  
  

  handlePageChange(page: number) {
    this.productOffersQuery.page = page; 
    this.loadProductOffers(); 
  }
  
  handleLimitChange() {
    this.productOffersQuery.limit = this.limit;
    this.productOffersQuery.page = 1; 
    this.loadProductOffers(); 
  }
  

  editOffer(offer: any, productModal: any) {
    this.addOrEditOffer(productModal, offer);
  }

  handleImageChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentOffer.productOfferImage = reader.result as string; 
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
