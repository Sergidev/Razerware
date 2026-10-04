import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { CatalogService } from '../../catalog.service';
import { ProductDetail } from '../../models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, KeyValuePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailPage {
  private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);
  private location = inject(Location);

  product = signal<ProductDetail | null>(null);
  loading = signal(true);
  notFound = signal(false);

  back() {
  this.location.back();
  }

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.catalog.getProduct(slug).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }
}