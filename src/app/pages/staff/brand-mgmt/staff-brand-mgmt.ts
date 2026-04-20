import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';
import { BrandModalComponent } from '../../../shared/components/brand-modal/brand-modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';

@Component({
  selector: 'app-staff-brand-mgmt',
  imports: [CommonModule, FormsModule, BrandModalComponent, BaseButtonComponent, BaseTableComponent, FilterBarComponent, BaseInputComponent],
  templateUrl: './staff-brand-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', './staff-brand-mgmt.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffBrandMgmtComponent {
  brands: any[] = [];
  searchTerm = '';
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

  get filteredBrands(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.brands;
    }

    return this.brands.filter(brand => String(brand.name || '').toLowerCase().includes(term));
  }
}
