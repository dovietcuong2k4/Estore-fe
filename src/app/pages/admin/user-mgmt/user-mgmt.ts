import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../../core/services/user-api.service';
import { User } from '../../../core/models/user.model';
import { UserModalComponent } from '../../../shared/components/user-modal/user-modal';

@Component({
  selector: 'app-user-mgmt',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  templateUrl: './user-mgmt.html',
  styleUrls: ['./user-mgmt.scss', '../dashboard/dashboard.scss', '../category-mgmt/category-mgmt.scss']
})
export class UserMgmtComponent {
  users: User[] = [];
  isModalOpen = false;
  selectedUser: User | null = null;

  constructor(
    private userApi: UserApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userApi.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Không thể tải danh sách người dùng');
      }
    });
  }

  openCreateModal(): void {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  onUserSaved(): void {
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.fullName}"?`)) {
      return;
    }

    this.userApi.deleteUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: err => alert(err?.error?.message || 'Không thể xóa người dùng')
    });
  }
}

