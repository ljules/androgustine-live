import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-telemetry',
  imports: [DecimalPipe],
  template: `
    <section class="primary-telemetry">
      @if (variant !== 'speed') {
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

        <article class="metric metric-ghost">
          <img src="assets/icons/ghost_distance.png" alt="" />
          <strong>{{ ghostDistance === null ? '--' : (ghostDistance | number: '1.0-0') }} m</strong>
          <span>Ghost</span>
        </article>
      }

      @if (variant !== 'cards') {
        <article class="speed">
          <strong>{{ speed ?? 0 | number: '1.0-0' }}</strong>
          <span>km/h</span>
        </article>

        <article class="pit-exit" [class.is-hidden]="pitStop !== true">
          <img src="assets/icons/ico_stands.png" alt="" />
          <strong>Sortie stands</strong>
        </article>
      }

      @if (variant === 'all') {
        <article class="metric metric-instruction">
          <img src="assets/icons/ico_speed_meter.png" alt="" />
          <strong>{{ instructionLabel }}</strong>
          <span>Consigne</span>
        </article>
      }
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

    .pit-exit {
      display: none;
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

      .metric-instruction {
        display: none;
      }
    }

    @media (min-width: 992px) {
      .metric,
      .speed {
        border-color: #f27032;
      }
    }

    @media (max-width: 991.98px) {
      .primary-telemetry {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.7rem;
      }

      .metric,
      .speed {
        border-color: rgba(242, 112, 50, 0.34);
        background: rgba(0, 12, 17, 0.32);
      }

      .metric {
        min-height: 4.25rem;
        padding: 0.55rem;
        gap: 0 0.45rem;
      }

      .metric img {
        width: clamp(1.7rem, 7.4vw, 2.25rem);
        height: clamp(1.7rem, 7.4vw, 2.25rem);
      }

      .metric strong {
        font-size: clamp(1.35rem, 6vw, 2.1rem);
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
        min-height: clamp(5.8rem, 16vh, 8rem);
        border: 0;
        background: transparent;
        box-shadow: none;
      }

      .speed strong {
        font-size: clamp(4.2rem, 18vw, 7rem);
        text-shadow: 0 0 1.25rem rgba(0, 0, 0, 0.55);
      }

      .speed span {
        align-self: center;
        margin: 0.75rem 0 0;
        font-size: clamp(1.3rem, 4.2vw, 2rem);
      }

      .pit-exit {
        display: flex;
        grid-column: 1 / -1;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 2.65rem;
        margin-top: -0.75rem;
        color: #ffffff;
        font-size: clamp(1.05rem, 4.6vw, 1.6rem);
        font-weight: 800;
      }

      .pit-exit.is-hidden {
        visibility: hidden;
      }

      .pit-exit img {
        width: clamp(1.8rem, 7.4vw, 2.5rem);
        height: clamp(1.8rem, 7.4vw, 2.5rem);
        object-fit: contain;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryTelemetryComponent {
  @Input() variant: 'all' | 'cards' | 'speed' = 'all';
  @Input() currentLap: number | null = null;
  @Input() totalLaps: number | null = null;
  @Input() chrono = '--:--';
  @Input() speed: number | null = null;
  @Input() instructionLabel = '--';
  @Input() ghostDistance: number | null = null;
  @Input() pitStop: boolean | null = null;
}
