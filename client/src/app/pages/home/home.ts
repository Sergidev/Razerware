import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    { icon: '🤖', title: 'AI Hardware Advisor', text: 'Tell our Gemini-powered assistant what you play and your budget. It recommends real products from the catalog.' },
    { icon: '🖥️', title: 'Gaming-first Catalog', text: 'Pre-built rigs, laptops and components with detailed specs, filters and instant search.' },
    { icon: '🛒', title: 'Full Shopping Flow', text: 'Accounts, cart and a simulated checkout, so you can try the whole experience end to end.' },
  ];
}