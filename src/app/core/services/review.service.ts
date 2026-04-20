import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BaseResultDTO } from '../models/user.model';
import { ReviewSummaryResponse, ReviewRequest, ReviewResponse, ReviewEligibilityResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly api = inject(ApiService);

  getReviews(productId: number, page = 0, size = 5): Observable<BaseResultDTO<ReviewSummaryResponse>> {
    return this.api.get<BaseResultDTO<ReviewSummaryResponse>>(`/reviews/${productId}`, { page, size });
  }

  checkEligibility(productId: number): Observable<BaseResultDTO<ReviewEligibilityResponse>> {
    return this.api.get<BaseResultDTO<ReviewEligibilityResponse>>(`/reviews/${productId}/eligibility`);
  }

  createReview(productId: number, request: ReviewRequest): Observable<BaseResultDTO<ReviewResponse>> {
    return this.api.post<BaseResultDTO<ReviewResponse>>(`/reviews/${productId}`, request);
  }

  updateReview(productId: number, request: ReviewRequest): Observable<BaseResultDTO<ReviewResponse>> {
    return this.api.put<BaseResultDTO<ReviewResponse>>(`/reviews/${productId}`, request);
  }

  deleteReview(productId: number): Observable<BaseResultDTO<void>> {
    return this.api.delete<BaseResultDTO<void>>(`/reviews/${productId}`);
  }
}
