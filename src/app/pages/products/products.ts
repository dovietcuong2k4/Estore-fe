import { Component, signal, computed, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { MockDataService } from '../../core/services/mock-data.service';
import { Product, Category, Brand } from '../../core/models/product.model';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, IconComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  allProducts = signal<Product[]>([]);
  loading = signal(true);
  categories: Category[] = [];
  brands: Brand[] = [];

  searchQuery = signal('');
  selectedCategory = signal<number | null>(null);
  selectedBrand = signal<number | null>(null);
  sortBy = signal<string>('popular');
  currentPage = signal(1);
  readonly pageSize = 12;

  filteredProducts = computed(() => {
    let products = [...this.allProducts()];
    const query = this.searchQuery().toLowerCase();
    const catId = this.selectedCategory();
    const brandId = this.selectedBrand();

    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.cpu.toLowerCase().includes(query)
      );
    }
    if (catId) products = products.filter(p => p.categoryId === catId);
    if (brandId) products = products.filter(p => p.brandId === brandId);

    switch (this.sortBy()) {
      case 'popular': products.sort((a, b) => b.soldQuantity - a.soldQuantity); break;
      case 'newest': products.sort((a, b) => b.id - a.id); break;
      case 'price-asc': products.sort((a, b) => a.price - b.price); break;
      case 'price-desc': products.sort((a, b) => b.price - a.price); break;
      case 'discount':
        products = products.filter(p => p.originalPrice && p.originalPrice > p.price);
        products.sort((a, b) => {
          const dA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
          const dB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
          return dB - dA;
        });
        break;
    }
    return products;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize));

  constructor(
    private mockData: MockDataService,
    private route: ActivatedRoute,
    private productApi: ProductApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.categories = mockData.categories;
    this.brands = mockData.brands;
  }

  ngOnInit() {
    this.productApi.getProducts('', 0, 500).subscribe(products => {
      this.allProducts.set(products);
      this.categories = this.categories.map(cat => ({
        ...cat,
        productCount: products.filter(p => p.categoryId === cat.id).length
      }));
      this.loading.set(false);
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(+params['category']);
      if (params['brand']) this.selectedBrand.set(+params['brand']);
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['sort']) this.sortBy.set(params['sort']);
      this.currentPage.set(1);
    });
  }

  setCategory(id: number | null) {
    this.selectedCategory.set(id);
    this.currentPage.set(1);
  }

  setBrand(id: number | null) {
    this.selectedBrand.set(id);
    this.currentPage.set(1);
  }

  setSort(sort: string) {
    this.sortBy.set(sort);
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedBrand.set(null);
    this.sortBy.set('popular');
    this.currentPage.set(1);
  }

  getCategoryName(id: number | null): string {
    if (!id) return 'Tất cả';
    return this.mockData.getCategoryById(id)?.name ?? '';
  }

  get pages(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if ('search' in params) {
        const search = params['search'] ?? '';

        this.searchQuery.set(search);

        setTimeout(() => {
          this.searchInput?.nativeElement.focus();
        }, 0);
      }
    });
  }
}
