import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = signal(1);
  activeTab = signal<'specs' | 'desc' | 'warranty'>('specs');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockData: MockDataService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.product = this.mockData.getProductById(id) ?? null;
      if (!this.product) {
        this.router.navigate(['/products']);
        return;
      }
      this.relatedProducts = this.mockData.getProductsByCategory(this.product.categoryId)
        .filter(p => p.id !== id).slice(0, 4);
      this.quantity.set(1);
    });
  }

  get brand() { return this.mockData.getBrandById(this.product?.brandId ?? 0)?.name ?? ''; }
  get category() { return this.mockData.getCategoryById(this.product?.categoryId ?? 0)?.name ?? ''; }

  get discount() {
    if (!this.product?.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  get ratingStars(): string {
    const r = this.product?.rating ?? 0;
    return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.floor(r) - (r % 1 >= 0.5 ? 1 : 0));
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  incrementQty() { this.quantity.set(Math.min(this.quantity() + 1, this.product?.stockQuantity ?? 99)); }
  decrementQty() { this.quantity.set(Math.max(this.quantity() - 1, 1)); }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity());
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  isInCart(): boolean {
    return this.product ? this.cartService.isInCart(this.product.id) : false;
  }
}
