import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../../core/services/user-api.service';
import { User } from '../../../core/models/user.model';
import { UserModalComponent } from '../../../shared/components/user-modal/user-modal';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseBadgeComponent } from '../../../shared/components/ui/base-badge/base-badge';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal';

@Component({
  selector: 'app-user-mgmt',
  standalone: true,
  imports: [CommonModule, UserModalComponent, BaseTableComponent, BaseButtonComponent, FilterBarComponent, BaseInputComponent, BaseBadgeComponent, ConfirmModalComponent],
  templateUrl: './user-mgmt.html',
  styleUrls: ['./user-mgmt.scss', '../dashboard/dashboard.scss', '../category-mgmt/category-mgmt.scss']
})
export class UserMgmtComponent {
  users: User[] = [];
  searchTerm = '';
  isModalOpen = false;
  selectedUser: User | null = null;
  isDeleteModalOpen = false;
  userToDelete: User | null = null;

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
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.userApi.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDeleteModal();
        },
        error: err => {
          alert(err?.error?.message || 'Không thể xóa người dùng');
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.users;
    }

    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.phone || '').toLowerCase().includes(term)
    );
  }

  getRoleTone(roleName: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (roleName) {
      case 'ROLE_ADMIN':
        return 'warning';
      case 'ROLE_STAFF':
        return 'info';
      case 'ROLE_SHIPPER':
        return 'success';
      default:
        return 'neutral';
    }
  }
}

