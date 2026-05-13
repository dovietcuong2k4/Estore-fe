import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecommendationService, ProductRecommendationResponse, RecommendedProduct } from '../../../core/services/recommendation.service';

@Component({
  selector: 'app-product-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="recommendations-section" *ngIf="recommendations.length > 0 || loading">
      <div class="recommendations-header">
        <div class="header-content">
          <h2 class="header-title">
            <span class="ai-icon">🤖</span>
            {{ aiEnabled ? 'AI Recommendations' : 'Related Products' }}
          </h2>
          <p class="header-subtitle">{{ message }}</p>
        </div>
        <div class="ai-badge" [class.ai-enabled]="aiEnabled">
          <span class="badge-icon">{{ aiEnabled ? '✓' : '•' }}</span>
          <span class="badge-text">{{ aiEnabled ? 'AI Powered' : 'Curated' }}</span>
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
              <div class="card-badge" *ngIf="i === 0">TOP PICK</div>
            </div>

            <!-- Content -->
            <div class="card-content">
              <h3 class="product-name">{{ rec.productName }}</h3>

              <p class="product-price">
                {{ rec.price | currency: 'VND': 'symbol': '0.0-0' }}
              </p>

              <div class="reason-box">
                <p class="reason-label">Why we picked it:</p>
                <p class="reason-text">{{ rec.reason }}</p>
              </div>

              <button
                [routerLink]="['/products', rec.productId]"
                class="view-button"
              >
                View Details
                <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner"></div>
        <p class="loading-text">Loading recommendations...</p>
      </div>
    </section>
  `,
  styles: [`
    .recommendations-section {
      margin: 40px 0;
      padding: 30px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .recommendations-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      gap: 20px;
    }

    .header-content {
      flex: 1;
    }

    .header-title {
      font-size: 28px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ai-icon {
      font-size: 32px;
    }

    .header-subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .ai-badge {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      transition: all 0.3s ease;
    }

    .ai-badge.ai-enabled {
      border-color: #3498db;
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge-icon {
      font-size: 16px;
    }

    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .recommendation-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .recommendation-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .recommendation-card.featured {
      grid-column: span 1;
      border: 3px solid #3498db;
      box-shadow: 0 4px 16px rgba(52, 152, 219, 0.2);
    }

    .card-image-wrapper {
      position: relative;
      overflow: hidden;
      background: #f5f5f5;
      aspect-ratio: 4/3;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .recommendation-card:hover .card-image {
      transform: scale(1.05);
    }

    .card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #3498db;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .card-content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 10px 0;
      line-height: 1.4;
      min-height: 2.8em;
    }

    .product-price {
      font-size: 20px;
      font-weight: 700;
      color: #e74c3c;
      margin: 0 0 15px 0;
    }

    .reason-box {
      background: #f9f9f9;
      border-left: 3px solid #3498db;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 15px;
      flex: 1;
    }

    .reason-label {
      font-size: 11px;
      font-weight: 700;
      color: #666;
      margin: 0 0 5px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .reason-text {
      font-size: 13px;
      color: #555;
      margin: 0;
      line-height: 1.5;
    }

    .view-button {
      width: 100%;
      padding: 12px 16px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
    }

    .view-button:hover {
      background: #2980b9;
      transform: translateX(2px);
    }

    .arrow {
      font-size: 16px;
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
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #3498db;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .recommendations-section {
        padding: 20px;
        margin: 30px 0;
      }

      .recommendations-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-title {
        font-size: 22px;
      }

      .recommendations-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .recommendation-card.featured {
        grid-column: span 1;
      }

      .ai-badge {
        align-self: flex-start;
      }
    }
  `]
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
