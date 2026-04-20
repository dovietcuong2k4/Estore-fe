import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderActionEvent, OrderActionType } from '../../../shared/components/order-actions/order-actions';
import { ToastService } from '../../../core/services/toast.service';
import { BaseCardComponent } from '../../../shared/components/ui/base-card/base-card';
import { BaseBadgeComponent } from '../../../shared/components/ui/base-badge/base-badge';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseSelectComponent } from '../../../shared/components/ui/base-select/base-select';

type ShipperAction = {
  type: Extract<OrderActionType, 'start' | 'deliver' | 'fail'>;
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
};

@Component({
  selector: 'app-shipper-orders',
  standalone: true,
  imports: [CommonModule, BaseCardComponent, BaseBadgeComponent, BaseButtonComponent, BaseInputComponent, BaseSelectComponent],
  templateUrl: './shipper-orders.html',
  styleUrl: './shipper-orders.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipperOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  readonly assignedOrders = computed(() => this.orderService.shipperOrders());
  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly searchKeyword = signal('');
  readonly loadingAction = signal<string | null>(null);

  readonly statusOptions: Array<{ label: string; value: OrderStatus | 'ALL' }> = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Chờ lấy hàng', value: 'READY_FOR_SHIPPING' },
    { label: 'Đang giao', value: 'SHIPPING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Thất bại', value: 'DELIVERY_FAILED' }
  ];

  readonly filteredOrders = computed(() => {
    const status = this.selectedStatus();
    const keyword = this.searchKeyword().trim().toLowerCase();
    const orders = status === 'ALL'
      ? this.assignedOrders()
      : this.assignedOrders().filter((order: Order) => order.status === status);

    if (!keyword) return orders;

    return orders.filter((order: Order) => {
      const composedSearch = [
        order.id.toString(),
        order.receiverName,
        order.receiverPhone,
        order.receiverAddress
      ].join(' ').toLowerCase();

      return composedSearch.includes(keyword);
    });
  });

  readonly resultCount = computed(() => this.filteredOrders().length);

  async ngOnInit() {
    await this.orderService.loadShipperOrders();
  }

  setStatus(value: string | number): void {
    if (typeof value !== 'string') {
      return;
    }
    this.selectedStatus.set(value as OrderStatus | 'ALL');
  }

  updateSearch(value: string): void {
    this.searchKeyword.set(value);
  }

  countByStatus(status: OrderStatus | 'ALL'): number {
    if (status === 'ALL') return this.assignedOrders().length;
    return this.assignedOrders().filter((order: Order) => order.status === status).length;
  }

  resetFilters(): void {
    this.selectedStatus.set('ALL');
    this.searchKeyword.set('');
  }

  statusLabel(status: OrderStatus): string {
    switch (status) {
      case 'READY_FOR_SHIPPING':
        return 'Chờ lấy hàng';
      case 'SHIPPING':
        return 'Đang giao';
      case 'DELIVERED':
        return 'Đã giao';
      case 'DELIVERY_FAILED':
        return 'Giao thất bại';
      case 'CREATED':
        return 'Mới tạo';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  statusTone(status: OrderStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'DELIVERY_FAILED':
      case 'CANCELLED':
        return 'error';
      case 'SHIPPING':
        return 'info';
      case 'READY_FOR_SHIPPING':
        return 'warning';
      default:
        return 'neutral';
    }
  }

  formatDate(value: string): string {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  shipperActions(order: Order): ShipperAction[] {
    if (order.status === 'READY_FOR_SHIPPING') {
      return [{ type: 'start', label: 'Xác nhận lấy hàng', variant: 'primary' }];
    }

    if (order.status === 'SHIPPING') {
      return [
        { type: 'deliver', label: 'Đã giao thành công', variant: 'primary' },
        { type: 'fail', label: 'Giao thất bại', variant: 'danger' }
      ];
    }

    return [];
  }

  isActionLoading(orderId: number, type: Extract<OrderActionType, 'start' | 'deliver' | 'fail'>): boolean {
    return this.loadingAction() === `${type}-${orderId}`;
  }

  isOrderActionBusy(orderId: number): boolean {
    const loadingAction = this.loadingAction();
    return loadingAction ? loadingAction.endsWith(`-${orderId}`) : false;
  }

  triggerAction(orderId: number, type: Extract<OrderActionType, 'start' | 'deliver' | 'fail'>): void {
    void this.handleAction({ type, orderId });
  }

  async handleAction(event: OrderActionEvent): Promise<void> {
    this.loadingAction.set(`${event.type}-${event.orderId}`);
    try {
      let result = { success: false, message: 'Thao tác không hợp lệ' };

      switch (event.type) {
        case 'start':
          result = await this.orderService.startShipping(event.orderId);
          break;
        case 'deliver':
          result = await this.orderService.markAsDelivered(event.orderId);
          break;
        case 'fail':
          result = await this.orderService.markAsFailed(event.orderId);
          break;
      }

      if (result.success) {
        this.toastService.success(result.message || 'Cập nhật trạng thái đơn hàng thành công');
        await this.orderService.loadShipperOrders();
      } else {
        this.toastService.error(result.message || 'Cập nhật trạng thái đơn hàng thất bại');
      }
    } finally {
      this.loadingAction.set(null);
    }
  }
}
