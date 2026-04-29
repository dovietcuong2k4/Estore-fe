import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Order } from '../../../core/models/order.model';
import { ProductApiService } from '../../../core/services/product-api.service';
import { ProductModalComponent } from '../../../shared/components/product-modal/product-modal';
import { BaseBadgeComponent } from '../../../shared/components/ui/base-badge/base-badge';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseCardComponent } from '../../../shared/components/ui/base-card/base-card';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

interface DashboardMetric {
  key: 'created' | 'processing' | 'lowStock' | 'shipping';
  label: string;
  value: number;
  tone: 'info' | 'warning' | 'danger' | 'accent';
  trend: number;
  suffix: string;
  progress: number;
  badge?: string;
}

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, RouterLink, BaseBadgeComponent, BaseButtonComponent, BaseCardComponent, BaseTableComponent, ProductModalComponent, IconComponent],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productApi = inject(ProductApiService);
  readonly products = signal<Product[]>([]);

  isProductModalOpen = false;
  selectedProduct: Product | null = null;
  categories: { id: number; name: string; icon: string }[] = [];
  brands: { id: number; name: string; logo?: string }[] = [];

  readonly orderStats = computed(() => this.orderService.getOrderStats());
  
  readonly lowStockProducts = computed(() => {
    return this.products()
      .filter((p: Product) => p.stockQuantity < 10)
      .sort((a: Product, b: Product) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5);
  });

  readonly pendingOrders = computed(() => {
    return this.orderService.allOrders()
      .filter((o: Order) => o.status === 'CREATED' || o.status === 'PROCESSING')
      .slice(0, 5);
  });

  readonly dashboardMetrics = computed<DashboardMetric[]>(() => {
    const stats = this.orderStats();
    const lowStockCount = this.lowStockProducts().length;
    const flowTotal = Math.max(1, stats.created + stats.processing + stats.shipping);

    return [
      {
        key: 'created',
        label: 'Đơn mới',
        value: stats.created,
        tone: 'info',
        trend: this.trendValue(stats.created, stats.processing),
        suffix: '/ca',
        progress: this.toPercent(stats.created, flowTotal)
      },
      {
        key: 'processing',
        label: 'Đang xử lý',
        value: stats.processing,
        tone: 'warning',
        trend: this.trendValue(stats.processing, stats.created),
        suffix: '%',
        progress: this.toPercent(stats.processing, flowTotal)
      },
      {
        key: 'lowStock',
        label: 'Sản phẩm sắp hết',
        value: lowStockCount,
        tone: 'danger',
        trend: this.trendValue(lowStockCount, 4),
        suffix: '',
        progress: this.toPercent(lowStockCount, 10),
        badge: lowStockCount > 0 ? 'CRITICAL' : 'ỔN ĐỊNH'
      },
      {
        key: 'shipping',
        label: 'Sẵn sàng giao',
        value: stats.shipping,
        tone: 'accent',
        trend: this.trendValue(stats.shipping, stats.processing),
        suffix: '%',
        progress: this.toPercent(stats.shipping, flowTotal)
      }
    ];
  });

  ngOnInit() {
    this.loadMetadata();
    void this.refresh();
  }

  private loadMetadata(): void {
    this.productApi.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.productApi.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  refresh(): void {
    this.orderService.loadStaffOrders();
    this.productApi.getProducts('', 0, 500).subscribe(products => {
      this.products.set(products);
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  openInventoryEditModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
    this.selectedProduct = null;
  }

  saveInventoryProduct(updatedProduct: Product): void {
    if (!updatedProduct?.id) {
      return;
    }

    this.productApi.updateProduct(updatedProduct.id, updatedProduct).subscribe(() => {
      this.closeProductModal();
      this.refresh();
    });
  }

  getStatusTone(status: string): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
    switch (status) {
      case 'CREATED': return 'info';
      case 'PROCESSING': return 'warning';
      case 'READY_FOR_SHIPPING': return 'neutral';
      case 'SHIPPING': return 'info';
      case 'DELIVERED': return 'success';
      case 'DELIVERY_FAILED':
      case 'CANCELLED':
        return 'error';
      default:
        return 'neutral';
    }
  }

  private toPercent(value: number, total: number): number {
    if (total <= 0) {
      return 0;
    }

    return Math.max(6, Math.min(100, Math.round((value / total) * 100)));
  }

  private trendValue(current: number, baseline: number): number {
    if (baseline <= 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(((current - baseline) / baseline) * 100);
  }
}
