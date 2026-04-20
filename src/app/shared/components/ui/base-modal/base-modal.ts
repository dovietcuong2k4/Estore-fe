import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="ui-modal__backdrop" (click)="close.emit()">
        <section class="ui-modal" [class.ui-modal--lg]="size() === 'lg'" [class.ui-modal--xl]="size() === 'xl'" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <header class="ui-modal__header">
            <div>
              @if (eyebrow()) {
                <p class="ui-modal__eyebrow">{{ eyebrow() }}</p>
              }
              <h2 class="ui-modal__title">{{ title() }}</h2>
              @if (subtitle()) {
                <p class="ui-modal__subtitle">{{ subtitle() }}</p>
              }
            </div>
            <button type="button" class="ui-modal__close" (click)="close.emit()" aria-label="Đóng hộp thoại">×</button>
          </header>

          <div class="ui-modal__body">
            <ng-content select="[modal-body]"></ng-content>
          </div>

          @if (showFooter()) {
            <footer class="ui-modal__footer">
              <ng-content select="[modal-footer]"></ng-content>
            </footer>
          }
        </section>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .ui-modal__backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(4, 10, 22, 0.68);
      backdrop-filter: blur(20px);
      animation: modalFade 0.18s ease-out;
    }
    .ui-modal {
      width: min(100%, 720px);
      border-radius: 24px;
      background: rgba(13, 24, 45, 0.98);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.42), inset 0 0 0 1px rgba(94, 108, 138, 0.32);
      overflow: hidden;
      animation: modalRise 0.22s ease-out;
    }
    .ui-modal--lg { width: min(100%, 880px); }
    .ui-modal--xl { width: min(100%, 1060px); }
    .ui-modal__header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 32px 32px 24px;
      border-bottom: 1px solid rgba(94, 108, 138, 0.15);
    }
    .ui-modal__eyebrow {
      margin: 0 0 0.45rem;
      color: var(--kv-secondary);
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .ui-modal__title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .ui-modal__subtitle {
      margin: 8px 0 0;
      color: var(--kv-text-muted);
      line-height: 1.5;
      font-size: 0.88rem;
    }
    .ui-modal__close {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--kv-text);
      font-size: 1.4rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .ui-modal__close:hover { background: rgba(255, 255, 255, 0.08); }
    .ui-modal__body { padding: 32px; }
    .ui-modal__footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px 32px 32px;
      border-top: 1px solid rgba(94, 108, 138, 0.15);
    }
    @keyframes modalFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalRise {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly subtitle = input('');
  readonly eyebrow = input('');
  readonly size = input<'md' | 'lg' | 'xl'>('md');
  readonly showFooter = input(true);

  readonly close = output<void>();
}