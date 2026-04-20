import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderActionEvent } from '../../../shared/components/order-actions/order-actions';
import { OrderTableComponent } from '../../../shared/components/order-table/order-table';
import { ToastService } from '../../../core/services/toast.service';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseSelectComponent } from '../../../shared/components/ui/base-select/base-select';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';

@Component({
  selector: 'app-staff-order-mgmt',
  imports: [CommonModule, FormsModule, OrderTableComponent, BaseButtonComponent, BaseInputComponent, BaseSelectComponent, FilterBarComponent, BaseTableComponent],
  templateUrl: './staff-order-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', './staff-order-mgmt.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffOrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  readonly orders = computed(() => this.orderService.allOrders());
  readonly shippers = computed(() => this.orderService.shippers());

  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly selectedDate = signal('');
  readonly selectedShipperId = signal<number | 'ALL'>('ALL');
  readonly loadingAction = signal<string | null>(null);

  readonly statusOptions = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Mới tạo', value: 'CREATED' },
    { label: 'Đang xử lý', value: 'PROCESSING' },
    { label: 'Chờ giao hàng', value: 'READY_FOR_SHIPPING' },
    { label: 'Đang giao', value: 'SHIPPING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Giao thất bại', value: 'DELIVERY_FAILED' },
    { label: 'Đã hủy', value: 'CANCELLED' }
  ];

  readonly filteredOrders = computed(() => {
    const status = this.selectedStatus();
    const selectedDate = this.selectedDate();
    const shipperId = this.selectedShipperId();

    return this.orders().filter((order: Order) => {
      const matchesStatus = status === 'ALL' || order.status === status;
      const matchesDate = !selectedDate || this.toDateOnly(order.orderDate) === selectedDate;
      const matchesShipper = shipperId === 'ALL' || order.shipperId === shipperId;
      return matchesStatus && matchesDate && matchesShipper;
    });
  });

  readonly orderCount = computed(() => this.filteredOrders().length);

  readonly shipperOptions = computed(() => [
    { label: 'Tất cả nhân viên giao hàng', value: 'ALL' as const },
    ...this.shippers().map(shipper => ({ label: shipper.fullName, value: shipper.id }))
  ]);

  setStatus(value: string | number): void {
    if (typeof value !== 'string') {
      return;
    }
    this.selectedStatus.set(value as OrderStatus | 'ALL');
  }

  setDate(value: string): void {
    this.selectedDate.set(value);
  }

  setShipper(value: string | number): void {
    this.selectedShipperId.set(value === 'ALL' ? 'ALL' : Number(value));
  }

  resetFilters(): void {
    this.selectedStatus.set('ALL');
    this.selectedDate.set('');
    this.selectedShipperId.set('ALL');
  }

  async ngOnInit() {
    await Promise.all([
      this.orderService.loadStaffOrders(),
      this.orderService.loadStaffShippers()
    ]);
  }

  async handleAction(event: OrderActionEvent): Promise<void> {
    this.loadingAction.set(`${event.type}-${event.orderId}`);
    try {
      let result = { success: false, message: 'Thao tác không hợp lệ' };

      switch (event.type) {
        case 'process':
          result = await this.orderService.processOrder(event.orderId);
          break;
        case 'ready':
          result = await this.orderService.readyForShipping(event.orderId);
          break;
        case 'assign-shipper':
          result = await this.orderService.assignShipper(event.orderId, event.shipperId!);
          break;
        case 'cancel':
          result = await this.orderService.cancelOrder(event.orderId);
          break;
        case 'retry':
          result = await this.orderService.retryShipping(event.orderId);
          break;
      }

      if (result.success) {
        this.toastService.success(result.message || 'Cập nhật trạng thái đơn hàng thành công');
        await this.orderService.loadStaffOrders();
      } else {
        this.toastService.error(result.message || 'Cập nhật trạng thái đơn hàng thất bại');
      }
    } finally {
      this.loadingAction.set(null);
    }
  }

  private toDateOnly(value: string): string {
    if (!value) {
      return '';
    }
    return value.includes('T') ? value.slice(0, 10) : value;
  }
}
