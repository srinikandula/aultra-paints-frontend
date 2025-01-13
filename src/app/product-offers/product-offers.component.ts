import {Component, OnInit} from '@angular/core';
import {ApiRequestService} from "../services/api-request.service";
import {NgbAlertModule, NgbInputDatepicker, NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {ApiUrlsService} from "../services/api-urls.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination, NgbAlertModule, NgbInputDatepicker],
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.css'
})
export class ProductOffersComponent implements OnInit {
  productOffers: any[] = [];
  currentOffer: any = {
    productOfferImageUrl: '',
    productOfferDescription: '',
    productOfferTitle: '',
    validUntil: new Date(),
    productOfferStatus: ''
  };

  productOffersQuery: any = {
    page: 1,
    limit: 10,
    searchQuery: ''
  };

  currentPage: number = 1;
  totalPages: number = 1;
  uploadImageWidth: string = '20%';
  imageWidth: string = '20%';
  errorArray: Array<any> = [];
  timestamp: number = new Date().getTime();

  constructor(private apiRequestService: ApiRequestService, private modalService: NgbModal, public apiUrls: ApiUrlsService) {
  }

  ngOnInit(): void {
    this.loadProductOffers();
  }

  loadProductOffers() {
    this.productOffers = [];
    this.apiRequestService.create(this.apiUrls.searchProductOffers, this.productOffersQuery).subscribe((response: any) => {
      this.productOffers = response.data;
      this.totalPages = response.total;
    });
  }

  addOrEditOffer(modal: any, offer: any) {
    if (offer._id) {
      this.currentOffer = { ...offer };
    } else {
      this.currentOffer = {};
    }
    // this.modalService.open(modal, { size: 'lg' });
    const modalRef: NgbModalRef = this.modalService.open(modal, { size: 'lg' });
    modalRef.result.then(
        () => { /* Handle modal close result if necessary */ },
        () => { /* Handle modal dismiss result if necessary */ });
  }

  saveOffer(modalRef: NgbModalRef) {
    this.currentOffer.validUntil = this.currentOffer.validUntil.year + '-' + this.currentOffer.validUntil.month + '-' + this.currentOffer.validUntil.day;
    const formData = new FormData();
    if (this.currentOffer.productOfferImage) {
      formData.append('productOfferImage', this.currentOffer.productOfferImage);
    }
    if (this.currentOffer.productOfferImageUrl) {
      formData.append('productOfferImageUrl', this.currentOffer.productOfferImageUrl);
    }
    formData.append('productOfferDescription', this.currentOffer.productOfferDescription);
    formData.append('productOfferTitle', this.currentOffer.productOfferTitle);
    formData.append('validUntil', this.currentOffer.validUntil);
    formData.append('productOfferStatus', this.currentOffer.productOfferStatus);
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
        this.errorArray.push(error.message);
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
        this.errorArray.push(error.message);
      });
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

  prevPage() {
    if (this.productOffersQuery.page > 1) {
      this.productOffersQuery.page--;
      this.loadProductOffers();
    }
  }

  nextPage() {
    if (this.productOffersQuery.page < this.totalPages) {
      this.productOffersQuery.page++;
      this.loadProductOffers();
    }
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
}
