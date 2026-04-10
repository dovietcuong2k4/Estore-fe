import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
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

  updateQty(productId: number, qty: number) {
    this.cartService.updateQuantity(productId, qty);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearAll() {
    this.cartService.clearCart();
  }

  increment(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrement(productId: number, currentQty: number) {
    if (currentQty > 1) this.cartService.updateQuantity(productId, currentQty - 1);
  }
}
