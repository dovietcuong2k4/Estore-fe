import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SelectOption = {
  label: string;
  value: string | number;
};

@Component({
  selector: 'app-base-select',
  imports: [FormsModule],
  template: `
    <label class="ui-field">
      @if (label()) {
        <span class="ui-field__label">{{ label() }}</span>
      }
      <select
        class="ui-field__control"
        [attr.id]="id()"
        [disabled]="disabled()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)">
        @for (option of options(); track option.value) {
          <option [ngValue]="option.value">{{ option.label }}</option>
        }
      </select>
      @if (hint()) {
        <span class="ui-field__hint">{{ hint() }}</span>
      }
    </label>
  `,
  styles: [`
    :host { display: block; }
    .ui-field { display: grid; gap: 8px; }
    .ui-field__label { color: var(--kv-text); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.02em; }
    .ui-field__control {
      min-height: 40px;
      border-radius: 12px;
      background: rgba(6, 15, 29, 0.6);
      border: 1px solid rgba(94, 108, 138, 0.4);
      padding: 0 12px;
      color: var(--kv-text);
    }
    .ui-field__control:focus {
      border-color: rgba(110, 168, 254, 0.7);
      box-shadow: 0 0 0 3px rgba(110, 168, 254, 0.18);
      background: rgba(8, 18, 35, 0.9);
    }
    .ui-field__hint { color: var(--kv-text-muted); font-size: 0.82rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseSelectComponent {
  readonly id = input('');
  readonly label = input('');
  readonly value = input<string | number>('');
  readonly disabled = input(false);
  readonly hint = input('');
  readonly options = input<SelectOption[]>([]);

  readonly valueChange = output<string | number>();
}