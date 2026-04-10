import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { MockDataService } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'estore_cart';
  private readonly cartItems = signal<CartItem[]>(this.loadFromStorage());

  readonly items = computed(() => {
    return this.cartItems().map(item => ({
      ...item,
      product: this.mockData.getProductById(item.productId)
    }));
  });

  readonly totalPrice = computed(() => {
    return this.items().reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  });

  readonly totalItems = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly itemCount = computed(() => this.cartItems().length);

  constructor(private mockData: MockDataService) {}

  addToCart(productId: number, quantity: number = 1): void {
    const current = this.cartItems();
    const existing = current.find(i => i.productId === productId);

    if (existing) {
      this.cartItems.set(
        current.map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        cartId: 1,
        productId,
        quantity
      };
      this.cartItems.set([...current, newItem]);
    }
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.set(
      this.cartItems().map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
    this.saveToStorage();
  }

  removeFromCart(productId: number): void {
    this.cartItems.set(this.cartItems().filter(i => i.productId !== productId));
    this.saveToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveToStorage();
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.productId === productId);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
