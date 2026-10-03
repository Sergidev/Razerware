import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../catalog.service';
import { Product } from '../../models';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private catalog = inject(CatalogService);

  topProducts = signal<Product[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor() {
    this.catalog
      .getProducts({ category: 'desktops,laptops', ordering: '-price' })
      .subscribe({
        next: (res) => {
          this.topProducts.set(res.results.slice(0, 5));
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}