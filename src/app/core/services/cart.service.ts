import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { BaseResultDTO } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from './toast.service';

/** Matches BE CartItemResponse */
export interface CartLineDto {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  productImageUrl: string;
}

/** Matches BE CartResponse */
export interface CartResponse {
  id: number;
  userId?: number;
  totalPrice: number;
  items: CartLineDto[];
}

function productStubFromCartLine(line: CartLineDto): Product {
  return {
    id: line.productId,
    name: line.productName,
    price: line.productPrice,
    cpu: 'N/A',
    ram: 'N/A',
    screen: 'N/A',
    operatingSystem: 'N/A',
    batteryCapacity: 'N/A',
    design: 'N/A',
    warrantyInfo: 'N/A',
    description: '',
    soldQuantity: 0,
    stockQuantity: 0,
    categoryId: 0,
    brandId: 0,
    image: line.productImageUrl,
  };
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY_PREFIX = 'estore_cart_user';
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);

  private readonly cartItems = signal<CartItem[]>([]);

  constructor() {
    // Watch for user changes to reload the correct cart
    effect(() => {
      const user = this.auth.user();
      this.loadCart();
    });
  }

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
        const items: CartItem[] = (res.data.items ?? []).map(line => ({
          id: line.id,
          cartId: res.data!.id,
          productId: line.productId,
          quantity: line.quantity,
          product: productStubFromCartLine(line)
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
  async addToCart(productId: number, quantity: number = 1, product?: Product): Promise<void> {
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
        quantity,
        product: product ? { ...product } : undefined
      };
      this.cartItems.set([...current, newItem]);
    }
    this.saveToStorage();
    this.toastService.success('Đã thêm sản phẩm vào giỏ hàng');
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
    this.toastService.info('Đã cập nhật số lượng sản phẩm');
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
    this.toastService.warning('Đã xóa sản phẩm khỏi giỏ hàng');
  }

  async clearCart(): Promise<void> {
    if (this.auth.isLoggedIn()) {
      try {
        await firstValueFrom(
          this.api.delete<BaseResultDTO<void>>('/cart/clear')
        );
        this.cartItems.set([]);
        this.saveToStorage();
        this.toastService.info('Đã xóa toàn bộ giỏ hàng');
      } catch (err) {
        console.error('API clear cart failed:', err);
        this.toastService.error('Xóa giỏ hàng thất bại');
      }

      return;
    }

    // 👉 chỉ dành cho user chưa login
    this.cartItems.set([]);
    this.saveToStorage();
    this.toastService.info('Đã xóa toàn bộ giỏ hàng');
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.productId === productId);
  }

  private getStorageKey(): string {
    const userId = this.auth.user()?.id ?? -1;
    return `${this.STORAGE_KEY_PREFIX}_${userId}`;
  }

  private saveToStorage(): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.cartItems()));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
