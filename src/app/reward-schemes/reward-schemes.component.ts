import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbAlertModule, NgbInputDatepicker, NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ApiRequestService} from "../services/api-request.service";
import {ApiUrlsService} from "../services/api-urls.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reward-schemes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination, NgbAlertModule, NgbInputDatepicker],
  templateUrl: './reward-schemes.component.html',
  styleUrl: './reward-schemes.component.css'
})
export class RewardSchemesComponent implements OnInit {
  rewardSchemes: any[] = [];
  currentRewardScheme: any = {
    rewardSchemeImageUrl: '',
    rewardSchemeStatus: ''
  };

  rewardSchemesQuery: any = {
    page: 1,
    limit: 10,
    searchQuery: ''
  };

  currentPage: number = 1;
  totalPages: number = 1;

  errorArray: Array<any> = [];
  timestamp: number = new Date().getTime();
  imageWidth: string = '20%';
  uploadImageWidth: string = '20%';

  constructor(private apiRequestService: ApiRequestService, private modalService: NgbModal, public apiUrls: ApiUrlsService) {
  }

  ngOnInit(): void {
    this.loadRewardSchemes();
  }

  loadRewardSchemes() {
    this.rewardSchemes = [];
    this.apiRequestService.create(this.apiUrls.searchRewardSchemes, this.rewardSchemesQuery).subscribe((response: any) => {
      if (response.data) {
        this.rewardSchemes = response.data;
        this.totalPages = response.total;
      }
    });
  }

  openAddEditModal(modal: any, rewardScheme: any) {
    if (rewardScheme._id) {
      // Editing an existing reward scheme
      this.currentRewardScheme = { ...rewardScheme };
    } else {
      // Adding a new reward scheme, reset rewardSchemeStatus to 'Active'
      this.currentRewardScheme = { rewardSchemeStatus: 'Active', rewardSchemeImageUrl: '', rewardSchemeImage: '' };
    }
    
    const modalRef: NgbModalRef = this.modalService.open(modal, { size: 'lg' });
    modalRef.result.then(() => { this.currentRewardScheme = {}; }, () => { this.currentRewardScheme = {}; });
  }

  saveRewardScheme(modalRef: NgbModalRef) {
    const formData = new FormData();
    if (this.currentRewardScheme.rewardSchemeImage) {
      formData.append('rewardSchemeImage', this.currentRewardScheme.rewardSchemeImage);
    }
    if (this.currentRewardScheme.rewardSchemeImageUrl) {
      formData.append('rewardSchemeImageUrl', this.currentRewardScheme.rewardSchemeImageUrl);
    }
    formData.append('rewardSchemeStatus', this.currentRewardScheme.rewardSchemeStatus);
    if (this.currentRewardScheme._id) {
      this.apiRequestService.updateWithImage(this.apiUrls.updateRewardScheme + this.currentRewardScheme._id, formData).subscribe((response) => {
        if (response) {
          modalRef.close();
          Swal.fire('Success', 'Reward scheme updated successfully', 'success');
          this.timestamp = new Date().getTime();
          this.currentRewardScheme = {};
          this.errorArray = [];
          this.loadRewardSchemes();
        }
      }, error => {
        console.error('Error updating reward scheme:', error.message);
        this.errorArray = [];
        if (error && error.message === "Field value too long") {
          this.errorArray.push('File size exceeds 4 MB!');
        } else {
          this.errorArray.push(error);
        }
      });
    } else {
      this.apiRequestService.createWithImage(this.apiUrls.createRewardScheme, formData).subscribe((response) => {
        if (response) {
          modalRef.close();
          Swal.fire('Success', 'Reward scheme added successfully', 'success');
          this.timestamp = new Date().getTime();
          this.currentRewardScheme = {};
          this.errorArray = [];
          this.loadRewardSchemes();
        }
      }, error => {
        console.error('Error creating reward scheme:', error);
        this.errorArray = [];
        if (error && error.message === "Field value too long") {
          this.errorArray.push('File size exceeds 4 MB!');
        } else {
          this.errorArray.push(error);
        }
      });
    }
  }

  prevPage() {
    if (this.rewardSchemesQuery.page > 1) {
      this.rewardSchemesQuery.page--;
      this.loadRewardSchemes();
    }
  }

  nextPage() {
    if (this.rewardSchemesQuery.page < this.totalPages) {
      this.rewardSchemesQuery.page++;
      this.loadRewardSchemes();
    }
  }

  handleImageChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentRewardScheme.rewardSchemeImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


  toggleRewardSchemeStatus(rewardScheme: any) {
    rewardScheme.rewardSchemeStatus = rewardScheme.rewardSchemeStatus === 'Active' ? 'Inactive' : 'Active';
    Swal.fire({
      title: `Are you sure you want to mark this reward scheme as ${rewardScheme.rewardSchemeStatus}?`,
      text: `You are about to mark this reward scheme as ${rewardScheme.rewardSchemeStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, mark as ${rewardScheme.rewardSchemeStatus}`,
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiRequestService.update(this.apiUrls.updateRewardScheme + rewardScheme._id, rewardScheme).subscribe((response) => {
          if (response) {
            this.timestamp = new Date().getTime();
            this.loadRewardSchemes();
            Swal.fire('Status updated', 'Reward scheme status has been updated successfully', 'success');
          }
        })
      } else {
        rewardScheme.rewardSchemeStatus = rewardScheme.rewardSchemeStatus === 'Inactive'? 'Active' : 'Inactive';
      }
    });
  }

  formToggleRewardSchemeStatus(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentRewardScheme.rewardSchemeStatus = isChecked ? 'Active' : 'Inactive';

  }
}
