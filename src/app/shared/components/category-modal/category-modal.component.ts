import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseButtonComponent } from '../ui/base-button/base-button';
import { BaseInputComponent } from '../ui/base-input/base-input';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [BaseButtonComponent, BaseInputComponent],
  templateUrl: './category-modal.html'
  , styleUrl: './category-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() isSaving = false;
  @Input() category: any = null; // null for add mode, or category object for edit mode
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  localData: any = { name: '', iconUrl: '' };
  isEditing = false;
  validationError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] || changes['isOpen']) {
      if (this.isOpen) {
        this.validationError = '';
        if (this.category) {
          this.isEditing = true;
          this.localData = { ...this.category };
        } else {
          this.isEditing = false;
          this.localData = { name: '', iconUrl: '' };
        }
      }
    }
  }

  onSubmit() {
    this.validationError = '';
    if (!this.localData.name?.trim()) {
      this.validationError = 'Tên danh mục không được để trống';
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

  setIconUrl(value: string) {
    this.localData.iconUrl = value;
  }

  onImageError() {
    this.localData.iconUrl = 'https://via.placeholder.com/150?text=Invalid+Image';
  }

  get modalTitle(): string {
    return this.isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục';
  }
}
