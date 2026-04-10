import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { MockDataService } from '../../core/services/mock-data.service';
import { Product, Category } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  featuredProducts: Product[];
  newProducts: Product[];
  discountedProducts: Product[];
  categories: Category[];

  constructor(private mockData: MockDataService) {
    this.featuredProducts = mockData.getFeaturedProducts();
    this.newProducts = mockData.getNewProducts();
    this.discountedProducts = mockData.getDiscountedProducts();
    this.categories = mockData.categories;
  }
}
