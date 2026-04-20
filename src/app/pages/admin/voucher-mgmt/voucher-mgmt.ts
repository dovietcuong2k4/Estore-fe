import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherService } from '../../../core/services/voucher.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Voucher, CreateVoucherRequest } from '../../../core/models/voucher.model';
import { User } from '../../../core/models/user.model';
import { VoucherModalComponent } from '../../../shared/components/voucher-modal/voucher-modal.component';
import { VoucherTableComponent } from '../../../shared/components/voucher-table/voucher-table.component';
import { AssignVoucherModalComponent } from '../../../shared/components/assign-voucher-modal/assign-voucher-modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseTabsComponent } from '../../../shared/components/ui/base-tabs/base-tabs';

@Component({
  selector: 'app-voucher-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    VoucherModalComponent,
    VoucherTableComponent,
    AssignVoucherModalComponent,
    BaseButtonComponent,
    BaseTableComponent,
    FilterBarComponent,
    BaseInputComponent,
    BaseTabsComponent
  ],
  templateUrl: './voucher-mgmt.html',
  styleUrls: ['../dashboard/dashboard.scss', './voucher-mgmt.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherMgmtComponent {
  private voucherService = inject(VoucherService);
  private userApi = inject(UserApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private readonly allVouchers = signal<Voucher[]>([]);
  readonly users = signal<User[]>([]);

  readonly isAdmin = this.auth.isAdmin;
  readonly canEditVouchers = computed(() => this.isAdmin());

  searchTerm = signal('');
  statusFilter = signal<'ALL' | 'ACTIVE' | 'EXPIRED' | 'DISABLED'>('ALL');
  readonly statusTabs = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Đang hoạt động', value: 'ACTIVE' },
    { label: 'Hết hạn', value: 'EXPIRED' },
    { label: 'Đã tắt', value: 'DISABLED' }
  ];

  readonly filteredVouchers = computed(() => {
    let list = this.allVouchers();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();

    if (term) {
      list = list.filter(v => v.code.toLowerCase().includes(term));
    }

    if (status !== 'ALL') {
      list = list.filter((voucher) => this.getVoucherStatus(voucher) === status);
    }

    return list;
  });

  readonly filteredCount = computed(() => this.filteredVouchers().length);

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  editingVoucher: Voucher | null = null;
  isSaving = false;

  isAssignModalOpen = false;
  isAssigningUsers = false;
  selectedVoucherForAssign: Voucher | null = null;

  constructor() {
    void this.loadVouchers();
    void this.loadUsers();
  }

  async loadVouchers(): Promise<void> {
    const list = await this.voucherService.getAllVoucherTemplates();
    this.allVouchers.set(list);
  }

  loadUsers(): void {
    this.userApi.getUsers().subscribe({
      next: (list) => this.users.set(list),
      error: () => this.toast.error('Không thể tải danh sách người dùng')
    });
  }

  openAdd(): void {
    if (!this.canEditVouchers()) {
      return;
    }

    this.modalMode = 'create';
    this.editingVoucher = null;
    this.isModalOpen = true;
  }

  openEdit(voucher: Voucher): void {
    if (!this.canEditVouchers()) {
      return;
    }

    this.modalMode = 'edit';
    this.editingVoucher = voucher;
    this.isModalOpen = true;
  }

  closeVoucherModal(): void {
    this.isModalOpen = false;
    this.editingVoucher = null;
    this.modalMode = 'create';
  }

  async onSave(request: CreateVoucherRequest) {
    if (!this.canEditVouchers()) {
      return;
    }

    this.isSaving = true;
    try {
      const res = this.editingVoucher
        ? await this.voucherService.updateVoucherTemplate(this.editingVoucher.id, request)
        : await this.voucherService.createVoucherTemplate(request);

      if (res.success) {
        this.toast.success(res.message);
        this.closeVoucherModal();
        await this.loadVouchers();
      } else {
        this.toast.error(res.message);
      }
    } finally {
      this.isSaving = false;
    }
  }

  openAssign(voucher: Voucher): void {
    this.selectedVoucherForAssign = voucher;
    this.isAssignModalOpen = true;
  }

  closeAssignModal(): void {
    if (this.isAssigningUsers) {
      return;
    }

    this.isAssignModalOpen = false;
    this.selectedVoucherForAssign = null;
  }

  async onAssignToUsers(userIds: number[]): Promise<void> {
    if (!this.selectedVoucherForAssign || userIds.length === 0) {
      return;
    }

    this.isAssigningUsers = true;
    try {
      const tasks = userIds.map((userId) => this.voucherService.assignVoucher({
        voucherId: this.selectedVoucherForAssign!.id,
        userId
      }));

      const results = await Promise.all(tasks);
      const successCount = results.filter((result) => result.success).length;

      if (successCount === userIds.length) {
        this.toast.success(`Đã gán voucher cho ${successCount} người dùng.`);
      } else if (successCount > 0) {
        this.toast.warning(`Đã gán cho ${successCount}/${userIds.length} người dùng. Một số gán thất bại.`);
      } else {
        this.toast.error(results[0]?.message || 'Gán voucher thất bại.');
      }

      if (successCount > 0) {
        this.closeAssignModal();
      }
    } finally {
      this.isAssigningUsers = false;
    }
  }

  async onDelete(voucher: Voucher): Promise<void> {
    if (!this.canEditVouchers()) {
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc muốn xóa voucher ${voucher.code} không?`);
    if (!confirmed) {
      return;
    }

    const res = await this.voucherService.deleteVoucherTemplate(voucher.id);
    if (res.success) {
      this.toast.success(res.message);
      await this.loadVouchers();
      return;
    }

    this.toast.error(res.message);
  }

  onStatusFilterChanged(value: string): void {
    if (value === 'ALL' || value === 'ACTIVE' || value === 'EXPIRED' || value === 'DISABLED') {
      this.statusFilter.set(value);
    }
  }

  private getVoucherStatus(voucher: Voucher): 'ACTIVE' | 'EXPIRED' | 'DISABLED' {
    if (!voucher.active) {
      return 'DISABLED';
    }

    if (new Date(voucher.endDate).getTime() <= Date.now()) {
      return 'EXPIRED';
    }

    return 'ACTIVE';
  }
}
