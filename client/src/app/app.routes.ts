import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Advisor } from './pages/advisor/advisor';
import { About } from './pages/about/about';
import { Auth } from './pages/auth/auth';
import { ProductDetailPage } from './pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:slug', component: ProductDetailPage },
  { path: 'advisor', component: Advisor },
  { path: 'about', component: About },
  { path: 'login', component: Auth, data: { mode: 'login' } },
  { path: 'register', component: Auth, data: { mode: 'register' } },
  { path: '**', redirectTo: '' },
];