import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductApiService } from '../../core/services/product-api.service';
import { forkJoin } from 'rxjs';

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
  activeImage = signal<string>('');
  activeTab = signal<'specs' | 'desc' | 'warranty'>('specs');
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productApi: ProductApiService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];

      this.loading = true;

      forkJoin({
        product: this.productApi.getProductById(id),
        products: this.productApi.getProducts('', 0, 200)
      }).subscribe(({ product, products }) => {
        if (!product) {
          this.router.navigate(['/products']);
          return;
        }

        this.product = product;

        this.relatedProducts = products
          .filter(p => p.categoryName === product.categoryName && p.id !== product.id)
          .slice(0, 4);

        this.activeImage.set(product.image || product.images?.[0] || '');
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  get brand() { return this.product?.brandName ?? ''; }
  get category() { return this.product?.categoryName ?? ''; }

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
