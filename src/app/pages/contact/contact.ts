import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { BaseResultDTO } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast.service';

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  success = signal(false);
  submitting = signal(false);
  error = signal('');

  constructor(
    private api: ApiService,
    private toastService: ToastService
  ) {}

  async submit() {
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
      this.error.set('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const payload: ContactRequest = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      subject: this.form.subject.trim(),
      message: this.form.message.trim(),
      ...(this.form.phone?.trim() ? { phone: this.form.phone.trim() } : {})
    };

    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<void>>('/contact', payload)
      );
      if (res.success) {
        this.success.set(true);
        this.toastService.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      } else {
        this.error.set(res.message || 'Gửi liên hệ thất bại.');
      }
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Không thể gửi liên hệ. Vui lòng thử lại sau.');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm() {
    this.success.set(false);
    this.error.set('');
    this.form = { name: '', email: '', phone: '', subject: '', message: '' };
  }
}
