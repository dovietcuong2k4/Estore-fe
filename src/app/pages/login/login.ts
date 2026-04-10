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
  
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.error.set('Vui lòng nhập email và mật khẩu');
      return;
    }

    const result = this.auth.login({ email: this.email, password: this.password });
    if (result.success) {
      this.router.navigate(['/']);
    } else {
      this.error.set(result.message);
    }
  }
}
