import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../services/api-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import {ApiUrlsService} from "../services/api-urls.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: any[] = [];
  currentUser: any = {};  
  page: number = 1;
  limit: number = 10;
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  // Mobile number validation pattern (10 digits)
  mobilePattern = '^[0-9]{10}$';
  limitOptions: number[] = [10, 20, 50, 100];
  userId: any = '';
  currentUserResetPasswordForm: any = {};

  constructor(private apiService: ApiRequestService, private modalService: NgbModal, private router: Router, private apiUrls: ApiUrlsService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users
  loadUsers(): void {
    this.page = this.currentPage
    this.apiService.getUsers(this.page, this.limit, this.searchQuery).subscribe((response) => {
        this.users = response.data;
        this.totalPages = response.total;
        // this.limitOptions = Array.from({length: Math.ceil(this.totalPages / this.limit)}, (_, i) => (i + 1) * this.limit);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  toggleUserStatus(userId: string, currentStatus: string, event: any): void {
    const currentSwitchState = event.target.checked;
    const action = currentSwitchState ? 'active' : 'inactive';  

    Swal.fire({
      title: `Are you sure you want to mark this user as ${action}?`,
      text: `You are about to mark this user as ${action}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, mark as ${action}`,
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.toggleUserStatus(userId, action).subscribe(
          (response) => {
            const user = response.user;
            const userName = user ? user.name : 'User';
            Swal.fire('Success', `${userName} has been successfully marked as ${action}.`, 'success');

            event.target.checked = action === 'active'; 

            const updatedUser = this.users.find(u => u._id === userId);
            if (updatedUser) {
              updatedUser.status = action; 
            }
          },
          (error) => {
            Swal.fire('Error', 'Failed to toggle user status', 'error');
            event.target.checked = !currentSwitchState; 
            console.error('Error toggling user status:', error);
          }
        );
      } else {
        event.target.checked = currentSwitchState;
      }
    });
  }

  addUser(brandModal: any): void {
    this.currentUser = { name: '', mobile: '', password: '', };  
    this.modalService.open(brandModal);  
  }

  editUser(user: any, content: any): void {
    this.currentUser = { ...user };  
    this.modalService.open(content, { size: 'lg' });
  }

  addNewUser(modal: any): void {
    if (this.currentUser.password !== this.currentUser.confirmPassword) {
      this.showError('Password and Confirm Password do not match!');
      return;
    }
  
    this.apiService.addUser(this.currentUser).subscribe(
      (data) => {
        this.loadUsers();
        this.showSuccess('User added successfully!');
        this.currentUser = {};  
        modal.close(); 
      },
      (error) => {
        // Check if the error response contains the 'Mobile already exists' message
        if (error.error && error.error[0] === 'Mobile already exists') {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Mobile Number',
            text: 'This mobile number is already registered. Please enter a different number.',
          });
        } else {
          this.showError('Error adding user!');
        }
      }
    );
  }
  
  updateUser(modal: any, userForm: any): void {
    console.log(userForm)
    if (userForm.invalid) {
      this.showError('Please fill in all the required fields correctly.');
      return;
    }
  
    if (this.currentUser._id) {
      this.apiService.updateUser(this.currentUser._id, this.currentUser).subscribe(
        (data) => {
          this.loadUsers();
          this.showSuccess('User updated successfully!');
          this.currentUser = {};
          modal.close();
        },
        (error) => {
          // Check if the error response contains the 'Mobile already exists' message
          if (error.error && error.error[0] === 'Mobile already exists') {
            Swal.fire({
              icon: 'error',
              title: 'Duplicate Mobile Number',
              text: 'This mobile number is already registered. Please enter a different number.',
            });
          } else {
            this.showError('Error updating user!');
          }
        }
      );
    }
  }
  

  deleteUser(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(id).subscribe(
          (data) => {
            this.loadUsers(); 
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          },
          (error) => {
            this.showError('Error deleting user!');
          }
        );
      }
    });
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

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.loadUsers();
    }
  }

  showRedeemedPoints(_id: any) {
    this.router.navigate(['dashboard/transactions'], { queryParams: { userId: _id } });
  }

  handlePageChange($event: number) {
    this.currentPage = $event;
    this.loadUsers();
  }

  handleLimitChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  resetPasswordModalOpen(user: any, content: any): void {
    this.userId = user._id;
    this.modalService.open(content, { size: 'sm' });
  }
  resetPassword(modal: any, form: any): void {
    console.log(form.value.newPassword, form.value.confirmNewPassword)
    if (form.invalid) {
      this.showError('Please fill in all the required fields correctly.');
      return;
    }

    const payload = {
      _id: this.userId,
      password: form.value.newPassword,
      confirmPassword: form.value.confirmNewPassword
    };

    this.apiService.post(this.apiUrls.resetPassword, payload).subscribe((data: any) => {
        this.showSuccess('Password reset successfully!');
        modal.close();
      }, (error: any) => {
        if (error.error && error.error[0] === 'Password and Confirm Password do not match') {
          Swal.fire({
            icon: 'error',
            title: 'Password and Confirm Password do not match',
            text: 'Please fill in the correct password and confirm password.',
          });
        } else {
          this.showError('Error resetting password!');
        }
      }
    );
  }


}