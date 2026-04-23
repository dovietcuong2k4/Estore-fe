import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import {
  ProfileData,
  ProfileFieldMetadata,
  ProfileUpdateRequest
} from '../../core/models/profile.model';
import { ProfileDynamicFormComponent } from '../../shared/components/profile-dynamic-form/profile-dynamic-form';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileDynamicFormComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfilePageComponent {
  private profileService = inject(ProfileService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  readonly loading = signal(true);
  readonly submitting = signal(false);

  readonly editMode = signal(false);
  readonly submitted = signal(false);
  readonly error = signal('');

  readonly profileData = signal<ProfileData | null>(null);
  readonly draftValues = signal<Record<string, string>>({});

  readonly sortedFields = computed(() => this.profileData()?.fields ?? []);

  readonly hasEditableFields = computed(() => this.sortedFields().some((field) => field.editable));

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.error.set('');

    this.profileService.getMyProfile().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        this.profileData.set(data);
        this.auth.updateCurrentUser(data.user);
        this.draftValues.set(this.toDraftValues(data));
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Không thể tải thông tin cá nhân.');
      }
    });
  }

  startEdit(): void {
    if (!this.profileData()) {
      return;
    }
    this.submitted.set(false);
    this.error.set('');
    this.editMode.set(true);
    this.draftValues.set(this.toDraftValues(this.profileData()!));
  }

  cancelEdit(): void {
    if (!this.profileData()) {
      return;
    }
    this.submitted.set(false);
    this.error.set('');
    this.editMode.set(false);
    this.draftValues.set(this.toDraftValues(this.profileData()!));
  }

  onFieldChanged(event: { fieldName: string; value: string }): void {
    this.draftValues.update((current) => ({
      ...current,
      [event.fieldName]: event.value
    }));
  }

  saveProfile(): void {
    const data = this.profileData();
    if (!data) {
      return;
    }

    this.submitted.set(true);

    if (!this.validateDraft(data.fields, this.draftValues())) {
      this.toast.warning('Vui lòng kiểm tra lại các trường chưa hợp lệ.');
      return;
    }

    const payload = this.buildUpdatePayload(data.fields, this.draftValues(), this.toDraftValues(data));
    if (Object.keys(payload.updates).length === 0) {
      this.toast.info('Không có thay đổi để lưu.');
      this.editMode.set(false);
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.profileService.updateMyProfile(payload).pipe(
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: (updated) => {
        this.profileData.set(updated);
        this.auth.updateCurrentUser(updated.user);
        this.draftValues.set(this.toDraftValues(updated));
        this.editMode.set(false);
        this.submitted.set(false);
        this.toast.success('Cập nhật thông tin cá nhân thành công.');
      },
      error: (err) => {
        const msg = err?.error?.message || 'Cập nhật thông tin thất bại.';
        this.error.set(msg);
        this.toast.error(msg);
      }
    });
  }

  private toDraftValues(data: ProfileData): Record<string, string> {
    const user = data.user;
    return {
      id: String(user.id ?? ''),
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      roles: (user.roles ?? []).map((role) => role.name).join(', ')
    };
  }

  private buildUpdatePayload(
    fields: ProfileFieldMetadata[],
    draft: Record<string, string>,
    original: Record<string, string>
  ): ProfileUpdateRequest {
    const editableFields = fields.filter((field) => field.editable);
    const updates: Record<string, string> = {};

    for (const field of editableFields) {
      const nextValue = (draft[field.name] ?? '').trim();
      const currentValue = (original[field.name] ?? '').trim();
      if (nextValue !== currentValue) {
        updates[field.name] = nextValue;
      }
    }

    return { updates };
  }

  private validateDraft(fields: ProfileFieldMetadata[], draft: Record<string, string>): boolean {
    const editableFields = fields.filter((field) => field.editable);

    for (const field of editableFields) {
      const value = (draft[field.name] ?? '').trim();

      if (field.required && !value) {
        return false;
      }

      if (field.maxLength && value.length > field.maxLength) {
        return false;
      }

      if (field.pattern && value) {
        try {
          const regex = new RegExp(field.pattern);
          if (!regex.test(value)) {
            return false;
          }
        } catch {
          // Ignore invalid backend regex on frontend to avoid blocking user action.
        }
      }
    }

    return true;
  }
}
