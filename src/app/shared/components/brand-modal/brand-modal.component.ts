import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseButtonComponent } from '../ui/base-button/base-button';
import { BaseInputComponent } from '../ui/base-input/base-input';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [BaseButtonComponent, BaseInputComponent],
  templateUrl: './brand-modal.html'
  , styleUrl: './brand-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() isSaving = false;
  @Input() brand: any = null; // null for add mode, or brand object for edit mode
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  localData: any = { name: '', imageUrl: '' };
  isEditing = false;
  validationError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand'] || changes['isOpen']) {
      if (this.isOpen) {
        this.validationError = '';
        if (this.brand) {
          this.isEditing = true;
          this.localData = { ...this.brand };
        } else {
          this.isEditing = false;
          this.localData = { name: '', imageUrl: '' };
        }
      }
    }
  }

  onSubmit() {
    this.validationError = '';
    if (!this.localData.name?.trim()) {
      this.validationError = 'Tên hãng không được để trống';
      return;
    }
    
    // Emit the object to parent
    this.save.emit({ ...this.localData });
  }

  onCancel() {
    this.validationError = '';
    this.cancel.emit();
  }

  setName(value: string) {
    this.localData.name = value;
  }

  setImageUrl(value: string) {
    this.localData.imageUrl = value;
  }

  onImageError() {
    this.localData.imageUrl = 'https://via.placeholder.com/150?text=Invalid+Image';
  }

  get modalTitle(): string {
    return this.isEditing ? 'Cập nhật hãng sản xuất' : 'Thêm hãng sản xuất';
  }
}
