import { Component, inject, signal } from '@angular/core';
import { HealthService } from './health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private health = inject(HealthService);

  menuOpen = signal(false);
  apiStatus = signal<'checking' | 'online' | 'offline'>('checking');

  navLinks = ['Home', 'Products', 'AI Advisor', 'About'];

  features = [
    {
      icon: '🤖',
      title: 'AI Hardware Advisor',
      text: 'Tell our Gemini-powered assistant what you play and your budget. It recommends real products from the catalog.',
    },
    {
      icon: '🖥️',
      title: 'Gaming-first Catalog',
      text: 'Pre-built rigs, laptops and components with detailed specs, filters and instant search.',
    },
    {
      icon: '🛒',
      title: 'Full Shopping Flow',
      text: 'Accounts, cart and a simulated checkout, so you can try the whole experience end to end.',
    },
  ];

  constructor() {
    this.health.getHealth().subscribe({
      next: (res) => this.apiStatus.set(res.status === 'ok' ? 'online' : 'offline'),
      error: () => this.apiStatus.set('offline'),
    });
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
}