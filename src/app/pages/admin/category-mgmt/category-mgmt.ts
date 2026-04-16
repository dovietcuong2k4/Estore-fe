import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';

@Component({
  selector: 'app-category-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-mgmt.html',
  styleUrls: ['../dashboard/dashboard.scss', './category-mgmt.scss']
})
export class CategoryMgmtComponent {
  categories: any[] = [];
  isModalOpen = false;
  selectedCategory: any = {};
  isEditing = false;

  constructor(private productApi: ProductApiService, private cdr: ChangeDetectorRef) {
    this.load();
  }

  load() {
    this.productApi.getCategories().subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }

  openAdd() {
    this.selectedCategory = { name: '' };
    this.isEditing = false;
    this.isModalOpen = true;
  }

  openEdit(cat: any) {
    this.selectedCategory = { ...cat };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  save() {
    if (!this.selectedCategory.name?.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }
    const call = this.isEditing
      ? this.productApi.updateCategory(this.selectedCategory.id, this.selectedCategory)
      : this.productApi.createCategory(this.selectedCategory);
    call.subscribe(() => { this.closeModal(); this.load(); });
  }

  delete(id: number) {
    if (confirm('Xóa danh mục này?')) {
      this.productApi.deleteCategory(id).subscribe(() => this.load());
    }
  }
}
