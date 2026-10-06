import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

const PUBLIC_ENDPOINTS = ['/auth/login/', '/auth/register/', '/auth/demo/', '/auth/refresh/'];

const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  const skip =
    !token ||
    !req.url.startsWith(environment.apiUrl) ||
    PUBLIC_ENDPOINTS.some((p) => req.url.includes(p));
  if (skip) return next(req);

  return next(withToken(req, token)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || !auth.refreshToken()) return throwError(() => err);

      // Access token expired: get a new one and retry the request once
      return auth.refresh().pipe(
        catchError((e) => {
          auth.logout();
          return throwError(() => e);
        }),
        switchMap((newToken) => next(withToken(req, newToken))),
      );
    }),
  );
};