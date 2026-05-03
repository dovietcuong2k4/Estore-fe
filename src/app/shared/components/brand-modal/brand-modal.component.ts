import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseButtonComponent } from '../ui/base-button/base-button';
import { BaseInputComponent } from '../ui/base-input/base-input';
import { UploadService } from '../../../core/services/upload.service';

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

  private uploadService = inject(UploadService);
  private cdr = inject(ChangeDetectorRef);

  localData: any = { name: '', imageUrl: '' };
  isEditing = false;
  validationError = '';
  selectedFile: File | null = null;
  isUploading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand'] || changes['isOpen']) {
      if (this.isOpen) {
        this.validationError = '';
        this.selectedFile = null;
        this.isUploading = false;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.localData.imageUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      event.target.value = '';
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    this.validationError = '';
    if (!this.localData.name?.trim()) {
      this.validationError = 'Tên hãng không được để trống';
      return;
    }

    if (this.isUploading) {
      return;
    }
    
    if (this.selectedFile) {
      this.isUploading = true;
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.localData.imageUrl = res.url;
          this.selectedFile = null;
          this.save.emit({ ...this.localData });
          this.isUploading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.validationError = 'Không thể tải ảnh lên. Vui lòng thử lại.';
          this.isUploading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.save.emit({ ...this.localData });
    }
  }

  onCancel() {
    this.validationError = '';
    this.selectedFile = null;
    this.isUploading = false;
    this.cancel.emit();
  }

  setName(value: string) {
    this.localData.name = value;
  }

  setImageUrl(value: string) {
    this.localData.imageUrl = value;
    if (value) {
      this.selectedFile = null;
    }
  }

  onImageError() {
    this.localData.imageUrl = 'https://via.placeholder.com/150?text=Invalid+Image';
  }

  get modalTitle(): string {
    return this.isEditing ? 'Cập nhật hãng sản xuất' : 'Thêm hãng sản xuất';
  }
}
