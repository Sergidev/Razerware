import { Injectable, computed, signal } from '@angular/core';
import { Product } from './models';

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  category_name: string;
  stock: number;
  quantity: number;
}

const KEY = 'rw_cart';
const MAX_QTY = 10;

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.load());
  count = computed(() => this.items().reduce((n, i) => n + i.quantity, 0));
  total = computed(() => this.items().reduce((s, i) => s + i.price * i.quantity, 0));

  maxFor(item: { stock: number }): number {
    return Math.min(item.stock, MAX_QTY);
  }

  add(p: Product, qty = 1) {
    if (p.stock <= 0) return;
    const limit = Math.min(p.stock, MAX_QTY);

    this.update((items) => {
      if (items.some((i) => i.slug === p.slug)) {
        return items.map((i) =>
          i.slug === p.slug ? { ...i, quantity: Math.min(i.quantity + qty, limit) } : i,
        );
      }
      return [
        ...items,
        {
          slug: p.slug,
          name: p.name,
          price: Number(p.price),
          image: p.image,
          category_name: p.category_name,
          stock: p.stock,
          quantity: Math.min(qty, limit),
        },
      ];
    });
  }

  setQuantity(slug: string, qty: number) {
    if (qty < 1) return this.remove(slug);
    this.update((items) =>
      items.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(qty, this.maxFor(i)) } : i)),
    );
  }

  remove(slug: string) {
    this.update((items) => items.filter((i) => i.slug !== slug));
  }

  clear() {
    this.update(() => []);
  }

  private update(fn: (items: CartItem[]) => CartItem[]) {
    const next = fn(this.items());
    this.items.set(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode, quota): the cart still works in memory
    }
  }

  private load(): CartItem[] {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      if (!Array.isArray(data)) return [];
      // Discard anything that does not look like a cart item
      return data.filter(
        (i) =>
          typeof i?.slug === 'string' &&
          typeof i?.name === 'string' &&
          Number.isFinite(i?.price) &&
          Number.isInteger(i?.quantity) &&
          i.quantity > 0,
      );
    } catch {
      return [];
    }
  }
}