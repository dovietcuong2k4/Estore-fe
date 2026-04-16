import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
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
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
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

  getProductById(id: number): Observable<Product | null> {
    return this.api
      .get<BaseResultDTO<ProductResponse>>(`/products/detail/${id}`)
      .pipe(map(res => (res.data ? this.mapProduct(res.data) : null)));
  }

  createProduct(data: any): Observable<any> {
    return this.api.post<BaseResultDTO<ProductResponse>>('/products/create', data);
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
      reviewCount: item.reviewCount ?? 0
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
