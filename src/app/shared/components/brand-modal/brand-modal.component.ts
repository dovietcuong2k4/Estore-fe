import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-modal.html'
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

  onImageError() {
    this.localData.imageUrl = 'https://via.placeholder.com/150?text=Invalid+Image';
  }
}
