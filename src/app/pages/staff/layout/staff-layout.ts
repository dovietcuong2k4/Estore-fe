import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BaseButtonComponent } from '../../../shared/components/ui/base-button/base-button';
import { BaseInputComponent } from '../../../shared/components/ui/base-input/base-input';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-staff-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BaseButtonComponent, IconComponent],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffLayoutComponent {
  constructor(public auth: AuthService) {}
}
