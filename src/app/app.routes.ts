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
import {LayoutComponent} from "./layout/layout.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {RewardSchemesComponent} from "./reward-schemes/reward-schemes.component";
import {ProductOffersComponent} from "./product-offers/product-offers.component";
import { UnverifiedUsersComponent } from './unverified-users/unverified-users.component';
import { PayoutsComponent } from './payouts/payouts.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {
        path: '', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
            {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
            {path: 'batch-list', component: BatchListComponent, canActivate: [AuthGuard]},
            {path: 'create-batch', component:CreateBatchComponent, canActivate: [AuthGuard]},
            {path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
            {path: 'product-list', component: ProductListComponent, canActivate: [AuthGuard]},
            {path: 'brand-list', component: BrandListComponent, canActivate: [AuthGuard]},
            {path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
            {path: 'unverified-users', component: UnverifiedUsersComponent, canActivate: [AuthGuard]},
            {path: 'product-offers', component: ProductOffersComponent, canActivate: [AuthGuard]},
            {path: 'reward-schemes', component: RewardSchemesComponent, canActivate: [AuthGuard]},
            {path: 'cash-free', component: PayoutsComponent, canActivate: [AuthGuard]},
        ]

    },
  { path: '**', redirectTo: 'login' } 
                              

];
