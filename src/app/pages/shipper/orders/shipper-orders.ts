import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-shipper-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipper-orders.html',
  styleUrl: './shipper-orders.scss'
})
export class ShipperOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  readonly assignedOrders = computed(() => this.orderService.shipperOrders());
  
  selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  selectedOrder = signal<Order | null>(null);

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.assignedOrders();
    return this.assignedOrders().filter((o: Order) => o.status === status);
  });

  ngOnInit() {
    this.orderService.loadOrders();
  }

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  async startShipping(orderId: number) {
    await this.orderService.startShipping(orderId);
    this.selectedOrder.set(null);
  }

  async markAsDelivered(orderId: number) {
    if (confirm('Xác nhận giao hàng thành công?')) {
      await this.orderService.markAsDelivered(orderId);
      this.selectedOrder.set(null);
    }
  }

  async markAsFailed(orderId: number) {
    if (confirm('Xác nhận giao hàng thất bại?')) {
      await this.orderService.markAsFailed(orderId);
      this.selectedOrder.set(null);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
