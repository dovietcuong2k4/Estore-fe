import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shipper-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shipper-layout.html',
  styleUrl: './shipper-layout.scss'
})
export class ShipperLayoutComponent {
  auth = inject(AuthService);
}
