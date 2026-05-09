import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';
import { CategoryModalComponent } from '../../../shared/components/category-modal/category-modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal';

@Component({
  selector: 'app-category-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryModalComponent, BaseTableComponent, BaseButtonComponent, FilterBarComponent, BaseInputComponent, ConfirmModalComponent],
  templateUrl: './category-mgmt.html',
  styleUrls: ['../dashboard/dashboard.scss', './category-mgmt.scss']
})
export class CategoryMgmtComponent {
  categories: any[] = [];
  searchTerm = '';
  isModalOpen = false;
  isSaving = false;
  selectedCategory: any = null;
  isDeleteModalOpen = false;
  categoryIdToDelete: number | null = null;

  constructor(
    private productApi: ProductApiService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    this.load();
  }

  load() {
    this.productApi.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Lỗi khi tải danh sách danh mục');
      }
    });
  }

  openAdd() {
    this.selectedCategory = null;
    this.isModalOpen = true;
  }

  openEdit(cat: any) {
    this.selectedCategory = { ...cat };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  save(catData: any) {
    this.isSaving = true;
    const call = catData.id
      ? this.productApi.updateCategory(catData.id, catData)
      : this.productApi.createCategory(catData);
      
    call.subscribe({
      next: () => {
        this.toastService.success(catData.id ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công');
        this.closeModal();
        this.load();
        this.isSaving = false;
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra khi lưu danh mục');
        this.isSaving = false;
      }
    });
  }

  delete(id: number) {
    this.categoryIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.categoryIdToDelete) {
      this.productApi.deleteCategory(this.categoryIdToDelete).subscribe({
        next: () => {
          this.toastService.success('Đã xóa thành công');
          this.load();
          this.closeDeleteModal();
        },
        error: () => {
          this.toastService.error('Không thể xóa danh mục này');
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.categoryIdToDelete = null;
  }

  get filteredCategories(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.categories;
    }

    return this.categories.filter(category => {
      const name = String(category.name || '').toLowerCase();
      const description = String(category.description || '').toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }
}
