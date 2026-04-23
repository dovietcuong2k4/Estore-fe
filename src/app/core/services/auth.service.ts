import { Injectable, signal, computed, inject } from '@angular/core';
import {
  User, LoginRequest, RegisterRequest, AuthResponse,
  BaseResultDTO, mapUserResponseToUser
} from '../models/user.model';
import { ApiService } from './api.service';
import { MockDataService } from './mock-data.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'estore_auth';
  private api = inject(ApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // MockDataService is kept but no longer used for auth logic
  private mockData = inject(MockDataService);

  private readonly currentUser = signal<User | null>(this.loadUser());

  readonly user = computed(() => this.currentUser());
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.hasRole('ROLE_ADMIN'));
  readonly isStaff = computed(() => this.hasRole('ROLE_STAFF'));
  readonly isShipper = computed(() => this.hasRole('ROLE_SHIPPER'));
  readonly isCustomer = computed(() => this.hasRole('ROLE_CUSTOMER'));

  async login(request: LoginRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<AuthResponse>>('/auth/login', request)
      );

      if (res.success && res.data) {
        const user = mapUserResponseToUser(res.data.user);
        this.api.saveToken(res.data.token);
        this.currentUser.set(user);
        this.saveUser(user);
        return { success: true, message: res.message || 'Đăng nhập thành công' };
      }

      return { success: false, message: res.message || 'Đăng nhập thất bại' };
    } catch (err: any) {
      const message = err?.error?.message || 'Lỗi kết nối server';
      return { success: false, message };
    }
  }

  async register(request: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<void>>('/auth/register', request)
      );

      if (res.success) {
        return { success: true, message: res.message || 'Đăng ký thành công' };
      }
      return { success: false, message: res.message || 'Đăng ký thất bại' };
    } catch (err: any) {
      const message = err?.error?.message || 'Lỗi kết nối server';
      return { success: false, message };
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.api.clearToken();
    localStorage.removeItem(this.STORAGE_KEY);
    this.toastService.success('Đăng xuất thành công');
    this.router.navigate(['/login']);
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.saveUser(user);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles.some(r => r.name === role) ?? false;
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private loadUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
