export interface Category {
  id: number;
  name: string;
  icon: string;
  productCount?: number;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryName?: string;
  brandName?: string;
  originalPrice?: number;
  cpu: string;
  ram: string;
  screen: string;
  operatingSystem: string;
  batteryCapacity: string;
  design: string;
  warrantyInfo: string;
  description: string;
  soldQuantity: number;
  stockQuantity: number;
  categoryId: number;
  brandId: number;
  image: string;
  images?: ProductImage[];
  rating?: number;
  reviewCount?: number;
  semanticScore?: number | null;
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
  publicId?: string;
  file?: File; // For local storage before upload
}

export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ReviewSummaryResponse {
  averageRating: number;
  totalReviews: number;
  reviews: PageResponse<ReviewResponse>;
  currentUserReview: ReviewResponse | null;
}

export interface ReviewAiSummaryResponse {
  productId: number;
  pros: string[];
  cons: string[];
  summary: string;
  reviewCount: number;
  lastGeneratedAt: string;
  externalSummaryLabel?: string;
  externalSummary?: string;
  externalSources?: ReviewAiSummarySourceResponse[];
  externalSummaryGeneratedAt?: string;
}

export interface ReviewAiSummarySourceResponse {
  title: string;
  url: string;
  website: string;
}


export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewEligibilityResponse {
  canReview: boolean;
  reason?: string;
}
