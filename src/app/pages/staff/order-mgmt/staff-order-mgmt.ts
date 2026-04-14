import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-staff-order-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-order-mgmt.html',
  styleUrl: './staff-order-mgmt.scss'
})
export class StaffOrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);

  readonly orders = computed(() => this.orderService.allOrders());
  
  selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  selectedOrder = signal<Order | null>(null);

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.orders();
    return this.orders().filter((o: Order) => o.status === status);
  });

  ngOnInit() {
    this.orderService.loadOrders();
  }

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  async confirmOrder(orderId: number) {
    await this.orderService.confirmOrder(orderId);
    this.selectedOrder.set(null);
  }

  async prepareOrder(orderId: number) {
    await this.orderService.prepareOrder(orderId);
    this.selectedOrder.set(null);
  }

  async readyForShipping(orderId: number) {
    await this.orderService.readyForShipping(orderId);
    this.selectedOrder.set(null);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
