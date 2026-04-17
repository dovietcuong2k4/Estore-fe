import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';
import { BrandModalComponent } from '../../../shared/components/brand-modal/brand-modal.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-staff-brand-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandModalComponent],
  templateUrl: './staff-brand-mgmt.html'
})
export class StaffBrandMgmtComponent {
  brands: any[] = [];
  isModalOpen = false;
  isSaving = false;
  selectedBrand: any = null;

  constructor(
    private productApi: ProductApiService, 
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    this.load();
  }

  load() {
    this.productApi.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.cdr.detectChanges();
      },
      error: () => this.toastService.error('Lỗi khi tải danh sách hãng sản xuất')
    });
  }

  openAdd() {
    this.selectedBrand = null;
    this.isModalOpen = true;
  }

  openEdit(brand: any) {
    this.selectedBrand = { ...brand };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  save(brandData: any) {
    this.isSaving = true;
    const call = brandData.id
      ? this.productApi.updateBrand(brandData.id, brandData)
      : this.productApi.createBrand(brandData);
      
    call.subscribe({
      next: () => {
        this.toastService.success(brandData.id ? 'Cập nhật hãng thành công' : 'Thêm hãng thành công');
        this.closeModal();
        this.load();
        this.isSaving = false;
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra khi lưu hãng sản xuất');
        this.isSaving = false;
      }
    });
  }
}
