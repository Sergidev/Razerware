import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AdvisorProduct } from './models';

export interface AdvisorResponse {
  reply: string;
  products: AdvisorProduct[];
}

@Injectable({ providedIn: 'root' })
export class AdvisorService {
  private http = inject(HttpClient);

  ask(messages: { role: string; content: string }[]): Observable<AdvisorResponse> {
    return this.http.post<AdvisorResponse>(`${environment.apiUrl}/advisor/`, { messages });
  }
}