import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  template: `
    <section class="ui-card" [class.ui-card--compact]="compact()" [class.ui-card--flat]="flat()">
      @if (title() || subtitle()) {
        <header class="ui-card__header">
          <div>
            @if (title()) {
              <h2 class="ui-card__title">{{ title() }}</h2>
            }
            @if (subtitle()) {
              <p class="ui-card__subtitle">{{ subtitle() }}</p>
            }
          </div>
          <div class="ui-card__actions">
            <ng-content select="[card-actions]"></ng-content>
          </div>
        </header>
      }
      <div class="ui-card__body">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .ui-card {
      border-radius: var(--kv-radius-lg, 20px);
      background: linear-gradient(180deg, rgba(16, 28, 50, 0.92) 0%, rgba(12, 23, 42, 0.92) 100%);
      box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.24), 0 12px 28px rgba(3, 8, 20, 0.28);
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }
    .ui-card:hover {
      box-shadow: inset 0 0 0 1px rgba(143, 245, 255, 0.15), 0 16px 36px rgba(3, 8, 20, 0.35);
    }
    .ui-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      padding: 24px 24px 0;
    }
    .ui-card__title { margin: 0; font-size: 1.1rem; font-weight: 700; letter-spacing: -0.01em; }
    .ui-card__subtitle { margin: 8px 0 0; color: var(--kv-text-muted); font-size: 0.95rem; line-height: 1.5; }
    .ui-card__body { padding: 24px; }
    .ui-card--compact .ui-card__body { padding: 16px; }
    .ui-card--flat { box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.2); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCardComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly compact = input(false);
  readonly flat = input(false);
}