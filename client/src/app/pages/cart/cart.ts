import { Component, OnDestroy, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CartService } from '../../cart.service';

type Step = 'cart' | 'processing' | 'done';

interface FakeOrder {
  number: string;
  total: number;
  items: number;
  email: string;
}

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnDestroy {
  cart = inject(CartService);
  private auth = inject(AuthService);

  step = signal<Step>('cart');
  order = signal<FakeOrder | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  pay() {
    if (this.step() !== 'cart' || this.cart.items().length === 0) return;
    this.step.set('processing');

    this.timer = setTimeout(() => {
      this.order.set({
        number: 'RW-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        total: this.cart.total(),
        items: this.cart.count(),
        email: this.auth.user()?.email ?? 'your email address',
      });
      this.cart.clear();
      this.step.set('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}