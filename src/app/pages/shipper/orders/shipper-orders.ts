import { Component, computed, inject, signal } from '@angular/core';
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
export class ShipperOrdersComponent {
  private orderService = inject(OrderService);

  readonly assignedOrders = computed(() => this.orderService.shipperOrders());
  
  selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  selectedOrder = signal<Order | null>(null);

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.assignedOrders();
    return this.assignedOrders().filter((o: Order) => o.status === status);
  });

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  markAsDelivered(orderId: number) {
    if (confirm('Xác nhận giao hàng thành công?')) {
      this.orderService.markAsDelivered(orderId);
      this.selectedOrder.set(null);
    }
  }

  markAsFailed(orderId: number) {
    if (confirm('Xác nhận giao hàng thất bại?')) {
      this.orderService.markAsFailed(orderId);
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
