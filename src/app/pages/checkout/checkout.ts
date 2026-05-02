import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { VoucherService } from '../../core/services/voucher.service';
import { CreateOrderRequest } from '../../core/models/order.model';
import { UserVoucher } from '../../core/models/voucher.model';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private voucherService = inject(VoucherService);
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

  userVouchers = signal<UserVoucher[]>([]);
  selectedVoucher = signal<UserVoucher | null>(null);
  /** Server-validated discount for the current selection (aligned with checkout preview API). */
  previewDiscount = signal<number | null>(null);

  readonly discountAmount = computed(() => {
    const sel = this.selectedVoucher();
    const p = this.previewDiscount();
    if (!sel || p === null) {
      return 0;
    }
    return Math.max(0, p);
  });

  readonly finalTotalPrice = computed(() => this.totalPrice() - this.discountAmount());

  error = signal('');
  success = signal(false);
  successBoxData = signal<{ id: number } | null>(null);
  loading = signal(false);

  constructor() {
    const u = this.auth.user();
    if (u) {
      this.form.receiverName = u.fullName || '';
      this.form.receiverPhone = u.phone || '';
      this.form.receiverAddress = u.address || '';
      this.loadVouchers();
    }

    effect(() => {
      const total = this.totalPrice();
      const sel = this.selectedVoucher();
      if (!sel) {
        untracked(() => this.previewDiscount.set(null));
        return;
      }
      untracked(async () => {
        const res = await this.voucherService.preview(sel.id, total);
        if (res.eligible) {
          this.previewDiscount.set(res.discountAmount);
        } else {
          this.previewDiscount.set(0);
        }
      });
    });
  }

  async loadVouchers() {
    const vouchers = await this.voucherService.getMyVouchers();
    this.userVouchers.set(vouchers);
  }

  /**
   * Client-side eligibility for disabling rows (backend still validates on place order).
   */
  voucherDisabledReason(uv: UserVoucher): string | null {
    if (uv.status === 'USED') {
      return 'Đã sử dụng';
    }
    if (uv.status === 'EXPIRED') {
      return 'Hết hạn';
    }
    if (uv.voucher.active === false) {
      return 'Voucher không hoạt động';
    }
    const now = Date.now();
    if (new Date(uv.voucher.startDate).getTime() > now) {
      return 'Chưa có hiệu lực';
    }
    if (new Date(uv.voucher.endDate).getTime() < now) {
      return 'Hết hạn';
    }
    if (this.totalPrice() < uv.voucher.minOrderValue) {
      return `Đơn tối thiểu ${this.formatPrice(uv.voucher.minOrderValue)}`;
    }
    return null;
  }

  selectVoucher(uv: UserVoucher) {
    const reason = this.voucherDisabledReason(uv);
    if (reason) {
      return;
    }
    if (this.selectedVoucher()?.id === uv.id) {
      this.selectedVoucher.set(null);
    } else {
      this.selectedVoucher.set(uv);
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
      userVoucherId: this.selectedVoucher()?.id,
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
