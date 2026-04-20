import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  template: `
    <div class="ui-layout">
      <aside class="ui-layout__sidebar">
        <ng-content select="[layout-sidebar]"></ng-content>
      </aside>

      <div class="ui-layout__main">
        <header class="ui-layout__header">
          <ng-content select="[layout-header]"></ng-content>
        </header>

        <section class="ui-layout__content">
          <ng-content></ng-content>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .ui-layout {
      display: flex;
      min-height: 100vh;
      color: var(--kv-text);
    }
    .ui-layout__sidebar {
      width: 280px;
      flex: 0 0 280px;
      min-height: 100vh;
    }
    .ui-layout__main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .ui-layout__header {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ui-layout__content {
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 1080px) {
      .ui-layout {
        flex-direction: column;
      }
      .ui-layout__sidebar {
        width: 100%;
        flex: none;
        min-height: auto;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseLayoutComponent {}
