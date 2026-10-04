import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

    // Every time the URL query params change, read them and reload
    this.route.queryParamMap.subscribe((params) => {
      this.selectedCategory.set(params.get('category') ?? '');
      this.search.set(params.get('search') ?? '');
      this.ordering.set(params.get('ordering') ?? 'name');
      this.page.set(Number(params.get('page') ?? 1));
      this.load();
    });
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

  // Updates the URL; the queryParamMap subscription does the reload
  private updateUrl(changes: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: changes,
      queryParamsHandling: 'merge',
    });
  }

  pickCategory(slug: string) {
    this.updateUrl({ category: slug || null, page: null });
  }

  onSearch(value: string) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.updateUrl({ search: value || null, page: null });
    }, 300);
  }

  onOrdering(value: string) {
    this.updateUrl({ ordering: value === 'name' ? null : value, page: null });
  }

  goTo(p: number) {
    this.updateUrl({ page: p === 1 ? null : p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: Math.ceil(this.total() / this.pageSize) }, (_, i) => i + 1);
  }
}