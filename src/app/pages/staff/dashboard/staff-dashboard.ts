import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.scss'
})
export class StaffDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private mockData = inject(MockDataService);

  readonly orderStats = computed(() => this.orderService.getOrderStats());
  
  readonly lowStockProducts = computed(() => {
    return this.mockData.products
      .filter((p: Product) => p.stockQuantity < 10)
      .sort((a: Product, b: Product) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5);
  });

  readonly pendingOrders = computed(() => {
    return this.orderService.allOrders()
      .filter((o: Order) => o.status === 'CREATED' || o.status === 'CONFIRMED' || o.status === 'PREPARING')
      .slice(0, 5);
  });

  ngOnInit() {
    this.orderService.loadOrders();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
