import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  private getRedirectPath(): string {
    if (this.auth.isAdmin()) return '/admin';
    if (this.auth.isStaff()) return '/staff';
    if (this.auth.isShipper()) return '/shipper';
    return '/';
  }

  async login() {
    if (!this.email || !this.password) {
      this.error.set('Vui lòng nhập email và mật khẩu');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const result = await this.auth.login({ email: this.email, password: this.password });
    this.loading.set(false);

    if (result.success) {
      this.router.navigate([this.getRedirectPath()]);
    } else {
      this.error.set(result.message);
    }
  }
}
