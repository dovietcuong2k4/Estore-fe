import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(
    private cartService: CartService,
    private mockData: MockDataService
  ) {}

  get brand() {
    return this.mockData.getBrandById(this.product.brandId)?.name ?? '';
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
    this.cartService.addToCart(this.product.id);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }
}
