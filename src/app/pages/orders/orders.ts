import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent {
  readonly myOrders = computed(() => this.orderService.myOrders());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  constructor(
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'CREATED': return 'Mới đặt';
      case 'PENDING': return 'Đang xử lý';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
