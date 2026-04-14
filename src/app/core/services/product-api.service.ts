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
  categoryName: string;
  brandName: string;
  images: ProductImageResponse[];
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
      categoryName: item.categoryName,
      brandName: item.brandName,
      image,
      images: item.images?.map(i => i.imageUrl) ?? [],
      originalPrice: item.price,
      cpu: 'N/A',
      ram: 'N/A',
      screen: 'N/A',
      operatingSystem: 'N/A',
      batteryCapacity: 'N/A',
      design: 'N/A',
      warrantyInfo: 'N/A',
      description: 'Đang cập nhật mô tả sản phẩm.',
      soldQuantity: 0,
      stockQuantity: 0,
      rating: 0,
      reviewCount: 0
    };
  }

  private pickImage(images: ProductImageResponse[] | undefined): string {
    if (!images?.length) return this.fallbackImage;
    const thumbnail = images.find(i => i.isThumbnail)?.imageUrl;
    return thumbnail || images[0].imageUrl || this.fallbackImage;
  }

  private mapCategoryId(categoryName: string): number {
    const category = this.mockData.categories.find(
      c => c.name.toLowerCase() === (categoryName ?? '').toLowerCase()
    );
    return category?.id ?? 0;
  }

  private mapBrandId(brandName: string): number {
    const brand = this.mockData.brands.find(
      b => b.name.toLowerCase() === (brandName ?? '').toLowerCase()
    );
    return brand?.id ?? 0;
  }
}
