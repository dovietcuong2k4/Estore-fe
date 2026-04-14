import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { MockDataService } from '../../core/services/mock-data.service';
import { Product, Category } from '../../core/models/product.model';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  discountedProducts: Product[] = [];
  categories: Category[];

  constructor(
    private mockData: MockDataService,
    private productApi: ProductApiService
  ) {
    this.categories = mockData.categories;
    this.loadProducts();
  }

  private loadProducts() {
    this.productApi.getProducts('', 0, 200).subscribe(products => {
      const normalizedProducts = products.map(p => ({
        ...p,
        soldQuantity: p.soldQuantity ?? 0
      }));

      this.featuredProducts = [...normalizedProducts]
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 8);

      this.newProducts = [...normalizedProducts]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);

      this.discountedProducts = normalizedProducts
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => {
          const dA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
          const dB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
          return dB - dA;
        })
        .slice(0, 8);
    });
  }
}
