import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../core/models/order.model';
import { OrderTableComponent } from '../../../shared/components/order-table/order-table';
import { UserApiService } from '../../../core/services/user-api.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { OrderActionEvent } from '../../../shared/components/order-actions/order-actions';
import { ToastService } from '../../../core/services/toast.service';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseSelectComponent } from '../../../shared/components/ui/base-select/base-select';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';

@Component({
  selector: 'app-order-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderTableComponent, FilterBarComponent, BaseSelectComponent, BaseInputComponent, BaseTableComponent],
  templateUrl: './order-mgmt.html',
  styleUrls: ['../dashboard/dashboard.scss', './order-mgmt.scss']
})
export class OrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);
  private userApiService = inject(UserApiService);
  private toastService = inject(ToastService);

  readonly orders = computed(() => this.orderService.allOrders());
  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly selectedShipperId = signal<number | 'ALL'>('ALL');
  readonly selectedDate = signal('');
  readonly shippers = signal<User[]>([]);
  readonly loadingAction = signal<string | null>(null);

  readonly statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Mới tạo', value: 'CREATED' },
    { label: 'Đang xử lý', value: 'PROCESSING' },
    { label: 'Sẵn sàng giao', value: 'READY_FOR_SHIPPING' },
    { label: 'Đang giao', value: 'SHIPPING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Giao thất bại', value: 'DELIVERY_FAILED' },
    { label: 'Đã hủy', value: 'CANCELLED' }
  ];

  readonly shipperOptions = computed(() => [
    { label: 'Tất cả nhân viên giao hàng', value: 'ALL' as const },
    ...this.shippers().map(shipper => ({ label: shipper.fullName, value: shipper.id }))
  ]);

  async ngOnInit() {
    await Promise.all([
      this.reload(),
      this.loadShippers()
    ]);
  }

  async reload(): Promise<void> {
    await this.orderService.loadAdminOrders({
      status: this.selectedStatus() === 'ALL' ? undefined : this.selectedStatus(),
      shipperId: this.selectedShipperId() === 'ALL' ? null : Number(this.selectedShipperId()),
      date: this.selectedDate() || undefined
    });
  }

  private async loadShippers(): Promise<void> {
    try {
      const users = await firstValueFrom(this.userApiService.getUsers());
      this.shippers.set(users.filter(user => user.roles.some(role => role.name === 'ROLE_SHIPPER')));
    } catch {
      this.shippers.set([]);
    }
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
        case 'cancel':
          result = await this.orderService.cancelOrder(event.orderId);
          break;
        case 'retry':
          result = await this.orderService.retryShipping(event.orderId);
          break;
        case 'assign-shipper':
          result = await this.orderService.assignShipper(event.orderId, event.shipperId!);
          break;
      }

      if (result.success) {
        this.toastService.success(result.message || 'Cập nhật trạng thái đơn hàng thành công');
        await this.reload();
      } else {
        this.toastService.error(result.message || 'Cập nhật trạng thái đơn hàng thất bại');
      }
    } finally {
      this.loadingAction.set(null);
    }
  }

  async onStatusChanged(value: string | number): Promise<void> {
    this.selectedStatus.set(value as OrderStatus | 'ALL');
    await this.reload();
  }

  async onShipperChanged(value: string | number): Promise<void> {
    this.selectedShipperId.set(value === 'ALL' ? 'ALL' : Number(value));
    await this.reload();
  }

  async onDateChanged(value: string): Promise<void> {
    this.selectedDate.set(value);
    await this.reload();
  }
}
