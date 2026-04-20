import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-table',
  template: `
    <section class="ui-table-card">
      @if (title() || subtitle()) {
        <header class="ui-table-card__header">
          <div>
            @if (title()) {
              <h2 class="ui-table-card__title">{{ title() }}</h2>
            }
            @if (subtitle()) {
              <p class="ui-table-card__subtitle">{{ subtitle() }}</p>
            }
          </div>
          <div class="ui-table-card__actions">
            <ng-content select="[table-actions]"></ng-content>
          </div>
        </header>
      }
      <div class="ui-table-card__body">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .ui-table-card {
      overflow: hidden;
      border-radius: 12px;
      background: linear-gradient(180deg, rgba(16, 28, 50, 0.92) 0%, rgba(12, 23, 42, 0.92) 100%);
      box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.24), 0 12px 28px rgba(3, 8, 20, 0.28);
    }
    .ui-table-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid rgba(94, 108, 138, 0.2);
    }
    .ui-table-card__title { margin: 0; font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; }
    .ui-table-card__subtitle { margin: 8px 0 0; color: var(--kv-text-muted); font-size: 0.9rem; line-height: 1.5; }
    .ui-table-card__body { padding: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseTableComponent {
  readonly title = input('');
  readonly subtitle = input('');
}