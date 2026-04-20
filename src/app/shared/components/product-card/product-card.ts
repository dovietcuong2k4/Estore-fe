import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() variant: 'default' | 'featured' | 'compact' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() highlight: boolean = false;

  constructor(private cartService: CartService) {}

  get brand() {
    return this.product.brandName ?? '';
  }

  get discount() {
    if (!this.product.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  get ratingStars(): string {
    const rating = this.product.rating ?? 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product.id, 1, this.product);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }
}
