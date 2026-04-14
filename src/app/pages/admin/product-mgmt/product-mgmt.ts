import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductApiService } from '../../../core/services/product-api.service';

@Component({
  selector: 'app-product-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-mgmt.html',
  styleUrl: '../dashboard/dashboard.scss' // Reusing dashboard table styles
})
export class ProductMgmtComponent {
  products: Product[] = [];

  constructor(private productApi: ProductApiService) {
    this.productApi.getProducts('', 0, 500).subscribe(products => {
      this.products = products;
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getCategory(product: Product) {
    return product.categoryName ?? 'N/A';
  }
}
