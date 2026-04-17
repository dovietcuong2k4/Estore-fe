import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';
import { CategoryModalComponent } from '../../../shared/components/category-modal/category-modal.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-category-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryModalComponent],
  templateUrl: './category-mgmt.html',
  styleUrls: ['./category-mgmt.scss']
})
export class CategoryMgmtComponent {
  categories: any[] = [];
  isModalOpen = false;
  isSaving = false;
  selectedCategory: any = null;

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
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.productApi.deleteCategory(id).subscribe({
        next: () => {
          this.toastService.success('Đã xóa thành công');
          this.load();
        },
        error: () => {
          this.toastService.error('Không thể xóa danh mục này');
        }
      });
    }
  }
}
