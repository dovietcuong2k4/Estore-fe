import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CreateOrderRequest,
  Order,
  OrderResponse,
  mapOrderResponseToOrder
} from '../models/order.model';
import { BaseResultDTO } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { User, UserResponse, mapUserResponseToUser } from '../models/user.model';

export interface AdminOrderFilters {
  status?: string;
  shipperId?: number | null;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private readonly ordersSignal = signal<Order[]>([]);
  private readonly shippersSignal = signal<User[]>([]);

  readonly orders = computed(() => this.ordersSignal());
  readonly shippers = computed(() => this.shippersSignal());
  readonly myOrders = computed(() => this.ordersSignal());
  readonly allOrders = computed(() => this.ordersSignal());
  readonly shipperOrders = computed(() => this.ordersSignal());

  async createOrder(request: CreateOrderRequest): Promise<{ success: boolean; message: string; orderId?: number; }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<any>>('/orders', request)
      );
      if (res.success) {
        await this.loadMyOrders();
        return { 
          success: res.success, 
          message: res.message,
          orderId: res.data?.id
        };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Tạo đơn hàng thất bại' };
    }
  }


  getOrderById(id: number): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  async loadMyOrders(): Promise<void> {
    await this.loadOrdersFrom('/orders');
  }

  async loadStaffOrders(): Promise<void> {
    await this.loadOrdersFrom('/staff/orders');
  }

  async loadShipperOrders(): Promise<void> {
    await this.loadOrdersFrom('/shipper/orders');
  }

  async loadAdminOrders(filters: AdminOrderFilters = {}): Promise<void> {
    const params: Record<string, string | number> = {};
    if (filters.status) params['status'] = filters.status;
    if (filters.shipperId) params['shipperId'] = filters.shipperId;
    if (filters.date) params['date'] = filters.date;
    await this.loadOrdersFrom('/admin/orders', params);
  }

  async loadStaffShippers(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<UserResponse[]>>('/staff/shippers')
      );
      this.shippersSignal.set((res.data ?? []).map(mapUserResponseToUser));
    } catch (err) {
      console.error('Failed to load shippers', err);
      this.shippersSignal.set([]);
    }
  }

  async processOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    const basePath = this.isAdmin() ? '/admin' : '/staff';
    return this.updateOrderViaApi(`${basePath}/orders/${orderId}/process`);
  }

  async readyForShipping(orderId: number): Promise<{ success: boolean; message: string }> {
    const basePath = this.isAdmin() ? '/admin' : '/staff';
    return this.updateOrderViaApi(`${basePath}/orders/${orderId}/ready`);
  }

  async assignShipper(orderId: number, shipperId: number): Promise<{ success: boolean; message: string }> {
    const basePath = this.isAdmin() ? '/admin' : '/staff';
    return this.updateOrderViaApi(`${basePath}/orders/${orderId}/assign-shipper`, { shipperId });
  }

  async cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    const user = this.auth.user();
    if (!user) return { success: false, message: 'Bạn chưa đăng nhập' };

    const isAdmin = this.isAdmin();
    const isStaff = user.roles.some(role => role.name === 'ROLE_STAFF');
    const isCustomer = user.roles.some(role => role.name === 'ROLE_CUSTOMER');

    if (isAdmin || isStaff) {
      const basePath = isAdmin ? '/admin' : '/staff';
      return this.updateOrderViaApi(`${basePath}/orders/${orderId}/cancel`);
    } else if (isCustomer) {
      const res = await this.updateOrderViaApi(`/orders/${orderId}/cancel`);
      if (res.success) {
        await this.loadMyOrders();
      }
      return res;
    }
    
    return { success: false, message: 'Bạn không có quyền hủy đơn hàng này' };
  }

  async retryShipping(orderId: number): Promise<{ success: boolean; message: string }> {
    const basePath = this.isAdmin() ? '/admin' : '/staff';
    const endpoint = this.isAdmin() ? `${basePath}/orders/${orderId}/retry` : `${basePath}/orders/${orderId}/ready`;
    return this.updateOrderViaApi(endpoint);
  }

  async startShipping(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/${orderId}/start`);
  }

  async markAsDelivered(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/${orderId}/deliver`);
  }

  async markAsFailed(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/${orderId}/fail`);
  }

  getOrderStats() {
    const orders = this.ordersSignal();
    return {
      total: orders.length,
      created: orders.filter(o => o.status === 'CREATED').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      readyForShipping: orders.filter(o => o.status === 'READY_FOR_SHIPPING').length,
      shipping: orders.filter(o => o.status === 'SHIPPING').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      deliveryFailed: orders.filter(o => o.status === 'DELIVERY_FAILED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      totalRevenue: orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0)
    };
  }

  private async loadOrdersFrom(path: string, params?: Record<string, string | number>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<OrderResponse[]>>(path, params)
      );
      this.ordersSignal.set((res.data ?? []).map(mapOrderResponseToOrder));
    } catch (err) {
      console.error(`Failed to load orders from ${path}`, err);
      this.ordersSignal.set([]);
    }
  }

  private async updateOrderViaApi(path: string, body: unknown = {}): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.put<BaseResultDTO<void>>(path, body)
      );
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Cập nhật đơn hàng thất bại' };
    }
  }

  private isAdmin(): boolean {
    return this.auth.user()?.roles.some(role => role.name === 'ROLE_ADMIN') ?? false;
  }
}
