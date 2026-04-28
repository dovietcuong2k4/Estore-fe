import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../ui/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);
  searchQuery = signal('');

  readonly cartCount = computed(() => this.cartService.totalItems());
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  readonly user = computed(() => this.auth.user());
  readonly isAdmin = computed(() => this.auth.isAdmin() || this.auth.isStaff());

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
  }

  logout() {
    this.auth.logout();
    this.userMenuOpen.set(false);
  }

  onSearch(event: Event) {
  event.preventDefault();

  this.router.navigate(['/products'], {
    queryParams: {
      search: this.searchQuery()
    }
  });
}
}
