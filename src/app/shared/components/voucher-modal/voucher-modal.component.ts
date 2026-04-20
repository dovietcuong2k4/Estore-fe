import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateVoucherRequest, Voucher } from '../../../core/models/voucher.model';
import { BaseModalComponent } from '../ui/base-modal/base-modal';
import { BaseInputComponent } from '../ui/base-input/base-input';
import { BaseSelectComponent } from '../ui/base-select/base-select';
import { BaseButtonComponent } from '../ui/base-button/base-button';

@Component({
  selector: 'app-voucher-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseModalComponent, BaseInputComponent, BaseSelectComponent, BaseButtonComponent],
  templateUrl: './voucher-modal.html',
  styleUrl: './voucher-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() isSaving = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() voucher: Voucher | null = null;
  
  @Output() save = new EventEmitter<CreateVoucherRequest>();
  @Output() cancel = new EventEmitter<void>();

  readonly discountTypeOptions = [
    { label: 'Phần trăm', value: 'PERCENTAGE' },
    { label: 'Số tiền cố định', value: 'FIXED' }
  ];

  localData: CreateVoucherRequest & { quantity: number } = {
    code: '',
    discountType: 'FIXED',
    discountValue: 0,
    minOrderValue: 0,
    quantity: 0,
    startDate: '',
    endDate: ''
  };
  
  validationError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['isOpen'] && this.isOpen) || changes['voucher'] || changes['mode']) {
      if (!this.isOpen) {
        return;
      }

      this.validationError = '';
      this.localData = this.voucher ? this.mapVoucherToForm(this.voucher) : this.createEmptyForm();
    }
  }

  setCode(value: string): void {
    this.localData.code = value.toUpperCase();
  }

  setDiscountType(value: string | number): void {
    if (value === 'FIXED' || value === 'PERCENTAGE') {
      this.localData.discountType = value;
    }
  }

  setDiscountValue(value: string): void {
    this.localData.discountValue = Number(value) || 0;
  }

  setQuantity(value: string): void {
    this.localData.quantity = Number(value) || 0;
  }

  setStartDate(value: string): void {
    this.localData.startDate = value;
  }

  setEndDate(value: string): void {
    this.localData.endDate = value;
  }

  onSubmit() {
    this.validationError = '';
    
    if (!this.localData.code?.trim()) {
      this.validationError = 'Mã voucher là bắt buộc.';
      return;
    }

    if (this.localData.discountValue <= 0) {
      this.validationError = 'Giá trị giảm phải lớn hơn 0.';
      return;
    }

    if (this.localData.quantity <= 0) {
      this.validationError = 'Số lượng phải lớn hơn 0.';
      return;
    }

    if (!this.localData.startDate || !this.localData.endDate) {
      this.validationError = 'Ngày bắt đầu và ngày kết thúc là bắt buộc.';
      return;
    }

    if (new Date(this.localData.startDate).getTime() >= new Date(this.localData.endDate).getTime()) {
      this.validationError = 'Ngày kết thúc phải sau ngày bắt đầu.';
      return;
    }
    
    this.save.emit(this.toPayload());
  }

  onCancel() {
    this.validationError = '';
    this.cancel.emit();
  }

  get title(): string {
    return this.mode === 'edit' ? 'Cập nhật voucher' : 'Tạo voucher';
  }

  get submitLabel(): string {
    return this.mode === 'edit' ? 'Lưu thay đổi' : 'Tạo voucher';
  }

  private createEmptyForm(): CreateVoucherRequest & { quantity: number } {
    return {
      code: '',
      discountType: 'FIXED',
      discountValue: 0,
      minOrderValue: 0,
      quantity: 0,
      startDate: '',
      endDate: ''
    };
  }

  private mapVoucherToForm(voucher: Voucher): CreateVoucherRequest & { quantity: number } {
    return {
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minOrderValue: voucher.minOrderValue,
      quantity: voucher.totalQuantity ?? voucher.quantity ?? 0,
      startDate: this.toDatetimeLocalValue(voucher.startDate),
      endDate: this.toDatetimeLocalValue(voucher.endDate)
    };
  }

  private toPayload(): CreateVoucherRequest {
    return {
      code: this.localData.code.trim(),
      discountType: this.localData.discountType,
      discountValue: this.localData.discountValue,
      minOrderValue: this.localData.minOrderValue,
      quantity: this.localData.quantity,
      startDate: this.localData.startDate,
      endDate: this.localData.endDate
    };
  }

  private toDatetimeLocalValue(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    const pad = (input: number) => String(input).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
