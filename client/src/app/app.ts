import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService } from './health.service';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
})
export class App {
  private health = inject(HealthService);
  apiStatus = signal<'checking' | 'online' | 'offline'>('checking');

  constructor() {
    this.health.getHealth().subscribe({
      next: (res) => this.apiStatus.set(res.status === 'ok' ? 'online' : 'offline'),
      error: () => this.apiStatus.set('offline'),
    });
  }
}