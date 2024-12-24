import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { OrderComponent } from './order/order.component';
import { ListComponent } from './list/list.component';
import {TransactionsComponent} from "./transactions/transactions.component";

export const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent, 
    children: [
      {path:'list', component:ListComponent},
      {path:'order', component:OrderComponent},
      {path:'transactions', component:TransactionsComponent},
    ]
  },
  
 
  
];
