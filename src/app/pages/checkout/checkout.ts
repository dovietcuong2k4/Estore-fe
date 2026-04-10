import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { CreateOrderRequest } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  readonly items = computed(() => this.cart.items());
  readonly totalPrice = computed(() => this.cart.totalPrice());
  readonly user = computed(() => this.auth.user());

  form = {
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    note: ''
  };

  error = signal('');
  success = signal(false);
  orderId = signal(0);

  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {
    const u = this.auth.user();
    if (u) {
      this.form.receiverName = u.fullName;
      this.form.receiverPhone = u.phone;
      this.form.receiverAddress = u.address;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  placeOrder() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.form.receiverName || !this.form.receiverPhone || !this.form.receiverAddress) {
      this.error.set('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    if (this.items().length === 0) {
      this.error.set('Giỏ hàng trống');
      return;
    }

    const request: CreateOrderRequest = {
      receiverName: this.form.receiverName,
      receiverPhone: this.form.receiverPhone,
      receiverAddress: this.form.receiverAddress,
      note: this.form.note
    };

    const order = this.orderService.createOrder(request);
    if (order) {
      this.success.set(true);
      this.orderId.set(order.id);
      this.error.set('');
    } else {
      this.error.set('Đặt hàng thất bại. Vui lòng thử lại.');
    }
  }
}
