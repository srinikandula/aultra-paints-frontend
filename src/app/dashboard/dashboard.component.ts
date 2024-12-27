import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { filter } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  isSidebarCollapsed: boolean = false;  // Sidebar starts collapsed by default

  constructor(private router: Router, private AuthService: AuthService) {}

  // Toggle the sidebar between collapsed and expanded states
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Navigate to a new route
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Logout functionality
  logout(): void {
   this.AuthService.logOut();
  }
}
