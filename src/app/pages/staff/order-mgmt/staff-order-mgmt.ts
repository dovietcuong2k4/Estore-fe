import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderActionEvent } from '../../../shared/components/order-actions/order-actions';
import { OrderTableComponent } from '../../../shared/components/order-table/order-table';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-staff-order-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderTableComponent],
  templateUrl: './staff-order-mgmt.html',
  styleUrl: './staff-order-mgmt.scss'
})
export class StaffOrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  readonly orders = computed(() => this.orderService.allOrders());
  readonly shippers = computed(() => this.orderService.shippers());

  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly loadingAction = signal<string | null>(null);

  readonly filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.orders();
    return this.orders().filter((o: Order) => o.status === status);
  });

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
}
