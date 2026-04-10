import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-mgmt.html',
  styleUrl: '../dashboard/dashboard.scss'
})
export class OrderMgmtComponent {
  orders = computed(() => this.orderService.allOrders());

  constructor(private orderService: OrderService) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }

  updateStatus(orderId: number, status: any) {
    this.orderService.updateOrderStatus(orderId, status);
  }
}
