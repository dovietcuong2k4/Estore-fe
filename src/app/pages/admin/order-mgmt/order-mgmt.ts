import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../core/models/order.model';
import { OrderTableComponent } from '../../../shared/components/order-table/order-table';
import { UserApiService } from '../../../core/services/user-api.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-order-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderTableComponent],
  templateUrl: './order-mgmt.html',
  styleUrl: './order-mgmt.scss'
})
export class OrderMgmtComponent implements OnInit {
  private orderService = inject(OrderService);
  private userApiService = inject(UserApiService);

  readonly orders = computed(() => this.orderService.allOrders());
  readonly selectedStatus = signal<OrderStatus | 'ALL'>('ALL');
  readonly selectedShipperId = signal<number | 'ALL'>('ALL');
  readonly selectedDate = signal('');
  readonly shippers = signal<User[]>([]);

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
}
