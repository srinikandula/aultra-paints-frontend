import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { filter } from 'rxjs';
import {AuthService} from "../services/auth.service";

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

  constructor(private router: Router, private AuthService: AuthService) {}
  
  ngOnInit() {
    (($) => {
      $(document).ready( () => {
        const treeviewMenu = $('.app-menu');
        // Toggle Sidebar
        // tslint:disable-next-line:only-arrow-functions typedef
        $('[data-toggle="sidebar"]').click(function(event: any) {
          event.preventDefault();
          $('.app').toggleClass('sidenav-toggled');
        });

        // Activate sidebar treeview toggle
        $('[data-toggle=\'treeview\']').click(function(event: any) {
          event.preventDefault();
          // @ts-ignore
          if (!($(this).parent()[0] as HTMLElement).classList.contains('is-expanded')) {
            treeviewMenu.find('[data-toggle=\'treeview\']').parent().removeClass('is-expanded');
          }
          // @ts-ignore
          $(this).parent().toggleClass('is-expanded');
        });

        // Set initial active toggle
        $('[data-toggle=\'treeview.\'].is-expanded').parent().toggleClass('is-expanded');

      });
    })(jQuery);
  }

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

  toggle() {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
    // if (!this.config.multi) {
    //   this.menuGet.filter((menu: { active: any; }, i: number) => i !== index && menu.active).forEach((menu: { active: boolean; }) => menu.active = !menu.active);
    // }
    // this.menuGet[index].active = !this.menuGet[index].active;

  }
}
