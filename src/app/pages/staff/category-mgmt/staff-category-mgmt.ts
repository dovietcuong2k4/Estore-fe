import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../../core/services/product-api.service';

@Component({
  selector: 'app-staff-category-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-category-mgmt.html',
  styleUrls: ['../../admin/dashboard/dashboard.scss', '../../admin/category-mgmt/category-mgmt.scss']
})
export class StaffCategoryMgmtComponent {
  categories: any[] = [];

  constructor(private productApi: ProductApiService, private cdr: ChangeDetectorRef) {
    this.load();
  }

  load() {
    this.productApi.getCategories().subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }
}
