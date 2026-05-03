import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Contact } from '../../../core/models/contact.model';
import { BaseBadgeComponent } from '../ui/base-badge/base-badge';
import { BaseButtonComponent } from '../ui/base-button/base-button';

@Component({
  selector: 'app-contact-table',
  standalone: true,
  imports: [CommonModule, DatePipe, BaseBadgeComponent, BaseButtonComponent],
  templateUrl: './contact-table.component.html',
  styleUrl: './contact-table.component.scss'
})
export class ContactTableComponent {
  contacts = input.required<Contact[]>();
  reply = output<Contact>();

  getStatusTone(contact: Contact): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (contact.status) {
      case 'NEW': return 'info';
      case 'REPLIED': return 'success';
      case 'PENDING': return 'warning';
      default: return 'neutral';
    }
  }

  getStatusLabel(contact: Contact): string {
    switch (contact.status) {
      case 'NEW': return 'Mới';
      case 'REPLIED': return 'Đã phản hồi';
      case 'PENDING': return 'Đang xử lý';
      default: return contact.status;
    }
  }
}
