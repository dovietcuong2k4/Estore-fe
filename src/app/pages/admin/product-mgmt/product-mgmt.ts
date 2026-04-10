import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-product-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-mgmt.html',
  styleUrl: '../dashboard/dashboard.scss' // Reusing dashboard table styles
})
export class ProductMgmtComponent {
  get products() { return this.mockData.products; }

  constructor(private mockData: MockDataService) {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  getCategory(id: number) {
    return this.mockData.getCategoryById(id)?.name;
  }
}
