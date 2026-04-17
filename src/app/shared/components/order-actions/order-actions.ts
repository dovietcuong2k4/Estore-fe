import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';

export type OrderActionType =
  | 'process'
  | 'ready'
  | 'assign-shipper'
  | 'cancel'
  | 'retry'
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

    if (role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') {
      const hasShipper = !!order.shipperId;
      const canEdit = !hasShipper || order.status === 'DELIVERY_FAILED';

      const buttons = [];
      if (canEdit && order.status === 'CREATED') buttons.push(this.button('process', 'Xử lý đơn', true));
      if (canEdit && order.status === 'PROCESSING') buttons.push(this.button('ready', 'Sẵn sàng giao', true));
      if (canEdit && ['CREATED', 'PROCESSING'].includes(order.status)) buttons.push(this.button('cancel', 'Hủy đơn', true));
      
      if (!hasShipper && order.status === 'READY_FOR_SHIPPING') {
        buttons.push(this.button('assign-shipper', 'Phân công shipper', true));
      }
      
      if (order.status === 'DELIVERY_FAILED') {
        buttons.push(this.button('assign-shipper', 'Giao lại', true));
      }

      return buttons;
    }

    if (role === 'ROLE_SHIPPER') {
      return [
        this.button('start', 'Nhận giao', order.status === 'READY_FOR_SHIPPING'),
        this.button('deliver', 'Giao thành công', order.status === 'SHIPPING'),
        this.button('fail', 'Giao thất bại', order.status === 'SHIPPING')
      ];
    }

    return [];
  });

  protected openModal(type: OrderActionType): void {
    if (type === 'assign-shipper' && this.order().status === 'DELIVERY_FAILED') {
      this.selectedShipperId.set(null);
    } else {
      this.selectedShipperId.set(this.order().shipperId ?? this.shippers()[0]?.id ?? null);
    }
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
      case 'process': return 'Chuyển sang xử lý';
      case 'ready': return 'Đánh dấu sẵn sàng giao';
      case 'assign-shipper': return 'Phân công shipper';
      case 'cancel': return 'Hủy đơn hàng';
      case 'retry': return 'Đưa về sẵn sàng giao';
      case 'start': return 'Nhận đơn giao';
      case 'deliver': return 'Xác nhận giao thành công';
      case 'fail': return 'Xác nhận giao thất bại';
      default: return 'Xác nhận thao tác';
    }
  }

  protected modalMessage(type: OrderActionType | null): string {
    switch (type) {
      case 'process': return 'Đơn hàng sẽ được chuyển sang trạng thái PROCESSING.';
      case 'ready': return 'Đơn hàng sẽ được chuyển sang trạng thái READY_FOR_SHIPPING.';
      case 'assign-shipper': return 'Chọn shipper để phân công đơn hàng này.';
      case 'cancel': return 'Chỉ nên hủy đơn khi đơn chưa đi vào quá trình giao hàng.';
      case 'retry': return 'Đơn hàng sẽ được chuyển về trạng thái READY_FOR_SHIPPING để giao lại.';
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
