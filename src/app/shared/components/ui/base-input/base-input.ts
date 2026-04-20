import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-base-input',
  template: `
    <label class="ui-field">
      @if (label()) {
        <span class="ui-field__label">{{ label() }} @if (required()) { <span class="ui-field__required">*</span> }</span>
      }
      <input
        class="ui-field__control"
        [attr.id]="id()"
        [attr.type]="type()"
        [attr.placeholder]="placeholder()"
        [attr.autocomplete]="autocomplete()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="valueChange.emit(($any($event.target)).value)"
      />
      @if (hint()) {
        <span class="ui-field__hint">{{ hint() }}</span>
      }
    </label>
  `,
  styles: [`
    :host { display: block; }
    .ui-field { display: grid; gap: 8px; }
    .ui-field__label { color: var(--kv-text); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.02em; }
    .ui-field__required { color: #fbbf24; }
    .ui-field__control {
      min-height: 40px;
      border-radius: 12px;
      background: rgba(6, 15, 29, 0.6);
      border: 1px solid rgba(94, 108, 138, 0.4);
      padding: 0 12px;
      color: var(--kv-text);
      transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
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
export class BaseInputComponent {
  readonly id = input('');
  readonly label = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly value = input('');
  readonly hint = input('');
  readonly required = input(false);
  readonly disabled = input(false);

  readonly valueChange = output<string>();
}