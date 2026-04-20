import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../../core/services/product-api.service';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';

@Component({
  selector: 'app-staff-category-mgmt',
  imports: [CommonModule, FormsModule, FilterBarComponent, BaseInputComponent, BaseTableComponent],
  templateUrl: './staff-category-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', './staff-category-mgmt.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffCategoryMgmtComponent {
  categories: any[] = [];
  searchTerm = '';

  constructor(private productApi: ProductApiService, private cdr: ChangeDetectorRef) {
    this.load();
  }

  load() {
    this.productApi.getCategories().subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
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
