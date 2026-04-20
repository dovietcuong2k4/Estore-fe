import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voucher } from '../../../core/models/voucher.model';
import { BaseBadgeComponent } from '../ui/base-badge/base-badge';
import { BaseButtonComponent } from '../ui/base-button/base-button';

@Component({
  selector: 'app-voucher-table',
  standalone: true,
  imports: [CommonModule, BaseBadgeComponent, BaseButtonComponent],
  templateUrl: './voucher-table.component.html',
  styleUrl: './voucher-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherTableComponent {
  readonly vouchers = input<Voucher[]>([]);
  readonly canEdit = input(false);
  readonly showDelete = input(true);

  readonly edit = output<Voucher>();
  readonly assign = output<Voucher>();
  readonly delete = output<Voucher>();

  getDiscountLabel(voucher: Voucher): string {
    if (voucher.discountType === 'FIXED') {
      return this.formatPrice(voucher.discountValue);
    }

    return `${voucher.discountValue}%`;
  }

  getQuantityUsedLabel(voucher: Voucher): string {
    const total = this.readNumericField(voucher, ['totalQuantity', 'quantity']);
    const used = this.readNumericField(voucher, ['usedQuantity', 'usedCount']);

    if (total === null && used === null) {
      return 'Không có';
    }

    return `${used ?? 0} / ${total ?? 0}`;
  }

  getStatusLabel(voucher: Voucher): 'Đang hoạt động' | 'Hết hạn' | 'Đã tắt' {
    if (!voucher.active) {
      return 'Đã tắt';
    }

    if (new Date(voucher.endDate).getTime() <= Date.now()) {
      return 'Hết hạn';
    }

    return 'Đang hoạt động';
  }

  getStatusTone(voucher: Voucher): 'success' | 'neutral' | 'error' {
    const status = this.getStatusLabel(voucher);
    if (status === 'Đang hoạt động') {
      return 'success';
    }

    if (status === 'Hết hạn') {
      return 'neutral';
    }

    return 'error';
  }

  private formatPrice(value: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(value)}₫`;
  }

  private readNumericField(voucher: Voucher, keys: string[]): number | null {
    const raw = voucher as unknown as Record<string, unknown>;

    for (const key of keys) {
      const value = raw[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
    }

    return null;
  }
}
