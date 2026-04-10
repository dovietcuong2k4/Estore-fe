import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  success = signal(false);

  submit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.success.set(true);
      // Giả lập gửi liên hệ
    }
  }
}
