import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';
import { ContactTableComponent } from '../../../shared/components/contact-table/contact-table.component';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { BaseTabsComponent, TabOption } from '../../../shared/components/ui/base-tabs/base-tabs';
import { BaseTableComponent } from '../../../shared/components/ui/base-table/base-table';

@Component({
  selector: 'app-contact-mgmt',
  standalone: true,
  imports: [
    CommonModule,
    ContactTableComponent,
    FilterBarComponent,
    BaseInputComponent,
    BaseTabsComponent,
    BaseTableComponent
  ],
  templateUrl: './contact-mgmt.html',
  styleUrl: './contact-mgmt.scss'
})
export class ContactMgmtComponent implements OnInit {
  contacts = signal<Contact[]>([]);
  searchTerm = signal('');
  statusFilter = signal('ALL');

  statusTabs: TabOption[] = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Mới', value: 'NEW' },
    { label: 'Đang xử lý', value: 'PENDING' },
    { label: 'Đã phản hồi', value: 'REPLIED' }
  ];

  filteredContacts = computed(() => {
    let result = this.contacts();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    if (search) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.email.toLowerCase().includes(search) || 
        c.subject.toLowerCase().includes(search) ||
        c.message.toLowerCase().includes(search)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(c => c.status === status);
    }

    return result;
  });

  filteredCount = computed(() => this.filteredContacts().length);

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => this.contacts.set(data),
      error: (err) => console.error('Error loading contacts', err)
    });
  }

  onStatusFilterChanged(value: string | number): void {
    this.statusFilter.set(value.toString());
  }

  onReply(contact: Contact): void {
    // For now, just a placeholder for reply functionality
    console.log('Reply to contact', contact);
  }
}
