import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-staff-product-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-product-mgmt.html',
  styleUrl: './staff-product-mgmt.scss'
})
export class StaffProductMgmtComponent {
  private mockData = inject(MockDataService);
  readonly products = signal<Product[]>(this.mockData.products);
  searchQuery = signal('');

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.id.toString().includes(query)
    );
  });

  isModalOpen = false;
  editingProduct: Partial<Product> | null = null;

  constructor() {}

  openAddModal() {
    this.editingProduct = {
      id: Date.now(),
      name: '',
      price: 0,
      stockQuantity: 0,
      categoryId: 1,
      brandId: 1,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
      description: '',
      cpu: 'N/A', ram: 'N/A', screen: 'N/A', operatingSystem: 'N/A', batteryCapacity: 'N/A', design: 'N/A', warrantyInfo: 'N/A'
    };
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.editingProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingProduct = null;
  }

  saveProduct() {
    if (!this.editingProduct) return;

    const existingIndex = this.products().findIndex(p => p.id === this.editingProduct?.id);
    if (existingIndex > -1) {
      const updatedProducts = [...this.products()];
      updatedProducts[existingIndex] = this.editingProduct as Product;
      this.products.set(updatedProducts);
    } else {
      this.products.set([...this.products(), this.editingProduct as Product]);
    }
    this.closeModal();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products.set(this.products().filter(p => p.id !== id));
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }
}
