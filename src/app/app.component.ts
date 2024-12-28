import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from "./spinner/spinner.component";


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SpinnerComponent,],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = "Angular App";
}
  
 

  
  

    
 
  
