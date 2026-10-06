import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse, User } from './models';

const ACCESS_KEY = 'rw_access';
const REFRESH_KEY = 'rw_refresh';
const USER_KEY = 'rw_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/auth`;

  user = signal<User | null>(this.readStoredUser());
  isLoggedIn = computed(() => this.user() !== null);

  accessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  refreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  /** Called once at startup: checks the stored token is still valid. */
  restoreSession() {
    if (!this.accessToken()) return;
    this.http.get<User>(`${this.api}/me/`).subscribe({
      next: (u) => this.setUser(u),
      error: () => {}, // the interceptor logs out if the refresh also fails
    });
  }

  register(data: { username: string; email: string; password: string }): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.api}/register/`, data)
      .pipe(tap((r) => this.saveSession(r)), map((r) => r.user));
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.api}/login/`, { email, password })
      .pipe(tap((r) => this.saveSession(r)), map((r) => r.user));
  }

  demo(): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.api}/demo/`, {})
      .pipe(tap((r) => this.saveSession(r)), map((r) => r.user));
  }

  refresh(): Observable<string> {
    return this.http
      .post<{ access: string }>(`${this.api}/refresh/`, { refresh: this.refreshToken() })
      .pipe(
        tap((r) => localStorage.setItem(ACCESS_KEY, r.access)),
        map((r) => r.access),
      );
  }

  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
  }

  private saveSession(r: AuthResponse) {
    localStorage.setItem(ACCESS_KEY, r.access);
    localStorage.setItem(REFRESH_KEY, r.refresh);
    this.setUser(r.user);
  }

  private setUser(u: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    this.user.set(u);
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}