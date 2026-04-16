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
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
  publicId?: string;
  file?: File; // For local storage before upload
}
