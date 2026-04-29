import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../core/models/order.model';
import { BaseModalComponent } from '../ui/base-modal/base-modal';
import { BaseBadgeComponent } from '../ui/base-badge/base-badge';
import { BaseButtonComponent } from '../ui/base-button/base-button';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, BaseModalComponent, BaseBadgeComponent, BaseButtonComponent],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsModalComponent {
  readonly order = input<Order | null>(null);
  readonly open = input(false);
  readonly close = output<void>();

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  protected getStatusLabel(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'CREATED': return 'Mới tạo';
      case 'PROCESSING': return 'Đang xử lý';
      case 'READY_FOR_SHIPPING': return 'Chờ giao hàng';
      case 'SHIPPING': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'DELIVERY_FAILED': return 'Giao thất bại';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }

  protected getStatusTone(status?: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    if (!status) return 'neutral';
    switch (status) {
      case 'CREATED': return 'info';
      case 'PROCESSING': return 'warning';
      case 'READY_FOR_SHIPPING': return 'neutral';
      case 'SHIPPING': return 'info';
      case 'DELIVERED': return 'success';
      case 'DELIVERY_FAILED':
      case 'CANCELLED': return 'error';
      default: return 'neutral';
    }
  }

  protected getSubtotal(): number {
    const minOrder = this.order();
    if (!minOrder || !minOrder.items) return 0;
    return minOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
