import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  formError = signal('');
  fieldErrors = signal<Record<string, string[]>>({});
  showPassword = signal(false);

  form = this.fb.nonNullable.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    if (this.auth.isLoggedIn()) this.router.navigateByUrl('/');

    this.route.data.subscribe((d) => {
      this.mode.set(d['mode']);
      this.formError.set('');
      this.fieldErrors.set({});
      this.applyValidators();
    });
  }

  private applyValidators() {
    const { username, password } = this.form.controls;
    if (this.mode() === 'register') {
      username.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[\w.-]+$/),
      ]);
      password.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      username.clearValidators();
      password.setValidators([Validators.required]);
    }
    username.updateValueAndValidity();
    password.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, email, password } = this.form.getRawValue();
    this.run(
      this.mode() === 'register'
        ? this.auth.register({ username, email, password })
        : this.auth.login(email, password),
    );
  }

  demo() {
    this.run(this.auth.demo());
  }

  private run(request: Observable<User>) {
    this.loading.set(true);
    this.formError.set('');
    this.fieldErrors.set({});

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.returnUrl());
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.handleError(err);
      },
    });
  }

  private returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    return url.startsWith('/') && !url.startsWith('//') ? url : '/';
  }

  private handleError(err: HttpErrorResponse) {
    if (err.status === 400 && typeof err.error === 'object') {
      this.fieldErrors.set(err.error);
    } else if (err.status === 401) {
      this.formError.set(err.error?.detail ?? 'Invalid email or password.');
    } else if (err.status === 429) {
      this.formError.set('Too many attempts. Please wait a while and try again.');
    } else {
      this.formError.set('Something went wrong. If the server was asleep, try again in a few seconds.');
    }
  }
}