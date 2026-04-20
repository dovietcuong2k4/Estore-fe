import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-badge',
  template: `
    <span class="ui-badge" [class.ui-badge--success]="tone() === 'success'" [class.ui-badge--warning]="tone() === 'warning'" [class.ui-badge--error]="tone() === 'error'" [class.ui-badge--info]="tone() === 'info'" [class.ui-badge--neutral]="tone() === 'neutral'">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .ui-badge--success { color: #2ca56f; background: rgba(44, 165, 111, 0.14); box-shadow: inset 0 0 0 1px rgba(44, 165, 111, 0.3); }
    .ui-badge--warning { color: #d0a420; background: rgba(208, 164, 32, 0.15); box-shadow: inset 0 0 0 1px rgba(208, 164, 32, 0.28); }
    .ui-badge--error { color: #de6e7a; background: rgba(220, 53, 69, 0.15); box-shadow: inset 0 0 0 1px rgba(220, 53, 69, 0.26); }
    .ui-badge--info { color: #7cb6ff; background: rgba(110, 168, 254, 0.16); box-shadow: inset 0 0 0 1px rgba(110, 168, 254, 0.28); }
    .ui-badge--neutral { color: #9aa5bf; background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.28); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseBadgeComponent {
  readonly tone = input<'success' | 'warning' | 'error' | 'info' | 'neutral'>('neutral');
}