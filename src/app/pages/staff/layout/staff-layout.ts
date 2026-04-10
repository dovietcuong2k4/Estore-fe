import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.scss'
})
export class StaffLayoutComponent {
  constructor(public auth: AuthService) {}
}
