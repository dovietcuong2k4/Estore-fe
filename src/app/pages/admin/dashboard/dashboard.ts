import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductApiService } from '../../../core/services/product-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  readonly orderStats = computed(() => this.orderService.getOrderStats());
  products: Product[] = [];
  get productCount() { return this.products.length; }
  get userCount() { return this.mockData.mockUsers.length; }
  
  readonly recentOrders = computed(() => {
    return this.orderService.allOrders().slice(0, 5);
  });

  constructor(
    private orderService: OrderService,
    private mockData: MockDataService,
    private productApi: ProductApiService
  ) {
    this.productApi.getProducts('', 0, 500).subscribe(products => {
      this.products = products;
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
