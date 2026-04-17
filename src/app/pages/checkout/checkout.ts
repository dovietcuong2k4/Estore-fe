import { Component, computed, inject, signal } from '@angular/core';
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
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

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
  successBoxData = signal<{id: number} | null>(null);
  loading = signal(false);

  constructor() {
    const u = this.auth.user();
    if (u) {
      this.form.receiverName = u.fullName || '';
      this.form.receiverPhone = u.phone || '';
      this.form.receiverAddress = u.address || '';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  async placeOrder() {
    if (!this.user()) {
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
      note: this.form.note,
      items: this.items().map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.loading.set(true);
    this.error.set('');

    const result = await this.orderService.createOrder(request);
    
    this.loading.set(false);

    if (result.success) {
      this.success.set(true);
      this.successBoxData.set({ id: result.orderId! });
      await this.cart.clearCart();
    } else {
      this.error.set(result.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    }
  }
}
