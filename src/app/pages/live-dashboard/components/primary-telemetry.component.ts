import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-telemetry',
  imports: [DecimalPipe],
  template: `
    <section class="primary-telemetry">
      <article class="metric metric-lap">
        <img src="assets/icons/ico_loop.png" alt="" />
        <strong>{{ currentLap ?? '--' }}/{{ totalLaps ?? '--' }}</strong>
        <span>Tours</span>
      </article>

      <article class="metric metric-time">
        <img src="assets/icons/ico_timer.png" alt="" />
        <strong>{{ chrono }}</strong>
        <span>Chrono</span>
      </article>

      <article class="speed">
        <strong>{{ speed ?? 0 | number: '1.0-1' }}</strong>
        <span>km/h</span>
      </article>

      <article class="metric metric-instruction">
        <img src="assets/icons/ico_speed_meter.png" alt="" />
        <strong>{{ instructionLabel }}</strong>
        <span>Consigne</span>
      </article>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .primary-telemetry {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem;
    }

    .metric,
    .speed {
      min-height: 7.8rem;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    .metric {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-areas:
        'icon value'
        'label label';
      align-items: center;
      gap: 0 0.75rem;
      padding: 0.95rem;
    }

    .metric img {
      grid-area: icon;
      width: clamp(2.1rem, 5vw, 3.35rem);
      height: clamp(2.1rem, 5vw, 3.35rem);
      object-fit: contain;
    }

    .metric strong {
      grid-area: value;
      font-size: clamp(1.65rem, 5vw, 3rem);
      font-weight: 800;
      line-height: 1;
    }

    .metric span {
      grid-area: label;
      color: #d8f7ff;
      font-size: 1rem;
    }

    .speed {
      display: flex;
      grid-column: 1 / -1;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      min-height: 9.2rem;
    }

    .speed strong {
      font-size: clamp(4.8rem, 18vw, 8rem);
      font-weight: 800;
      line-height: 0.8;
    }

    .speed span {
      align-self: end;
      margin-bottom: 1.35rem;
      color: #f27032;
      font-size: clamp(1.45rem, 4vw, 2.5rem);
      font-weight: 800;
    }

    @media (min-width: 768px) {
      .primary-telemetry {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }

      .speed {
        grid-column: span 2;
        min-height: 8.4rem;
      }
    }

    @media (max-width: 991.98px) {
      .primary-telemetry {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.7rem;
      }

      .metric,
      .speed {
        border-color: rgba(242, 112, 50, 0.34);
        background: rgba(0, 12, 17, 0.32);
      }

      .metric {
        min-height: 5.6rem;
        padding: 0.75rem;
      }

      .metric img {
        width: clamp(2.35rem, 11vw, 3.25rem);
        height: clamp(2.35rem, 11vw, 3.25rem);
      }

      .metric strong {
        font-size: clamp(2rem, 9vw, 3.25rem);
      }

      .metric span {
        color: #ffffff;
        font-size: 0.8rem;
      }

      .metric-instruction {
        display: none;
      }

      .speed {
        grid-column: 1 / -1;
        min-height: clamp(11rem, 36vh, 17rem);
        border: 0;
        background: transparent;
        box-shadow: none;
      }

      .speed strong {
        font-size: clamp(7.5rem, 36vw, 14rem);
        text-shadow: 0 0 1.25rem rgba(0, 0, 0, 0.55);
      }

      .speed span {
        align-self: center;
        margin: 1.4rem 0 0;
        font-size: clamp(2rem, 8vw, 3.2rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryTelemetryComponent {
  @Input() currentLap: number | null = null;
  @Input() totalLaps: number | null = null;
  @Input() chrono = '--:--';
  @Input() speed: number | null = null;
  @Input() instructionLabel = '--';
}
