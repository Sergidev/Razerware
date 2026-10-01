import { Component, inject, signal } from '@angular/core';
import { HealthService } from './health.service';

@Component({
  selector: 'app-root',
  template: `
    <main class="container py-5 text-center">
      <h1>Razerware</h1>
      <p class="lead">
        API status:
        <span class="badge" [class]="ok() ? 'text-bg-success' : 'text-bg-danger'">
          {{ status() }}
        </span>
      </p>
    </main>
  `,
})
export class App {
  private health = inject(HealthService);

  status = signal('checking...');
  ok = signal(false);

  constructor() {
    this.health.getHealth().subscribe({
      next: (res) => {
        this.status.set(res.status);
        this.ok.set(res.status === 'ok');
      },
      error: () => this.status.set('unreachable'),
    });
  }
}