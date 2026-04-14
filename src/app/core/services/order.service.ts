import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Order, OrderStatus, CreateOrderRequest,
  OrderResponse, mapOrderResponseToOrder
} from '../models/order.model';
import { BaseResultDTO } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private readonly ordersSignal = signal<Order[]>([]);

  readonly orders = computed(() => this.ordersSignal());

  readonly myOrders = computed(() => {
    const userId = this.auth.user()?.id;
    if (!userId) return [];
    return this.ordersSignal()
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  readonly allOrders = computed(() => {
    return this.ordersSignal()
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  readonly shipperOrders = computed(() => {
    const shipperId = this.auth.user()?.id;
    if (!shipperId) return [];
    return this.ordersSignal()
      .filter(o => o.shipperId === shipperId)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  // --- API calls ---

  /** Load orders from BE (GET /api/orders) */
  async loadOrders(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<OrderResponse[]>>('/orders')
      );
      if (res.success && res.data) {
        this.ordersSignal.set(res.data.map(mapOrderResponseToOrder));
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  }

  /** Customer: create order (POST /api/orders) */
  async createOrder(request: CreateOrderRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<void>>('/orders', request)
      );
      if (res.success) {
        await this.loadOrders();
      }
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Tạo đơn hàng thất bại' };
    }
  }

  getOrderById(id: number): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  // --- Staff APIs ---

  /** Staff: confirm order → CONFIRMED */
  async confirmOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/staff/orders/confirm/${orderId}`);
  }

  /** Staff: prepare order → PREPARING */
  async prepareOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/staff/orders/prepare/${orderId}`);
  }

  /** Staff: ready for shipping → READY_FOR_SHIPPING */
  async readyForShipping(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/staff/orders/ready/${orderId}`);
  }

  // --- Shipper APIs ---

  /** Shipper: start shipping → SHIPPING */
  async startShipping(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/shipping/${orderId}`);
  }

  /** Shipper: mark delivered → DELIVERED */
  async markAsDelivered(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/delivered/${orderId}`);
  }

  /** Shipper: mark failed → DELIVERY_FAILED */
  async markAsFailed(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/shipper/orders/delivery-failed/${orderId}`);
  }

  // --- Admin APIs ---

  /** Admin: confirm order → CONFIRMED */
  async adminConfirmOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/admin/orders/confirm/${orderId}`);
  }

  /** Admin: cancel order → CANCELLED */
  async cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    return this.updateOrderViaApi(`/admin/orders/cancel/${orderId}`);
  }

  // --- Stats (computed from local data) ---

  getOrderStats() {
    const orders = this.ordersSignal();
    return {
      total: orders.length,
      created: orders.filter(o => o.status === 'CREATED').length,
      confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
      preparing: orders.filter(o => o.status === 'PREPARING').length,
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

  // --- Shared helper ---

  private async updateOrderViaApi(path: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.put<BaseResultDTO<void>>(path)
      );
      if (res.success) {
        await this.loadOrders();
      }
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Cập nhật đơn hàng thất bại' };
    }
  }
}
