import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../catalog.service';
import { Category, Product } from '../../models';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private catalog = inject(CatalogService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal(false);

  selectedCategory = signal('');
  search = signal('');
  ordering = signal('name');
  page = signal(1);
  pageSize = 12;

  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.catalog.getCategories().subscribe((c) => this.categories.set(c));
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(false);
    this.catalog
      .getProducts({
        category: this.selectedCategory(),
        search: this.search(),
        ordering: this.ordering(),
        page: this.page(),
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.results);
          this.total.set(res.count);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  pickCategory(slug: string) {
    this.selectedCategory.set(slug);
    this.page.set(1);
    this.load();
  }

  onSearch(value: string) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.search.set(value);
      this.page.set(1);
      this.load();
    }, 300);
  }

  onOrdering(value: string) {
    this.ordering.set(value);
    this.page.set(1);
    this.load();
  }

  goTo(p: number) {
    this.page.set(p);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: Math.ceil(this.total() / this.pageSize) }, (_, i) => i + 1);
  }
}