import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem, OrderStatus, CreateOrderRequest } from '../models/order.model';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly STORAGE_KEY = 'estore_orders';
  private readonly ordersSignal = signal<Order[]>(this.loadFromStorage());

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

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private mockData: MockDataService
  ) {}

  createOrder(request: CreateOrderRequest): Order | null {
    const user = this.auth.user();
    if (!user) return null;

    const cartItems = this.cart.items();
    if (cartItems.length === 0) return null;

    const orderItems: OrderItem[] = cartItems.map((item, index) => ({
      id: Date.now() + index,
      orderId: Date.now(),
      productId: item.productId,
      quantity: item.quantity,
      price: item.product?.price ?? 0,
      product: item.product
    }));

    const order: Order = {
      id: Date.now(),
      userId: user.id,
      receiverName: request.receiverName,
      receiverPhone: request.receiverPhone,
      receiverAddress: request.receiverAddress,
      note: request.note,
      orderDate: new Date().toISOString(),
      status: 'CREATED',
      items: orderItems,
      totalPrice: this.cart.totalPrice()
    };

    this.ordersSignal.set([...this.ordersSignal(), order]);
    this.saveToStorage();
    this.cart.clearCart();
    return order;
  }

  getOrderById(id: number): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): void {
    this.ordersSignal.set(
      this.ordersSignal().map(o => {
        if (o.id === orderId) {
          const update: Partial<Order> = { status };
          if (status === 'SHIPPING') update.shippingDate = new Date().toISOString();
          if (status === 'DELIVERED') update.receivedDate = new Date().toISOString();
          return { ...o, ...update };
        }
        return o;
      })
    );
    this.saveToStorage();
  }

  assignShipper(orderId: number, shipperId: number): void {
    this.ordersSignal.set(
      this.ordersSignal().map(o =>
        o.id === orderId ? { ...o, shipperId, status: 'PENDING' as OrderStatus } : o
      )
    );
    this.saveToStorage();
  }

  confirmOrder(orderId: number): void {
    this.updateOrderStatus(orderId, 'PENDING');
  }

  cancelOrder(orderId: number): void {
    this.updateOrderStatus(orderId, 'CANCELLED');
  }

  getOrderStats() {
    const orders = this.ordersSignal();
    return {
      total: orders.length,
      created: orders.filter(o => o.status === 'CREATED').length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      shipping: orders.filter(o => o.status === 'SHIPPING').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      totalRevenue: orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0)
    };
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ordersSignal()));
  }

  private loadFromStorage(): Order[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
