import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-secondary-metrics',
  imports: [DecimalPipe],
  template: `
    <section class="secondary-metrics">
      <article class="metric">
        <span class="metric-icon">🌡</span>
        <strong>{{ temperature === null ? '--' : (temperature | number: '1.1-1') }} °C</strong>
      </article>
      <article class="metric">
        <span class="metric-icon">💨</span>
        <strong>{{ windSpeed === null ? '--' : (windSpeed | number: '1.1-1') }} km/h</strong>
      </article>
      <article class="metric">
        <span class="metric-icon">💧</span>
        <strong>{{ rainProbability === null ? '--' : (rainProbability | number: '1.0-0') }} %</strong>
      </article>
      <article class="metric">
        <img src="assets/icons/heart.png" alt="" />
        <strong>{{ heartRate ?? '--' }} bpm</strong>
      </article>
      <article class="metric">
        <img src="assets/icons/ico_energy.png" alt="" />
        <strong>{{ energy ?? 0 | number: '1.0-0' }} J</strong>
      </article>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .secondary-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
      gap: 0.85rem;
    }

    .metric {
      display: flex;
      min-height: 5.4rem;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      padding: 0.8rem;
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    @media (min-width: 992px) {
      .secondary-metrics {
        grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      }

      .metric {
        border-color: #f27032;
      }
    }

    .metric img {
      width: 2.2rem;
      height: 2.2rem;
      object-fit: contain;
    }

    .metric-icon {
      color: #f27032;
      font-weight: 800;
    }

    .metric strong {
      font-size: clamp(1.05rem, 2.4vw, 1.55rem);
      line-height: 1;
      text-align: center;
    }

    @media (max-width: 767.98px) {
      .secondary-metrics {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0;
        border-block: 1px solid #f27032;
        padding-block: 0.55rem;
      }

      .metric:nth-child(n + 5) {
        display: none;
      }

      .metric {
        min-height: 2.6rem;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        padding: 0.2rem;
        gap: 0.35rem;
      }

      .metric-icon {
        min-width: 1.1rem;
        font-size: 1.05rem;
        text-align: center;
      }

      .metric img {
        width: 1.15rem;
        height: 1.15rem;
      }

      .metric strong {
        font-size: clamp(0.74rem, 3.45vw, 1.08rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryMetricsComponent {
  @Input() temperature: number | null = null;
  @Input() windSpeed: number | null = null;
  @Input() rainProbability: number | null = null;
  @Input() heartRate: number | null = null;
  @Input() energy: number | null = null;
}
