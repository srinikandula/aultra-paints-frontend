import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import Chart from 'chart.js/auto';

import { error } from 'console';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = "Angular App";


}
  
 

  
  

    
 
  
