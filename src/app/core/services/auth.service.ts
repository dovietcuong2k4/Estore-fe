import { Injectable, signal, computed } from '@angular/core';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'estore_auth';
  private readonly currentUser = signal<User | null>(this.loadUser());

  readonly user = computed(() => this.currentUser());
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.hasRole('ADMIN'));
  readonly isStaff = computed(() => this.hasRole('STAFF'));
  readonly isShipper = computed(() => this.hasRole('SHIPPER'));
  readonly isCustomer = computed(() => this.hasRole('CUSTOMER'));

  constructor(private mockData: MockDataService) {}

  login(request: LoginRequest): { success: boolean; message: string } {
    const user = this.mockData.mockUsers.find(u => u.email === request.email);
    if (!user) {
      return { success: false, message: 'Email không tồn tại trong hệ thống' };
    }
    // Mock: accept any password
    this.currentUser.set(user);
    this.saveUser(user);
    return { success: true, message: 'Đăng nhập thành công' };
  }

  register(request: RegisterRequest): { success: boolean; message: string } {
    const exists = this.mockData.mockUsers.find(u => u.email === request.email);
    if (exists) {
      return { success: false, message: 'Email đã được sử dụng' };
    }
    const newUser: User = {
      id: Date.now(),
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      address: request.address,
      roles: [{ id: 3, name: 'CUSTOMER' }]
    };
    this.mockData.mockUsers.push(newUser);
    this.currentUser.set(newUser);
    this.saveUser(newUser);
    return { success: true, message: 'Đăng ký thành công' };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
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
