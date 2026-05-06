import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = `${environment.apiUrl}/api`;
  private readonly TOKEN_KEY = 'estore_token';

  constructor(private http: HttpClient) {}

  private getHeaders(contentType: string | null = 'application/json'): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    let headers = new HttpHeaders();
    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }
    return this.http.get<T>(`${this.BASE_URL}${path}`, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.http.post<T>(`${this.BASE_URL}${path}`, body, {
      headers: this.getHeaders(isFormData ? null : 'application/json')
    });
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.http.put<T>(`${this.BASE_URL}${path}`, body, {
      headers: this.getHeaders(isFormData ? null : 'application/json')
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}${path}`, {
      headers: this.getHeaders() // defaults to application/json but delete usually has no body
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
