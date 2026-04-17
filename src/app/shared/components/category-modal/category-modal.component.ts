import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-modal.html'
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

  onImageError() {
    this.localData.iconUrl = 'https://via.placeholder.com/150?text=Invalid+Image';
  }
}
