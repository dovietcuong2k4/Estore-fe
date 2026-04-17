import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderActionEvent } from '../../../shared/components/order-actions/order-actions';
import { OrderActionsComponent } from '../../../shared/components/order-actions/order-actions';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-shipper-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderActionsComponent],
  templateUrl: './shipper-orders.html',
  styleUrl: './shipper-orders.scss'
})
export class ShipperOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  readonly assignedOrders = computed(() => this.orderService.shipperOrders());
  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly loadingAction = signal<string | null>(null);

  readonly filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.assignedOrders();
    return this.assignedOrders().filter((o: Order) => o.status === status);
  });

  async ngOnInit() {
    await this.orderService.loadShipperOrders();
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
        this.toastService.success(result.message);
        await this.orderService.loadShipperOrders();
      } else {
        this.toastService.error(result.message);
      }
    } finally {
      this.loadingAction.set(null);
    }
  }
}
