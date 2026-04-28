import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, IconComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly myOrders = computed(() => this.orderService.myOrders());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  ngOnInit() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.orderService.loadMyOrders();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'CREATED': return 'Mới đặt';
      case 'PROCESSING': return 'Đang xử lý';
      case 'READY_FOR_SHIPPING': return 'Chờ giao hàng';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'DELIVERY_FAILED': return 'Giao thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }

  async cancelOrder(orderId: number) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const result = await this.orderService.cancelOrder(orderId);
      if (!result.success) {
        alert(result.message);
      }
    }
  }

}
