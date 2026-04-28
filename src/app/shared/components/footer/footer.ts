import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../ui/icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
