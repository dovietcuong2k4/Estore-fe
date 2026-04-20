import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voucher } from '../../../core/models/voucher.model';
import { User } from '../../../core/models/user.model';
import { BaseModalComponent } from '../ui/base-modal/base-modal';
import { BaseButtonComponent } from '../ui/base-button/base-button';
import { BaseInputComponent } from '../ui/base-input/base-input';

@Component({
  selector: 'app-assign-voucher-modal',
  standalone: true,
  imports: [CommonModule, BaseModalComponent, BaseButtonComponent, BaseInputComponent],
  templateUrl: './assign-voucher-modal.component.html',
  styleUrl: './assign-voucher-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignVoucherModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() voucher: Voucher | null = null;
  @Input() users: User[] = [];
  @Input() isSubmitting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number[]>();

  readonly searchTerm = signal('');
  readonly selectedUserIds = signal<number[]>([]);

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.users.slice(0, 40);
    }

    return this.users
      .filter((user) => user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term))
      .slice(0, 60);
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.searchTerm.set('');
      this.selectedUserIds.set([]);
    }
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  toggleUser(userId: number): void {
    this.selectedUserIds.update((ids) => {
      if (ids.includes(userId)) {
        return ids.filter((id) => id !== userId);
      }

      return [...ids, userId];
    });
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUserIds().includes(userId);
  }

  submit(): void {
    if (this.selectedUserIds().length === 0 || this.isSubmitting) {
      return;
    }

    this.confirm.emit(this.selectedUserIds());
  }

  close(): void {
    if (!this.isSubmitting) {
      this.cancel.emit();
    }
  }

  formatVoucherValue(voucher: Voucher | null): string {
    if (!voucher) {
      return '';
    }

    if (voucher.discountType === 'FIXED') {
      return `${new Intl.NumberFormat('vi-VN').format(voucher.discountValue)}₫`;
    }

    return `${voucher.discountValue}%`;
  }
}
