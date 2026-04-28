import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-base-button',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      class="ui-button"
      [class.ui-button--primary]="variant() === 'primary'"
      [class.ui-button--secondary]="variant() === 'secondary'"
      [class.ui-button--ghost]="variant() === 'ghost'"
      [class.ui-button--danger]="variant() === 'danger'"
      [class.ui-button--full]="fullWidth()"
      [attr.type]="type()"
      [disabled]="disabled()"
      (click)="clicked.emit($event)">
      @if (icon()) {
        <app-icon [name]="icon()!" size="18"></app-icon>
      }
      <span class="ui-button__content"><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    .ui-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 40px;
      padding: 0 16px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-size: 0.88rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
      cursor: pointer;
    }
    .ui-button:hover:not(:disabled) { transform: translateY(-1px); }
    .ui-button:disabled { cursor: not-allowed; opacity: 0.55; transform: none; }
    .ui-button--primary {
      background: linear-gradient(135deg, #6ea8fe 0%, #4f8ef7 100%);
      color: #f8fbff;
      box-shadow: 0 8px 20px rgba(79, 142, 247, 0.32);
    }
    .ui-button--primary:hover:not(:disabled) { box-shadow: 0 12px 26px rgba(79, 142, 247, 0.4); }
    .ui-button--secondary {
      background: rgba(255, 255, 255, 0.04);
      color: var(--kv-text);
      border-color: rgba(94, 108, 138, 0.4);
    }
    .ui-button--secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(128, 149, 188, 0.6);
    }
    .ui-button--ghost {
      background: transparent;
      color: var(--kv-text-muted);
      border-color: rgba(94, 108, 138, 0.35);
    }
    .ui-button--ghost:hover:not(:disabled) {
      color: var(--kv-text);
      background: rgba(255, 255, 255, 0.04);
    }
    .ui-button--danger {
      background: rgba(220, 53, 69, 0.16);
      color: #ffc2c9;
      border-color: rgba(220, 53, 69, 0.4);
    }
    .ui-button--danger:hover:not(:disabled) { background: rgba(220, 53, 69, 0.24); }
    .ui-button--full { width: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly icon = input<string | null>(null);
  readonly disabled = input(false);
  readonly fullWidth = input(false);

  readonly clicked = output<MouseEvent>();
}