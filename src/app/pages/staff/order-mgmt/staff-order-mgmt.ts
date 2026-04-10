import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-staff-order-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-order-mgmt.html',
  styleUrl: './staff-order-mgmt.scss'
})
export class StaffOrderMgmtComponent {
  private orderService = inject(OrderService);
  private mockData = inject(MockDataService);

  readonly orders = computed(() => this.orderService.allOrders());
  
  selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  selectedOrder = signal<Order | null>(null);
  selectedShipperId = signal<number | null>(null);

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.orders();
    return this.orders().filter((o: Order) => o.status === status);
  });

  shippers = computed(() => {
    return this.mockData.mockUsers.filter((u: User) => u.roles.some(r => r.name === 'SHIPPER'));
  });

  constructor() {}

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  confirmOrder(orderId: number) {
    this.orderService.confirmOrder(orderId);
  }

  prepareOrder(orderId: number) {
    this.orderService.prepareOrder(orderId);
  }

  handoverToShipper(orderId: number) {
    const shipperId = this.selectedShipperId();
    if (shipperId) {
      this.orderService.handoverToShipper(orderId, shipperId);
      this.selectedOrder.set(null);
      this.selectedShipperId.set(null);
    } else {
      alert('Please select a shipper first!');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
