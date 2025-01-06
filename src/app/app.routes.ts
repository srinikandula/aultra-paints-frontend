import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register/register.component';
import {TransactionsComponent} from "./transactions/transactions.component";
import {AuthGuard} from "./guards/auth.guard";
import {NoAuthGuard} from "./guards/no-auth.guard";
import { ProductListComponent } from './product-list/product-list.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
    {path: 'register', component: RegisterComponent},
    {
        path: '', component: DashboardComponent, canActivate: [AuthGuard],
        children: [
            {path: '', component: BatchListComponent, canActivate: [AuthGuard]},
            {path: 'dashboard/batch-list', component: BatchListComponent, canActivate: [AuthGuard]},
            {path: 'dashboard/create-batch', component:CreateBatchComponent },
            {path: 'dashboard/transactions', component: TransactionsComponent},
            {path: 'dashboard/product-list', component: ProductListComponent},
            {path: 'dashboard/brand-list', component: BrandListComponent},
            {path: 'dashboard/user-list', component: UserListComponent},
        ]
    },
  { path: '**', redirectTo: 'login' } 


];
