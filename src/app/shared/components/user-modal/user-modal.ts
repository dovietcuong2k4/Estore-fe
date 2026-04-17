import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUserUpsertRequest, RoleName, User } from '../../../core/models/user.model';
import { UserApiService } from '../../../core/services/user-api.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.scss']
})
export class UserModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  userForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  readonly roleOptions: { value: RoleName; label: string }[] = [
    { value: 'ROLE_ADMIN', label: 'Admin' },
    { value: 'ROLE_STAFF', label: 'Staff' },
    { value: 'ROLE_SHIPPER', label: 'Shipper' },
    { value: 'ROLE_CUSTOMER', label: 'User' }
  ];

  constructor(
    private fb: FormBuilder,
    private userApi: UserApiService
  ) {
    this.userForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
      if (this.user) {
        this.patchForm(this.user);
      }
    }
  }

  private initForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phone: [''],
      address: [''],
      roles: [['ROLE_CUSTOMER'], [Validators.required, Validators.minLength(1)]]
    });
  }

  private resetForm(): void {
    this.userForm.reset({
      roles: ['ROLE_CUSTOMER']
    });
    this.errorMessage = null;
    this.isSubmitting = false;

    // Update password validation based on mode
    this.updatePasswordValidation();
  }

  private updatePasswordValidation(): void {
    const passwordControl = this.userForm.get('password');
    if (!this.user) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      passwordControl?.setValidators([Validators.minLength(6)]);
    }
    passwordControl?.updateValueAndValidity();
  }

  private patchForm(user: User): void {
    this.userForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      roles: user.roles.map(r => r.name),
      password: '' // Don't patch password for security
    });
    this.updatePasswordValidation();
  }

  close(): void {
    if (!this.isSubmitting) {
      this.closed.emit();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.isSubmitting) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.userForm.value;
    const payload: AdminUserUpsertRequest = {
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address,
      roles: formValue.roles
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    const request = this.user && this.user.id
      ? this.userApi.updateUser(this.user.id, payload)
      : this.userApi.createUser(payload);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
        this.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Có lỗi xảy ra khi lưu thông tin người dùng.';
      }
    });
  }

  toggleRole(role: RoleName): void {
    const currentRoles: RoleName[] = [...this.userForm.get('roles')?.value];
    const index = currentRoles.indexOf(role);
    
    if (index > -1) {
      if (currentRoles.length > 1) {
        currentRoles.splice(index, 1);
      }
    } else {
      currentRoles.push(role);
    }
    
    this.userForm.get('roles')?.setValue(currentRoles);
    this.userForm.get('roles')?.markAsTouched();
  }

  isRoleSelected(role: RoleName): boolean {
    return this.userForm.get('roles')?.value?.includes(role) || false;
  }
}
