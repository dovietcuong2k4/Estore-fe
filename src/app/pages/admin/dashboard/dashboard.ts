import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  readonly orderStats = computed(() => this.orderService.getOrderStats());
  get productCount() { return this.mockData.products.length; }
  get userCount() { return this.mockData.mockUsers.length; }
  
  readonly recentOrders = computed(() => {
    return this.orderService.allOrders().slice(0, 5);
  });

  constructor(
    private orderService: OrderService,
    private mockData: MockDataService
  ) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
