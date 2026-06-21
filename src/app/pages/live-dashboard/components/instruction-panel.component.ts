import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-panel',
  imports: [NgClass],
  template: `
    <section class="instruction-panel">
      <div class="panel-title">Cadence de course :</div>
      <div class="command-row">
        <img class="command-icon" src="assets/icons/ico_speed_meter.png" alt="" />
        <div class="command-badge" [ngClass]="'instruction-' + instructionKey">
          <strong>{{ instructionLabel }}</strong>
        </div>
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

    .panel-title {
      margin-bottom: 0.7rem;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 800;
    }

    .command-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
    }

    .command-icon {
      width: 3.1rem;
      height: 3.1rem;
      object-fit: contain;
    }

    .command-badge {
      flex: 1 1 auto;
      border: 0.25rem solid currentColor;
      border-radius: 999px;
      padding: 0.65rem 1rem;
      text-align: center;
      font-size: clamp(1.7rem, 5vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
    }

    .command-badge strong {
      font: inherit;
      color: inherit;
    }

    .instruction-accelerer {
      color: #d40000;
    }

    .instruction-accelerate {
      color: #d40000;
    }

    .instruction-maintenir {
      color: #00c90c;
    }

    .instruction-maintain {
      color: #00c90c;
    }

    .instruction-ralentir {
      color: #24f7ff;
    }

    .instruction-slow_down {
      color: #24f7ff;
    }

    .instruction-unknown {
      color: rgba(255, 255, 255, 0.65);
    }

    @media (max-width: 991.98px) {
      .instruction-panel {
        border: 2px solid #f27032;
        border-radius: 8px;
        background: rgba(0, 18, 24, 0.18);
        padding: 0.65rem 0.8rem 0.75rem;
        box-shadow: none;
      }

      .panel-title {
        margin-bottom: 0.45rem;
        font-size: clamp(0.82rem, 3vw, 1rem);
      }

      .command-row {
        justify-content: flex-start;
        gap: 0.75rem;
      }

      .command-icon {
        width: clamp(2.4rem, 11vw, 3.4rem);
        height: clamp(2.4rem, 11vw, 3.4rem);
      }

      .command-badge {
        max-width: 13rem;
        border-width: 0.26rem;
        padding: 0.34rem 0.75rem 0.42rem;
        font-size: clamp(1rem, 4.4vw, 1.45rem);
        color: #ffffff;
        text-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.45);
      }

      .instruction-accelerer {
        border-color: #d40000;
        background: #d40000;
      }

      .instruction-accelerate {
        border-color: #d40000;
        background: #d40000;
      }

      .instruction-maintenir {
        border-color: #00c90c;
        background: #00b807;
      }

      .instruction-maintain {
        border-color: #00c90c;
        background: #00b807;
      }

      .instruction-ralentir {
        border-color: #24f7ff;
        background: #009dad;
      }

      .instruction-slow_down {
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
