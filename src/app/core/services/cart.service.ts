import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { BaseResultDTO } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MockDataService } from './mock-data.service';
import { firstValueFrom } from 'rxjs';

/** Response from GET /api/cart — assumed structure */
export interface CartItemResponse {
  id: number;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  cartItems: CartItemResponse[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'estore_cart';
  private api = inject(ApiService);
  private auth = inject(AuthService);

  // MockDataService kept but not used for cart logic anymore
  private mockData = inject(MockDataService);

  private readonly cartItems = signal<CartItem[]>(this.loadFromStorage());

  readonly items = computed(() => this.cartItems());

  readonly totalPrice = computed(() => {
    return this.cartItems().reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  });

  readonly totalItems = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly itemCount = computed(() => this.cartItems().length);

  /** Load cart from API (for logged-in users) or from localStorage */
  async loadCart(): Promise<void> {
    if (!this.auth.isLoggedIn()) {
      // Guest: load from localStorage only
      this.cartItems.set(this.loadFromStorage());
      return;
    }

    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<CartResponse>>('/cart')
      );
      if (res.success && res.data) {
        const items: CartItem[] = (res.data.cartItems ?? []).map(item => ({
          id: item.id,
          cartId: res.data.id,
          productId: item.product?.id ?? 0,
          quantity: item.quantity,
          product: item.product
        }));
        this.cartItems.set(items);
        this.saveToStorage();
      }
    } catch (err) {
      console.error('Failed to load cart from API, using localStorage fallback:', err);
      this.cartItems.set(this.loadFromStorage());
    }
  }

  /** Add item to cart */
  async addToCart(productId: number, quantity: number = 1): Promise<void> {
    if (this.auth.isLoggedIn()) {
      try {
        await firstValueFrom(
          this.api.post<BaseResultDTO<void>>('/cart/add', { productId, quantity })
        );
        await this.loadCart();
        return;
      } catch (err) {
        console.error('API add to cart failed, falling back to localStorage:', err);
      }
    }

    // Fallback: localStorage only
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

  /** Update item quantity */
  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(itemId);
      return;
    }

    if (this.auth.isLoggedIn()) {
      try {
        await firstValueFrom(
          this.api.put<BaseResultDTO<void>>(`/cart/item/${itemId}`, { quantity })
        );
        await this.loadCart();
        return;
      } catch (err) {
        console.error('API update cart failed:', err);
      }
    }

    // Fallback: localStorage
    this.cartItems.set(
      this.cartItems().map(i =>
        i.id === itemId ? { ...i, quantity } : i
      )
    );
    this.saveToStorage();
  }

  /** Remove item from cart */
  async removeFromCart(itemId: number): Promise<void> {
    if (this.auth.isLoggedIn()) {
      try {
        await firstValueFrom(
          this.api.delete<BaseResultDTO<void>>(`/cart/item/${itemId}`)
        );
        await this.loadCart();
        return;
      } catch (err) {
        console.error('API delete cart item failed:', err);
      }
    }

    // Fallback: localStorage
    this.cartItems.set(this.cartItems().filter(i => i.id !== itemId));
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
