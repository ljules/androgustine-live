import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-panel',
  imports: [NgClass],
  template: `
    <section class="instruction-panel">
      <div class="command-badge" [ngClass]="'instruction-' + instructionKey">
        <img src="assets/icons/ico_speed_meter.png" alt="" />
        <span>Cadence :</span>
        <strong>{{ instructionLabel }}</strong>
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
      border: 0.25rem solid currentColor;
      border-radius: 999px;
      padding: 0.65rem 1rem;
      text-align: center;
      font-size: clamp(1.7rem, 5vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
    }

    .command-badge img {
      width: 1.2em;
      height: 1.2em;
      object-fit: contain;
    }

    .command-badge span {
      font-size: 0.55em;
      font-weight: 700;
    }

    .command-badge strong {
      font: inherit;
      color: inherit;
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
        padding: 0.42rem 0.75rem 0.5rem;
        font-size: clamp(1.35rem, 6vw, 2.2rem);
        color: #ffffff;
        text-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.45);
      }

      .instruction-accelerer {
        border-color: #d40000;
        background: #d40000;
      }

      .instruction-maintenir {
        border-color: #00c90c;
        background: #00b807;
      }

      .instruction-ralentir {
        border-color: #24f7ff;
        background: #009dad;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionPanelComponent {
  @Input() instructionLabel = '--';
  @Input() instructionKey = 'unknown';
}
