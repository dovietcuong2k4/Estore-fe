import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';

@Component({
  selector: 'app-staff-brand-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-brand-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', '../../admin/category-mgmt/category-mgmt.scss']
})
export class StaffBrandMgmtComponent {
  brands: any[] = [];
  isModalOpen = false;
  selectedBrand: any = {};
  isEditing = false;

  constructor(private productApi: ProductApiService, private cdr: ChangeDetectorRef) {
    this.load();
  }

  load() {
    this.productApi.getBrands().subscribe(data => {
      this.brands = data;
      this.cdr.detectChanges();
    });
  }

  openAdd() {
    this.selectedBrand = { name: '', imageUrl: '' };
    this.isEditing = false;
    this.isModalOpen = true;
  }

  openEdit(brand: any) {
    this.selectedBrand = { ...brand };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  save() {
    if (!this.selectedBrand.name?.trim()) {
      alert('Vui lòng nhập tên hãng');
      return;
    }
    const call = this.isEditing
      ? this.productApi.updateBrand(this.selectedBrand.id, this.selectedBrand)
      : this.productApi.createBrand(this.selectedBrand);
    call.subscribe(() => { this.closeModal(); this.load(); });
  }

  // No delete function for staff
}
