import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  template: `
    <section class="ui-filter-bar">
      <div class="ui-filter-bar__copy">
        @if (title()) {
          <h3 class="ui-filter-bar__title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="ui-filter-bar__subtitle">{{ subtitle() }}</p>
        }
      </div>

      <div class="ui-filter-bar__fields">
        <ng-content select="[filter-fields]"></ng-content>
      </div>

      <div class="ui-filter-bar__actions">
        <ng-content select="[filter-actions]"></ng-content>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .ui-filter-bar {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.2fr) auto;
      gap: 16px 24px;
      align-items: end;
      padding: 24px;
      border-radius: var(--kv-radius-lg, 20px);
      background: rgba(13, 24, 45, 0.8);
      box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.24);
      transition: box-shadow 0.3s ease;
    }
    .ui-filter-bar:hover {
      box-shadow: inset 0 0 0 1px rgba(143, 245, 255, 0.15), 0 8px 24px rgba(3, 8, 20, 0.25);
    }
    .ui-filter-bar__title { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .ui-filter-bar__subtitle { margin: 8px 0 0; color: var(--kv-text-muted); font-size: 0.95rem; }
    .ui-filter-bar__fields {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .ui-filter-bar__actions { display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
    @media (max-width: 980px) {
      .ui-filter-bar { grid-template-columns: 1fr; }
      .ui-filter-bar__actions { justify-content: flex-start; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarComponent {
  readonly title = input('');
  readonly subtitle = input('');
}