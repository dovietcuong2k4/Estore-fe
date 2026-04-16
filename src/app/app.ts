import { Component } from '@angular/core';
import { RouterOutlet, RouterEvent, NavigationEnd, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  constructor(private router: Router) {
    // Scroll to top on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
}
