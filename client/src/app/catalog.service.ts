import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Category, Page, Product, ProductDetail } from './models';

export interface ProductQuery {
  category?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories/`);
  }

  getProducts(q: ProductQuery): Observable<Page<Product>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(q)) {
      if (value !== undefined && value !== '') params = params.set(key, String(value));
    }
    return this.http.get<Page<Product>>(`${this.api}/products/`, { params });
  }

  getProduct(slug: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.api}/products/${slug}/`);
  }
}