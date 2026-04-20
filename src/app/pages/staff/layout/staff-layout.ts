import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';

@Component({
  selector: 'app-staff-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BaseButtonComponent, BaseInputComponent],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffLayoutComponent {
  constructor(public auth: AuthService) {}
}
