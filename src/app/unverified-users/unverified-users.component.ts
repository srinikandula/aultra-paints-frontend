import { Component } from '@angular/core';
import { ApiRequestService } from '../services/api-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unverified-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './unverified-users.component.html',
  styleUrl: './unverified-users.component.css'
})
export class UnverifiedUsersComponent {
  unverifiedUsers: any[] = [];
  totalUsers: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;  
  searchQuery: string = '';
  limitOptions: number[] = [10, 20, 50, 100]; 

  constructor(private apiRequestService: ApiRequestService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUnverifiedUsers(); 
  }

  // Method to fetch users with searchQuery, page, and limit
  fetchUnverifiedUsers(page: number = 1, limit: number = 10, searchQuery: string = ''): void {
    console.log('Fetching users with search query:', searchQuery);  // Debugging line
    this.apiRequestService.getUnverifiedUsers(page, limit, searchQuery).subscribe({
      next: (response) => {
        this.unverifiedUsers = response.data;
        this.totalUsers = response.total;
        this.totalPages = response.pages;
        this.currentPage = response.currentPage;
        console.log('Fetched data:', response); 
      },
      error: (error) => {
        console.error('Error fetching unverified users', error);
      }
    });
  }

  // Method triggered when page size is changed
  handleLimitChange(): void {
    this.fetchUnverifiedUsers(this.currentPage, this.limit, this.searchQuery);
  }

  // Method triggered when page changes
  handlePageChange(page: number): void {
    this.currentPage = page;
    this.fetchUnverifiedUsers(this.currentPage, this.limit, this.searchQuery);
  }

  // Method triggered on search input change
  searchUnverifiedUsers(): void {
    console.log('Search query changed:', this.searchQuery);  
    this.fetchUnverifiedUsers(this.currentPage, this.limit, this.searchQuery);
  }

  showRedeemedPoints(_id: any) {
    this.router.navigate(['/transactions'], { queryParams: { userId: _id } });
  }
}