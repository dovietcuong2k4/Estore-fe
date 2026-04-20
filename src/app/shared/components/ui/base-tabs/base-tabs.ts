import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type TabOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-base-tabs',
  template: `
    <div class="ui-tabs" role="tablist">
      @for (tab of tabs(); track tab.value) {
        <button
          type="button"
          role="tab"
          class="ui-tabs__item"
          [attr.aria-selected]="activeValue() === tab.value"
          [class.ui-tabs__item--active]="activeValue() === tab.value"
          (click)="activeValueChange.emit(tab.value)">
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-tabs {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      box-shadow: inset 0 0 0 1px rgba(94, 108, 138, 0.3);
    }
    .ui-tabs__item {
      min-height: 32px;
      padding: 0 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--kv-text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .ui-tabs__item:hover {
      color: var(--kv-text);
      background: rgba(255, 255, 255, 0.05);
    }
    .ui-tabs__item--active {
      color: #cfe2ff;
      background: rgba(110, 168, 254, 0.22);
      box-shadow: inset 0 0 0 1px rgba(110, 168, 254, 0.5);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseTabsComponent {
  readonly tabs = input<TabOption[]>([]);
  readonly activeValue = input('');

  readonly activeValueChange = output<string>();
}
