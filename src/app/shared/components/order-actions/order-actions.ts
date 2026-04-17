import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';

export type OrderActionType =
  | 'confirm'
  | 'prepare'
  | 'ready'
  | 'assign-shipper'
  | 'cancel'
  | 'start'
  | 'deliver'
  | 'fail';

export interface OrderActionEvent {
  type: OrderActionType;
  orderId: number;
  shipperId?: number;
}

@Component({
  selector: 'app-order-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-actions.html',
  styleUrl: './order-actions.scss'
})
export class OrderActionsComponent {
  readonly order = input.required<Order>();
  readonly role = input.required<'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_SHIPPER'>();
  readonly shippers = input<User[]>([]);
  readonly loadingAction = input<string | null>(null);
  readonly action = output<OrderActionEvent>();

  protected readonly modalAction = signal<OrderActionType | null>(null);
  protected readonly selectedShipperId = signal<number | null>(null);

  protected readonly buttons = computed(() => {
    const order = this.order();
    const role = this.role();

    if (role === 'ROLE_STAFF') {
      return [
        this.button('confirm', 'Xác nhận', order.status === 'PENDING'),
        this.button('prepare', 'Chuẩn bị', order.status === 'CONFIRMED'),
        this.button('ready', 'Sẵn sàng giao', order.status === 'PREPARING'),
        this.button('assign-shipper', 'Phân công shipper', order.status === 'READY_FOR_SHIPPING'),
        this.button('cancel', 'Hủy đơn', ['CREATED', 'PENDING', 'CONFIRMED'].includes(order.status))
      ];
    }

    if (role === 'ROLE_SHIPPER') {
      return [
        this.button('start', 'Nhận đơn', order.status === 'READY_FOR_SHIPPING'),
        this.button('deliver', 'Giao thành công', order.status === 'SHIPPING'),
        this.button('fail', 'Giao thất bại', order.status === 'SHIPPING')
      ];
    }

    return [];
  });

  protected openModal(type: OrderActionType): void {
    this.selectedShipperId.set(this.order().shipperId ?? this.shippers()[0]?.id ?? null);
    this.modalAction.set(type);
  }

  protected closeModal(): void {
    this.modalAction.set(null);
  }

  protected submitAction(): void {
    const actionType = this.modalAction();
    const order = this.order();
    if (!actionType) return;

    if (actionType === 'assign-shipper') {
      const shipperId = this.selectedShipperId();
      if (!shipperId) return;
      this.action.emit({ type: actionType, orderId: order.id, shipperId });
      this.closeModal();
      return;
    }

    this.action.emit({ type: actionType, orderId: order.id });
    this.closeModal();
  }

  protected isLoading(type: OrderActionType): boolean {
    return this.loadingAction() === `${type}-${this.order().id}`;
  }

  protected modalTitle(type: OrderActionType | null): string {
    switch (type) {
      case 'confirm': return 'Xác nhận đơn hàng';
      case 'prepare': return 'Chuyển sang chuẩn bị';
      case 'ready': return 'Đánh dấu sẵn sàng giao';
      case 'assign-shipper': return 'Phân công shipper';
      case 'cancel': return 'Hủy đơn hàng';
      case 'start': return 'Nhận đơn giao';
      case 'deliver': return 'Xác nhận giao thành công';
      case 'fail': return 'Xác nhận giao thất bại';
      default: return 'Xác nhận thao tác';
    }
  }

  protected modalMessage(type: OrderActionType | null): string {
    switch (type) {
      case 'confirm': return 'Đơn hàng sẽ được chuyển sang trạng thái CONFIRMED.';
      case 'prepare': return 'Đơn hàng sẽ được chuyển sang trạng thái PREPARING.';
      case 'ready': return 'Đơn hàng sẽ được chuyển sang trạng thái READY_FOR_SHIPPING.';
      case 'assign-shipper': return 'Chọn shipper để phân công đơn hàng này.';
      case 'cancel': return 'Chỉ nên hủy đơn khi đơn chưa đi vào quá trình giao hàng.';
      case 'start': return 'Thao tác này sẽ bắt đầu quá trình giao hàng.';
      case 'deliver': return 'Xác nhận người nhận đã nhận được hàng.';
      case 'fail': return 'Đánh dấu đơn giao không thành công.';
      default: return '';
    }
  }

  private button(type: OrderActionType, label: string, enabled: boolean) {
    return { type, label, enabled };
  }
}
