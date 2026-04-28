import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss'
})
export class RegisterComponent {
  form: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  };
  confirmPassword = '';
  
  error = signal('');
  loading = signal(false);
  
  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    if (!this.form.fullName || !this.form.email || !this.form.password) {
      this.error.set('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    
    if (this.form.password !== this.confirmPassword) {
      this.error.set('Mật khẩu xác nhận không khớp');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const result = await this.auth.register(this.form);
    this.loading.set(false);

    if (result.success) {
      this.router.navigate(['/login']);
    } else {
      this.error.set(result.message);
    }
  }
}
