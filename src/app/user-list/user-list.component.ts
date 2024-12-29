import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../services/api-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private apiService: ApiRequestService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users
  loadUsers(): void {
    this.page = this.currentPage
    this.apiService.getUsers(this.page, this.limit, this.searchQuery).subscribe((response) => {
        this.users = response.data;
          this.totalPages = response.pages;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Open modal for adding a new user
  addUser(brandModal: any): void { 
    // Reset currentUser object to ensure fields are blank
    this.currentUser = { name: '', email: '', password: '', redeemablePoints: null, cash: null };  
    this.modalService.open(brandModal);  
  }

  // Open modal for editing a user
  editUser(user: any, content: any): void {
    // Populate currentUser with the user data to be edited
    this.currentUser = { ...user };  
    this.modalService.open(content, { size: 'lg' });
  }

  // Save user (Add)
  addNewUser(modal: any): void {
    this.apiService.addUser(this.currentUser).subscribe(
      (data) => {
        this.loadUsers();
        this.showSuccess('User added successfully!');
        this.currentUser = {};  // Clear currentUser after saving
        modal.close(); 
      },
      (error) => {
        this.showError('Error adding user!');
      }
    );
  }

  // Save user (Update)
  updateUser(modal: any): void {
    if (this.currentUser._id) {
      this.apiService.updateUser(this.currentUser._id, this.currentUser).subscribe(
        (data) => {
          this.loadUsers(); 
          this.showSuccess('User updated successfully!');
          this.currentUser = {};  // Clear currentUser after saving
          modal.close(); 
        },
        (error) => {
          this.showError('Error updating user!');
        }
      );
    }
  }

  // Delete user
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

  // Success message
  showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  }

  // Error message
  showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  prevPage(): void {
    console.log(this.currentPage, this.totalPages)
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.loadUsers();
    }
  }

  nextPage(): void {
    console.log(this.currentPage, this.totalPages)
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1
      this.loadUsers();
    }
  }
}