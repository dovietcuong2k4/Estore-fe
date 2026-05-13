import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface RecommendedProduct {
  productId: number;
  productName: string;
  price: number;
  thumbnailUrl: string;
  reason: string;
}

export interface ProductRecommendationResponse {
  recommendations: RecommendedProduct[];
  aiEnabled: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private readonly api = inject(ApiService);
  private readonly fallbackImage = 'https://via.placeholder.com/200x150?text=No+Image';

  /**
   * Get AI-powered product recommendations
   * @param productId - The product ID to get recommendations for
   * @returns Observable with recommendations list
   */
  getRecommendations(productId: number): Observable<ProductRecommendationResponse> {
    return this.api.get<ProductRecommendationResponse>(
      `/products/${productId}/recommendations`
    ).pipe(
      map(response => ({
        ...response,
        recommendations: response.recommendations.map(rec => ({
          ...rec,
          thumbnailUrl: rec.thumbnailUrl || this.fallbackImage
        }))
      })),
      catchError(error => {
        console.error('Error fetching recommendations:', error);
        return of({
          recommendations: [],
          aiEnabled: false,
          message: 'Failed to load recommendations'
        });
      })
    );
  }
}
