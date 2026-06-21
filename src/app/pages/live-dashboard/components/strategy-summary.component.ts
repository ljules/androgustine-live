import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-strategy-summary',
  template: `
    <section class="strategy-summary">
      <span>Strategie</span>
      <strong>{{ strategyLabel }}</strong>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .strategy-summary {
      display: flex;
      min-height: 4.4rem;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      padding: 0.9rem 1rem;
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    @media (min-width: 992px) {
      .strategy-summary {
        border-color: #f27032;
      }
    }

    span {
      color: #d8f7ff;
      font-size: clamp(0.86rem, 1.5vw, 1.08rem);
    }

    strong {
      color: #00c90c;
      font-size: clamp(1.08rem, 2.15vw, 1.62rem);
      font-weight: 800;
      text-align: right;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategySummaryComponent {
  @Input() strategyLabel = '--';
}
