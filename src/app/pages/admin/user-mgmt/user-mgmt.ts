import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-user-mgmt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-mgmt.html',
  styleUrl: '../dashboard/dashboard.scss'
})
export class UserMgmtComponent {
  get users() { return this.mockData.mockUsers; }
  constructor(private mockData: MockDataService) {}
}
