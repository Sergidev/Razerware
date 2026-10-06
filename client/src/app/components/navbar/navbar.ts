import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  auth = inject(AuthService);
  private router = inject(Router);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  menuOpen = signal(false);
  userMenuOpen = signal(false);

  toggleMenu() { this.menuOpen.update((v) => !v); }
  toggleUser() { this.userMenuOpen.update((v) => !v); }
  close() { this.menuOpen.set(false); }

  logout() {
    this.auth.logout();
    this.userMenuOpen.set(false);
    this.router.navigateByUrl('/');
  }

  // Close the dropdown when clicking anywhere outside the navbar
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (!this.host.nativeElement.contains(e.target as Node)) this.userMenuOpen.set(false);
  }
}