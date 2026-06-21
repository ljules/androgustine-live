import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-debug-panel',
  imports: [JsonPipe],
  template: `
    <section class="debug-panel">
      <div class="debug-title">Debug Firestore session courante</div>
      <pre>{{ data | json }}</pre>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .debug-panel {
      margin-top: 1rem;
      border: 1px solid rgba(36, 247, 255, 0.36);
      border-radius: 8px;
      background: rgba(0, 8, 12, 0.72);
      color: #d8f7ff;
    }

    .debug-title {
      border-bottom: 1px solid rgba(36, 247, 255, 0.22);
      padding: 0.65rem 0.85rem;
      color: #24f7ff;
      font-weight: 800;
    }

    pre {
      max-height: 18rem;
      margin: 0;
      padding: 0.85rem;
      overflow: auto;
      color: #ffffff;
      font-family: Consolas, 'Courier New', monospace;
      font-size: 0.85rem;
      white-space: pre-wrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugPanelComponent {
  @Input() data: unknown;
}
