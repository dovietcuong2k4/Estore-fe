import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { BaseResultDTO } from '../models/user.model';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { MockDataService } from './mock-data.service';

interface ProductImageResponse {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
  publicId: string;
}

interface ProductResponse {
  id: number;
  name: string;
  price: number;
  categoryName?: string;
  brandName?: string;
  images: ProductImageResponse[];
  originalPrice?: number;
  cpu?: string;
  ram?: string;
  screen?: string;
  operatingSystem?: string;
  batteryCapacity?: string;
  design?: string;
  warrantyInfo?: string;
  description?: string;
  soldQuantity?: number;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  semanticScore?: number | null;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

export interface ProductSearchOptions {
  query: string;
  mode?: 'ai' | 'keyword';
  categoryId?: number | null;
  brandId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  inStockOnly?: boolean;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly api = inject(ApiService);
  private readonly mockData = inject(MockDataService);
  private readonly fallbackImage = 'https://via.placeholder.com/600x400?text=No+Image';

  getProducts(keyword = '', page = 0, size = 200): Observable<Product[]> {
    const params: Record<string, string | number> = { page, size };
    if (keyword.trim()) {
      params['keyword'] = keyword.trim();
    }

    return this.api
      .get<BaseResultDTO<PageResponse<ProductResponse>>>('/products', params)
      .pipe(map(res => (res.data?.content ?? []).map(item => this.mapProduct(item))));
  }

  searchProducts(options: ProductSearchOptions): Observable<Product[]> {
    const query = options.query.trim();
    if (!query) {
      return this.getProducts('', options.page ?? 0, options.size ?? 200);
    }

    if (options.mode === 'keyword') {
      return this.keywordSearch(query, options.page ?? 0, options.size ?? 200);
    }

    const aiParams = this.buildAiSearchParams(options);
    return this.api
      .get<BaseResultDTO<PageResponse<ProductResponse>>>('/products/ai-search', aiParams)
      .pipe(
        map(res => (res.data?.content ?? []).map(item => this.mapProduct(item))),
        catchError(() => this.keywordSearch(query, options.page ?? 0, options.size ?? 200))
      );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.api
      .get<BaseResultDTO<ProductResponse>>(`/products/detail/${id}`)
      .pipe(map(res => (res.data ? this.mapProduct(res.data) : null)));
  }

  createProduct(data: any): Observable<any> {
    return this.api.post<BaseResultDTO<ProductResponse>>('/products/create', data);
  }

  getReviewAiSummary(id: number): Observable<any> {
    return this.api.get<BaseResultDTO<any>>(`/products/${id}/review-summary`)
      .pipe(map(res => res.data));
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.api.put<BaseResultDTO<ProductResponse>>(`/products/update/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete<BaseResultDTO<any>>(`/products/delete/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.api.get<any[]>('/categories');
  }

  createCategory(data: any): Observable<any> {
    return this.api.post<any>('/categories', data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.api.delete<any>(`/categories/${id}`);
  }

  getBrands(): Observable<any[]> {
    return this.api.get<any[]>('/brands');
  }

  createBrand(data: any): Observable<any> {
    return this.api.post<any>('/brands', data);
  }

  updateBrand(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/brands/${id}`, data);
  }

  deleteBrand(id: number): Observable<any> {
    return this.api.delete<any>(`/brands/${id}`);
  }

  private keywordSearch(keyword: string, page: number, size: number): Observable<Product[]> {
    return this.api
      .get<BaseResultDTO<PageResponse<ProductResponse>>>('/products', {
        keyword,
        page,
        size
      })
      .pipe(map(res => (res.data?.content ?? []).map(item => this.mapProduct(item))));
  }

  private buildAiSearchParams(options: ProductSearchOptions): Record<string, string | number> {
    const params: Record<string, string | number> = {
      q: options.query.trim(),
      page: options.page ?? 0,
      size: options.size ?? 200
    };

    if (options.categoryId != null) params['categoryId'] = options.categoryId;
    if (options.brandId != null) params['brandId'] = options.brandId;
    if (options.minPrice != null) params['minPrice'] = options.minPrice;
    if (options.maxPrice != null) params['maxPrice'] = options.maxPrice;
    if (options.minRating != null) params['minRating'] = options.minRating;
    if (options.inStockOnly != null) params['inStockOnly'] = options.inStockOnly ? 'true' : 'false';

    return params;
  }

  private mapProduct(item: ProductResponse): Product {
    const image = this.pickImage(item.images);
    const categoryId = this.mapCategoryId(item.categoryName);
    const brandId = this.mapBrandId(item.brandName);

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      categoryId,
      brandId,
      categoryName: item.categoryName ?? '',
      brandName: item.brandName ?? '',
      image,
      images: item.images?.map(i => ({
        id: i.id,
        imageUrl: i.imageUrl,
        isThumbnail: i.isThumbnail,
        sortOrder: i.sortOrder,
        publicId: i.publicId
      })) ?? [],
      originalPrice: item.originalPrice ?? item.price,
      cpu: item.cpu ?? 'N/A',
      ram: item.ram ?? 'N/A',
      screen: item.screen ?? 'N/A',
      operatingSystem: item.operatingSystem ?? 'N/A',
      batteryCapacity: item.batteryCapacity ?? 'N/A',
      design: item.design ?? 'N/A',
      warrantyInfo: item.warrantyInfo ?? 'N/A',
      description: item.description ?? 'Đang cập nhật mô tả sản phẩm.',
      soldQuantity: item.soldQuantity ?? 0,
      stockQuantity: item.stockQuantity ?? 0,
      rating: item.rating ?? 0,
      reviewCount: item.reviewCount ?? 0,
      semanticScore: item.semanticScore ?? null
    };
  }

  private pickImage(images: ProductImageResponse[] | undefined): string {
    if (!images?.length) return this.fallbackImage;
    const thumbnail = images.find(i => i.isThumbnail)?.imageUrl;
    return thumbnail || images[0].imageUrl || this.fallbackImage;
  }

  private mapCategoryId(categoryName?: string): number {
    const category = this.mockData.categories.find(
      c => c.name.toLowerCase() === (categoryName ?? '').toLowerCase()
    );
    return category?.id ?? 0;
  }

  private mapBrandId(brandName?: string): number {
    const brand = this.mockData.brands.find(
      b => b.name.toLowerCase() === (brandName ?? '').toLowerCase()
    );
    return brand?.id ?? 0;
  }
}
