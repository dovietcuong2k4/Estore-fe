import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductImage, Category, Brand } from '../../../core/models/product.model';
import { UploadService } from '../../../core/services/upload.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss'
})
export class ProductModalComponent {
  @Input() isVisible = false;
  @Input() isDetail = false;
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  
  _product: any = {};
  @Input() set product(val: any) {
    if (val) {
      this._product = { ...val };
      this.productImages = val.images ? JSON.parse(JSON.stringify(val.images)) : [];
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  productImages: ProductImage[] = [];

  constructor(
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {}

  closeModal() {
    this.close.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const isThumbnail = this.productImages.length === 0;
        this.productImages.push({
          imageUrl: e.target.result,
          isThumbnail: isThumbnail,
          sortOrder: this.productImages.length,
          publicId: '',
          file: file
        });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.productImages.splice(index, 1);
    if (this.productImages.length > 0 && !this.productImages.some(img => img.isThumbnail)) {
      this.productImages[0].isThumbnail = true;
    }
  }

  setThumbnail(index: number) {
    this.productImages.forEach((img, i) => {
      img.isThumbnail = i === index;
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  saveProduct() {
    if (!this._product.name || this._product.price <= 0 || !this._product.categoryId || !this._product.brandId) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const newImages = this.productImages.filter(img => img.file);
    if (newImages.length > 0) {
      const uploads = newImages.map(img => 
        this.uploadService.uploadImage(img.file!).pipe(
          map(res => {
            img.imageUrl = res.url;
            img.publicId = res.publicId;
            delete img.file;
            return res;
          })
        )
      );
      
      forkJoin(uploads).subscribe(() => {
        this.emitSave();
      });
    } else {
      this.emitSave();
    }
  }

  private emitSave() {
    this._product.images = this.productImages;
    this.save.emit(this._product);
  }
}
