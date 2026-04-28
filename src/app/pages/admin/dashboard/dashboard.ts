import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductApiService } from '../../../core/services/product-api.service';
import { BaseCardComponent } from '../../../shared/components/ui/base-card/base-card';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { BaseBadgeComponent } from '../../../shared/components/ui/base-badge/base-badge';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseCardComponent, BaseTableComponent, BaseBadgeComponent, BaseButtonComponent, IconComponent],
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

  getStatusTone(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PROCESSING':
      case 'READY_FOR_SHIPPING':
        return 'warning';
      case 'CANCELLED':
      case 'DELIVERY_FAILED':
        return 'error';
      case 'CREATED':
      case 'SHIPPING':
        return 'info';
      default:
        return 'neutral';
    }
  }
}
