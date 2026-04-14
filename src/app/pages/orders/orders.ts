import { Component, computed, inject, OnInit } from '@angular/core';
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
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  readonly myOrders = computed(() => this.orderService.myOrders());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.orderService.loadOrders();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'CREATED': return 'Mới đặt';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PREPARING': return 'Đang chuẩn bị';
      case 'READY_FOR_SHIPPING': return 'Sẵn sàng giao';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao';
      case 'DELIVERY_FAILED': return 'Giao thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
