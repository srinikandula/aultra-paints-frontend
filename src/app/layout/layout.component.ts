import { Component } from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {Router, RouterModule, RouterOutlet} from "@angular/router";
import {AuthService} from "../services/auth.service";

declare var jQuery: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarCollapsed: boolean = false;  
  active: boolean = false;
  currentUser: any = {};
   orderActive: boolean = false;

  constructor(private router: Router, private AuthService: AuthService) {
    this.currentUser = this.AuthService.currentUserValue;
  }

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

  //  Custom redirect logic
  const currentUrl = this.router.url;
  if (currentUrl === '/' || currentUrl === '') {
    if (this.currentUser?.accountType === 'SuperUser') {
      this.router.navigate(['/piechart-dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
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

  
    // if (!this.config.multi) {
    //   this.menuGet.filter((menu: { active: any; }, i: number) => i !== index && menu.active).forEach((menu: { active: boolean; }) => menu.active = !menu.active);
    // }
    // this.menuGet[index].active = !this.menuGet[index].active;

  
    toggleOrderMenu() {
      this.orderActive = !this.orderActive;
      if (this.orderActive) {
        this.active = false; // Close Masters menu when Order menu is opened
      }
    }
  
    toggle() {
      this.active = !this.active;
      if (this.active) {
        this.orderActive = false; // Close Order menu when Masters menu is opened
      }
    }
  
    
}
