import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss' // Reusing login styles
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
  
  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.form.fullName || !this.form.email || !this.form.password) {
      this.error.set('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    
    if (this.form.password !== this.confirmPassword) {
      this.error.set('Mật khẩu xác nhận không khớp');
      return;
    }

    const result = this.auth.register(this.form);
    if (result.success) {
      this.router.navigate(['/']);
    } else {
      this.error.set(result.message);
    }
  }
}
