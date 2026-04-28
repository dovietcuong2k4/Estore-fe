import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  readonly items = computed(() => this.cartService.items());
  readonly totalPrice = computed(() => this.cartService.totalPrice());
  readonly isEmpty = computed(() => this.items().length === 0);

  constructor(private cartService: CartService) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  updateQty(cartLineId: number, qty: number) {
    this.cartService.updateQuantity(cartLineId, qty);
  }

  remove(cartLineId: number) {
    this.cartService.removeFromCart(cartLineId);
  }

  async clearAll() {
    await this.cartService.clearCart();
  }

  increment(cartLineId: number, currentQty: number) {
    this.cartService.updateQuantity(cartLineId, currentQty + 1);
  }

  decrement(cartLineId: number, currentQty: number) {
    if (currentQty > 1) this.cartService.updateQuantity(cartLineId, currentQty - 1);
  }
}
