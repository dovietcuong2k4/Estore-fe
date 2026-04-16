import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductImage, Category, Brand } from '../../../core/models/product.model';
import { ProductApiService } from '../../../core/services/product-api.service';
import { ProductModalComponent } from '../../../shared/components/product-modal/product-modal';

@Component({
  selector: 'app-staff-product-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  templateUrl: './staff-product-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', './staff-product-mgmt.scss']
})
export class StaffProductMgmtComponent {
  products: Product[] = [];
  
  isModalOpen = false;
  isDetailModalOpen = false;
  selectedProduct: any = null;
  categories: Category[] = [];
  brands: Brand[] = [];

  constructor(
    private productApi: ProductApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadProducts();
    this.loadMetadata();
  }

  loadMetadata() {
    this.productApi.getCategories().subscribe(res => this.categories = res);
    this.productApi.getBrands().subscribe(res => this.brands = res);
  }

  loadProducts() {
    this.productApi.getProducts('', 0, 500).subscribe(products => {
      this.products = products;
      this.cdr.detectChanges();
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getCategory(product: Product) {
    return product.categoryName ?? 'N/A';
  }

  openAddModal() {    
    this.selectedProduct = {
      name: '', price: 0, categoryId: this.categories[0]?.id || 1, brandId: this.brands[0]?.id || 1,
      cpu: '', ram: '', screen: '', operatingSystem: '',
      batteryCapacity: '', design: '', warrantyInfo: '', description: '',
      stockQuantity: 0, images: []
    };
    this.isDetailModalOpen = false;
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    this.isDetailModalOpen = false;
    this.isModalOpen = true;
  }

  openDetailModal(product: Product) {
    this.selectedProduct = product;
    this.isDetailModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(updatedProduct: any) {
    this.selectedProduct = updatedProduct;
    this.executeSave();
  }

  private executeSave() {
    if (this.selectedProduct.id) {
      this.productApi.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(() => {
        this.closeModal();
        this.loadProducts();
      });
    } else {
      this.productApi.createProduct(this.selectedProduct).subscribe(() => {
        this.closeModal();
        this.loadProducts();
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productApi.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
