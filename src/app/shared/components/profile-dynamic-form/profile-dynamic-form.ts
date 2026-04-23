import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileFieldMetadata } from '../../../core/models/profile.model';

@Component({
  selector: 'app-profile-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-dynamic-form.html',
  styleUrl: './profile-dynamic-form.scss'
})
export class ProfileDynamicFormComponent {
  readonly fields = input.required<ProfileFieldMetadata[]>();
  readonly values = input.required<Record<string, string>>();
  readonly editMode = input<boolean>(false);
  readonly submitted = input<boolean>(false);

  readonly valueChanged = output<{ fieldName: string; value: string }>();

  readonly visibleFields = computed(() => this.fields().filter((field) => field.name !== 'id'));

  onInput(fieldName: string, value: string): void {
    this.valueChanged.emit({ fieldName, value });
  }

  inputType(field: ProfileFieldMetadata): string {
    switch (field.type) {
      case 'EMAIL':
        return 'email';
      case 'TEL':
        return 'tel';
      case 'NUMBER':
        return 'number';
      default:
        return 'text';
    }
  }

  isReadonly(field: ProfileFieldMetadata): boolean {
    return !this.editMode() || !field.editable || field.type === 'TAGS' || field.name === 'id';
  }

  valueOf(fieldName: string): string {
    return this.values()[fieldName] ?? '';
  }

  hasClientError(field: ProfileFieldMetadata): boolean {
    if (!this.submitted() || !this.editMode()) {
      return false;
    }

    const value = this.valueOf(field.name).trim();

    if (field.required && !value) {
      return true;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return true;
    }

    if (field.pattern && value) {
      try {
        const regex = new RegExp(field.pattern);
        return !regex.test(value);
      } catch {
        return false;
      }
    }

    return false;
  }

  errorMessage(field: ProfileFieldMetadata): string {
    const value = this.valueOf(field.name).trim();

    if (field.required && !value) {
      return `${field.label} là bắt buộc`;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} tối đa ${field.maxLength} ký tự`;
    }

    if (field.pattern && value) {
      try {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          return `${field.label} không đúng định dạng`;
        }
      } catch {
        return '';
      }
    }

    return '';
  }
}
