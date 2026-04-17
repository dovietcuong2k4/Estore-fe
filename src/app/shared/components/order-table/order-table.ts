import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';
import { OrderActionEvent, OrderActionsComponent } from '../order-actions/order-actions';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule, OrderActionsComponent],
  templateUrl: './order-table.html',
  styleUrl: './order-table.scss'
})
export class OrderTableComponent {
  readonly orders = input.required<Order[]>();
  readonly role = input.required<'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_SHIPPER'>();
  readonly shippers = input<User[]>([]);
  readonly loadingAction = input<string | null>(null);
  readonly action = output<OrderActionEvent>();

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  protected forwardAction(event: OrderActionEvent): void {
    this.action.emit(event);
  }
}
