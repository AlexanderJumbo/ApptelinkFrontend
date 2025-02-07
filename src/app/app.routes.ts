import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { GenerateOrderComponent } from './pages/generate-order/generate-order.component';
import { authGuard } from './custom/auth.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordRequestComponent } from './pages/reset-password-request/reset-password-request.component';
import { AfterRequestComponent } from './components/after-request/after-request.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password-request', component: ResetPasswordRequestComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    { path: 'generate-order', component: GenerateOrderComponent, canActivate: [authGuard] },
    { path: 'request-completed', component: AfterRequestComponent/* , canActivate: [authGuard] */ },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
