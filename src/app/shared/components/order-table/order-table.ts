import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';
import { OrderActionEvent, OrderActionsComponent } from '../order-actions/order-actions';
import { BaseBadgeComponent } from '../ui/base-badge/base-badge';
import { OrderDetailsModalComponent } from '../order-details-modal/order-details-modal';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule, OrderActionsComponent, BaseBadgeComponent, OrderDetailsModalComponent],
  templateUrl: './order-table.html',
  styleUrl: './order-table.scss'
})
export class OrderTableComponent {
  readonly orders = input.required<Order[]>();
  readonly role = input.required<'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_SHIPPER'>();
  readonly shippers = input<User[]>([]);
  readonly loadingAction = input<string | null>(null);
  readonly action = output<OrderActionEvent>();

  readonly selectedOrder = signal<Order | null>(null);
  readonly isModalOpen = signal(false);

  protected openDetails(order: Order): void {
    this.selectedOrder.set(order);
    this.isModalOpen.set(true);
  }

  protected closeDetails(): void {
    this.isModalOpen.set(false);
    this.selectedOrder.set(null);
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  protected forwardAction(event: OrderActionEvent): void {
    this.action.emit(event);
  }

  protected getStatusLabel(status: string): string {
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

  protected getStatusTone(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
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
}
