import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { filter } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {ApiRequestService} from "../services/api-request.service";
import {ApiUrlsService} from "../services/api-urls.service";

declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed: boolean = false;  // Sidebar starts collapsed by default
  active: boolean = false;
  currentUser: any = {};
  userDashboardData: any;

  constructor(private router: Router, private AuthService: AuthService, private apiService: ApiRequestService, private apiUrls: ApiUrlsService) {
    this.currentUser = this.AuthService.currentUserValue;
  }
  
  ngOnInit() {
    this.userDashboard()
  }

  userDashboard(): void {
    // debugger
    this.apiService.create(this.apiUrls.userDashboard, {id: this.currentUser.id, accountType: this.currentUser.accountType}).subscribe((response) => {
      this.userDashboardData = response.data;
    }, (error) => {
      console.error('Error loading branches:', error);
    });
  }
}
