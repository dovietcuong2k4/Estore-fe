import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RecommendationService, ProductRecommendationResponse, RecommendedProduct } from '../../../core/services/recommendation.service';

import { IconComponent } from '../ui/icon/icon.component';

@Component({
  selector: 'app-product-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <section class="recommendations-section" *ngIf="recommendations.length > 0 || loading">
      <div class="recommendations-header">
        <div class="header-content">
          <h2 class="header-title">
            <app-icon [name]="aiEnabled ? 'sparkles' : 'shopping-bag'" size="28" [className]="aiEnabled ? 'text-ai' : 'text-primary'"></app-icon>
            {{ aiEnabled ? 'AI Recommendations' : 'Sản phẩm liên quan' }}
          </h2>
          <p class="header-subtitle">{{ message }}</p>
        </div>
        <div class="ai-badge" [class.ai-enabled]="aiEnabled">
          <app-icon [name]="aiEnabled ? 'cpu' : 'package'" size="14"></app-icon>
          <span class="badge-text">{{ aiEnabled ? 'AI Powered' : 'Đề xuất' }}</span>
        </div>
      </div>

      <div class="recommendations-container" *ngIf="!loading">
        <div class="recommendations-grid">
          <div
            *ngFor="let rec of recommendations; let i = index"
            class="recommendation-card"
            [class.featured]="i === 0"
            [@slideIn]="i"
          >
            <!-- Image -->
            <div class="card-image-wrapper">
              <img
                [src]="rec.thumbnailUrl"
                [alt]="rec.productName"
                class="card-image"
                loading="lazy"
              />
              <div class="card-badge" *ngIf="i === 0">
                <app-icon name="star" size="10" fill="currentColor"></app-icon>
                LỰA CHỌN TỐT NHẤT
              </div>
            </div>

            <!-- Content -->
            <div class="card-content">
              <h3 class="product-name">{{ rec.productName }}</h3>

              <div class="price-row">
                <p class="product-price">
                  {{ rec.price | currency: 'VND': 'symbol': '0.0-0' }}
                </p>
              </div>

              <div class="reason-box">
                <div class="reason-header">
                  <app-icon name="info" size="12"></app-icon>
                  <span class="reason-label">Tại sao nên chọn?</span>
                </div>
                <p class="reason-text">{{ rec.reason }}</p>
              </div>

              <button
                [routerLink]="['/products', rec.productId]"
                class="view-button"
              >
                <span>Xem chi tiết</span>
                <app-icon name="arrow-right" size="16" className="arrow"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner"></div>
        <p class="loading-text">Đang tìm kiếm đề xuất phù hợp...</p>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      margin: 3rem 0;
    }

    .recommendations-section {
      padding: 2.5rem;
      background: 
        radial-gradient(circle at 20% 0%, rgba(143, 245, 255, 0.12), transparent 50%),
        radial-gradient(circle at 80% 100%, rgba(172, 138, 255, 0.08), transparent 50%),
        rgba(20, 31, 56, 0.45);
      border-radius: var(--kv-radius-lg);
      box-shadow: 
        inset 0 0 0 1px rgba(143, 245, 255, 0.1),
        0 20px 50px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(28px);
      position: relative;
      overflow: hidden;
    }

    .recommendations-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(143, 245, 255, 0) 20%, 
        rgba(143, 245, 255, 0.4) 50%, 
        rgba(143, 245, 255, 0) 80%, 
        transparent 100%
      );
    }

    /* Thêm hiệu ứng phát sáng nhẹ ở các góc */
    .recommendations-section::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(143, 245, 255, 0.03), transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .recommendations-header, 
    .recommendations-container {
      position: relative;
      z-index: 1;
    }

    .recommendations-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1.5rem;
    }

    .header-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--kv-text);
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      letter-spacing: -0.03em;
    }

    .text-ai {
      color: var(--kv-primary);
      filter: drop-shadow(0 0 8px rgba(143, 245, 255, 0.4));
    }

    .header-subtitle {
      color: var(--kv-text-muted);
      font-size: 0.95rem;
      margin: 0;
    }

    .ai-badge {
      background: rgba(20, 31, 56, 0.6);
      box-shadow: inset 0 0 0 1px rgba(64, 72, 93, 0.3);
      border-radius: var(--kv-radius-full);
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--kv-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ai-badge.ai-enabled {
      background: linear-gradient(135deg, rgba(143, 245, 255, 0.15) 0%, rgba(172, 138, 255, 0.1) 100%);
      box-shadow: 
        inset 0 0 0 1px rgba(143, 245, 255, 0.3),
        0 4px 12px rgba(143, 245, 255, 0.1);
      color: var(--kv-primary);
    }

    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .recommendation-card {
      background: var(--kv-surface-low);
      border-radius: var(--kv-radius-md);
      overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(64, 72, 93, 0.2);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .recommendation-card:hover {
      transform: translateY(-6px);
      box-shadow: inset 0 0 0 1px rgba(143, 245, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.4);
      background: var(--kv-surface);
    }

    .recommendation-card.featured {
      box-shadow: inset 0 0 0 1px rgba(143, 245, 255, 0.25);
    }

    .card-image-wrapper {
      position: relative;
      overflow: hidden;
      background: #000;
      aspect-ratio: 16/10;
    }

    .card-image-wrapper::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(9, 19, 40, 0.4));
      pointer-events: none;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0.9;
    }

    .recommendation-card:hover .card-image {
      transform: scale(1.08);
      opacity: 1;
    }

    .card-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--kv-primary);
      color: #003f43;
      padding: 0.35rem 0.75rem;
      border-radius: var(--kv-radius-full);
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 4px 12px rgba(143, 245, 255, 0.3);
    }

    .card-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--kv-text);
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.8em;
    }

    .price-row {
      margin-bottom: 1.25rem;
    }

    .product-price {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--kv-primary);
      margin: 0;
    }

    .reason-box {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: var(--kv-radius-sm);
      margin-bottom: 1.5rem;
      flex: 1;
      border-left: 2px solid rgba(143, 245, 255, 0.2);
    }

    .reason-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 0.5rem;
      color: var(--kv-primary);
      opacity: 0.8;
    }

    .reason-label {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .reason-text {
      font-size: 0.85rem;
      color: var(--kv-text-muted);
      margin: 0;
      line-height: 1.6;
      font-style: italic;
    }

    .view-button {
      width: 100%;
      padding: 0.85rem;
      background: rgba(143, 245, 255, 0.08);
      box-shadow: inset 0 0 0 1px rgba(143, 245, 255, 0.15);
      color: var(--kv-text);
      border-radius: var(--kv-radius-md);
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .view-button:hover {
      background: var(--kv-primary);
      color: #003f43;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(143, 245, 255, 0.2);
    }

    .arrow {
      transition: transform 0.3s ease;
    }

    .view-button:hover .arrow {
      transform: translateX(4px);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid rgba(143, 245, 255, 0.1);
      border-top-color: var(--kv-primary);
      border-radius: 50%;
      animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 15px rgba(143, 245, 255, 0.1);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      color: var(--kv-text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    @media (max-width: 768px) {
      .recommendations-section {
        padding: 1.5rem;
      }

      .recommendations-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-title {
        font-size: 1.5rem;
      }

      .recommendations-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductRecommendationsComponent implements OnInit {
  @Input() productId!: number;

  recommendations: RecommendedProduct[] = [];
  aiEnabled = false;
  message = '';
  loading = false;

  constructor(
    private recommendationService: RecommendationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.productId) {
      this.loadRecommendations();
        this.cdr.detectChanges();
    }
  }

  loadRecommendations() {
    this.loading = true;
    this.recommendationService.getRecommendations(this.productId).subscribe(
      (response: ProductRecommendationResponse) => {
        this.recommendations = response.recommendations;
        this.aiEnabled = response.aiEnabled;
        this.message = response.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
