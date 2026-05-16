import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { VnpayPaymentResultResponse } from '../../core/models/order.model';

@Component({
  selector: 'app-vnpay-return',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vnpay-return.html',
  styleUrl: './vnpay-return.scss'
})
export class VnpayReturnComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private cart = inject(CartService);

  readonly loading = signal(true);
  readonly message = signal('Đang xác minh thanh toán VNPAY...');
  readonly result = signal<VnpayPaymentResultResponse | null>(null);

  readonly paid = computed(() => this.result()?.paid === true);

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.queryParamMap.keys.reduce<Record<string, string>>((acc, key) => {
      const value = this.route.snapshot.queryParamMap.get(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await this.orderService.verifyVnpayReturn(params);
    this.loading.set(false);

    if (!response.success || !response.data) {
      this.message.set(response.message || 'Xác minh thanh toán VNPAY thất bại');
      return;
    }

    this.result.set(response.data);
    this.message.set(response.data.message || response.message);
    if (response.data.paid) {
      await this.cart.loadCart();
    }
  }

  formatPrice(price?: number): string {
    return new Intl.NumberFormat('vi-VN').format(price ?? 0) + 'd';
  }
}
