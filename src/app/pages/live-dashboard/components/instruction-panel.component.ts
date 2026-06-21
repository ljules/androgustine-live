import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-panel',
  imports: [NgClass],
  template: `
    <section class="instruction-panel">
      <div class="command-badge" [ngClass]="'instruction-' + instructionKey">
        {{ instructionLabel }}
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .instruction-panel {
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      padding: clamp(1rem, 3vw, 2rem);
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    .command-badge {
      border: 0.25rem solid currentColor;
      border-radius: 999px;
      padding: 0.65rem 1rem;
      text-align: center;
      font-size: clamp(1.7rem, 5vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
    }

    .instruction-accelerer {
      color: #d40000;
    }

    .instruction-maintenir {
      color: #00c90c;
    }

    .instruction-ralentir {
      color: #24f7ff;
    }

    .instruction-unknown {
      color: rgba(255, 255, 255, 0.65);
    }

    @media (max-width: 991.98px) {
      .instruction-panel {
        border: 0;
        background: transparent;
        padding: 0.2rem 0;
        box-shadow: none;
      }

      .command-badge {
        width: min(100%, 31rem);
        margin-inline: auto;
        border-width: 0.26rem;
        padding: 0.65rem 1rem 0.78rem;
        font-size: clamp(2rem, 10vw, 3.7rem);
        text-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.45);
      }

      .instruction-maintenir {
        border-color: #00c90c;
        background: #00b807;
        color: #ffffff;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionPanelComponent {
  @Input() instructionLabel = '--';
  @Input() instructionKey = 'unknown';
}
