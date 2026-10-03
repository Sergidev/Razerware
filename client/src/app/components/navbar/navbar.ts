import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  menuOpen = signal(false);
  toggleMenu() { this.menuOpen.update((v) => !v); }
  close() { this.menuOpen.set(false); }
}