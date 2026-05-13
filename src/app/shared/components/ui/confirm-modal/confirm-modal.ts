import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BaseModalComponent } from '../base-modal/base-modal';
import { BaseButtonComponent } from '../base-button/base-button';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [BaseModalComponent, BaseButtonComponent],
  template: `
    <app-base-modal
      [open]="isOpen()"
      [title]="title()"
      [eyebrow]="eyebrow()"
      size="sm"
      (close)="cancel.emit()"
    >
      <div modal-body>
        <p class="confirm-modal__message">{{ message() }}</p>
      </div>
      <div modal-footer class="confirm-modal__footer">
        <app-base-button variant="ghost" (clicked)="cancel.emit()">
          {{ cancelText() }}
        </app-base-button>
        <app-base-button [variant]="confirmVariant()" [disabled]="confirmDisabled()" (clicked)="confirm.emit()">
          {{ confirmText() }}
        </app-base-button>
      </div>
    </app-base-modal>
  `,
  styles: [`
    .confirm-modal__message {
      margin: 0;
      color: var(--kv-text-muted);
      line-height: 1.5;
      font-size: 0.9rem;
    }
    .confirm-modal__message:not(:last-child) {
      margin-bottom: 20px;
    }
    .confirm-modal__footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
  readonly isOpen = input(false);
  readonly title = input('Xác nhận xóa');
  readonly message = input('Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.');
  readonly eyebrow = input('Cảnh báo');
  readonly confirmText = input('Xác nhận xóa');
  readonly cancelText = input('Hủy');
  readonly confirmDisabled = input(false);
  readonly confirmVariant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
