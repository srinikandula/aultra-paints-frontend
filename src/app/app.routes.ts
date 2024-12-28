import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register/register.component';
import {OrderComponent} from './order/order.component';
import {ListComponent} from './list/list.component';
import {TransactionsComponent} from "./transactions/transactions.component";
import {AuthGuard} from "./guards/auth.guard";
import {NoAuthGuard} from "./guards/no-auth.guard";
import { ProductListComponent } from './product-list/product-list.component';
import { BrandListComponent } from './brand-list/brand-list.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
    {path: 'register', component: RegisterComponent},
    {
        path: '', component: DashboardComponent, canActivate: [AuthGuard],
        children: [
            {path: '', component: ListComponent, canActivate: [AuthGuard]},
            {path: 'dashboard/list', component: ListComponent, canActivate: [AuthGuard]},
            {path: 'dashboard/order', component: OrderComponent},
            {path: 'dashboard/transactions', component: TransactionsComponent},
            {path: 'dashboard/product-list', component: ProductListComponent},
            {path: 'dashboard/brand-list', component: BrandListComponent},
        ]
    },
  { path: '**', redirectTo: 'login' } // Fallback route


];
