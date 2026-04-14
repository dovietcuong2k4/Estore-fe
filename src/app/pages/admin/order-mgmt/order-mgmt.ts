import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-mgmt.html',
  styleUrl: '../dashboard/dashboard.scss'
})
export class OrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = computed(() => this.orderService.allOrders());

  ngOnInit() {
    this.orderService.loadOrders();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }

  async confirmOrder(orderId: number) {
    await this.orderService.adminConfirmOrder(orderId);
  }

  async cancelOrder(orderId: number) {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      await this.orderService.cancelOrder(orderId);
    }
  }
}
