import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product, ReviewSummaryResponse, ReviewEligibilityResponse } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductApiService } from '../../core/services/product-api.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = signal(1);
  activeImage = signal<string>('');
  activeTab = signal<'specs' | 'desc' | 'warranty' | 'reviews'>('specs');
  loading: boolean = false;

  // Review states
  reviewSummary = signal<ReviewSummaryResponse | null>(null);
  eligibility = signal<ReviewEligibilityResponse | null>(null);
  reviewForm = signal({ rating: 0, comment: '' });
  isEditing = signal(false);
  reviewLoading = signal(false);
  submittingReview = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productApi: ProductApiService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private toastService: ToastService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) return;

      this.loading = true;

      forkJoin({
        product: this.productApi.getProductById(id),
        products: this.productApi.getProducts('', 0, 200),
        reviews: this.reviewService.getReviews(id, 0, 5)
      }).subscribe(({ product, products, reviews }) => {
        if (!product) {
          this.router.navigate(['/products']);
          return;
        }

        this.product = product;
        this.reviewSummary.set(reviews.data);

        this.relatedProducts = products
          .filter(p => p.categoryName === product.categoryName && p.id !== product.id)
          .slice(0, 4);

        this.activeImage.set(product.image || product.images?.[0]?.imageUrl || '');
        this.loading = false;

        if (this.authService.isLoggedIn()) {
          this.loadEligibility(id);
        }

        this.cdr.detectChanges();
      });
    });
  }

  loadReviews(page = 0) {
    if (!this.product) return;
    this.reviewLoading.set(true);
    this.reviewService.getReviews(this.product.id, page, 5).subscribe(res => {
      this.reviewSummary.set(res.data);
      this.reviewLoading.set(false);
      this.cdr.detectChanges();
    });
  }

  loadEligibility(productId: number) {
    this.reviewService.checkEligibility(productId).subscribe(res => {
      this.eligibility.set(res.data);
      this.cdr.detectChanges();
    });
  }

  setRating(rating: number) {
    this.reviewForm.update(f => ({ ...f, rating }));
  }

  submitReview() {
    if (!this.product || this.reviewForm().rating === 0) return;

    this.submittingReview.set(true);
    const obs = this.isEditing()
      ? this.reviewService.updateReview(this.product.id, this.reviewForm())
      : this.reviewService.createReview(this.product.id, this.reviewForm());

    obs.subscribe({
      next: (res) => {
        this.toastService.success(res.message);
        this.loadReviews();
        this.loadEligibility(this.product!.id);
        this.resetReviewForm();
        this.submittingReview.set(false);
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Có lỗi xảy ra');
        this.submittingReview.set(false);
      }
    });
  }

  editReview() {
    const current = this.reviewSummary()?.currentUserReview;
    if (current) {
      this.reviewForm.set({ rating: current.rating, comment: current.comment });
      this.isEditing.set(true);
      this.activeTab.set('reviews');
      // Scroll to form if needed
      setTimeout(() => {
        document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  deleteReview() {
    if (!this.product || !confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    this.reviewService.deleteReview(this.product.id).subscribe({
      next: (res) => {
        this.toastService.success(res.message);
        this.loadReviews();
        this.loadEligibility(this.product!.id);
        this.resetReviewForm();
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Có lỗi xảy ra');
      }
    });
  }

  resetReviewForm() {
    this.reviewForm.set({ rating: 0, comment: '' });
    this.isEditing.set(false);
  }

  onPageChange(page: number) {
    this.loadReviews(page);
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
      this.cartService.addToCart(this.product.id, this.quantity(), this.product);
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
