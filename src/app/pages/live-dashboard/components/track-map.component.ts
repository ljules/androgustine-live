import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-track-map',
  template: `
    <section class="track-panel">
      @if (trackPath) {
        <svg viewBox="0 0 100 100" class="track-map" aria-label="Trace circuit">
          <path class="track-shadow" [attr.d]="trackPath"></path>
          <path class="track-line" [attr.d]="trackPath"></path>
          @if (vehiclePoint) {
            <circle
              class="vehicle-dot"
              [attr.cx]="vehiclePoint.x"
              [attr.cy]="vehiclePoint.y"
              r="2.8"
            ></circle>
          }
        </svg>
      } @else {
        <div class="track-empty">
          <span>Trace circuit indisponible</span>
        </div>
      }

      @if (!vehiclePoint) {
        <p class="position-note">Position vehicule non disponible</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .track-panel {
      position: relative;
      display: grid;
      min-height: clamp(18rem, 46vw, 35rem);
      height: 100%;
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    .track-panel::before {
      position: absolute;
      inset: auto -12% -48% -12%;
      height: 82%;
      border: 2rem solid rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      content: '';
      transform: rotate(-18deg);
    }

    .track-map {
      position: relative;
      width: min(92%, 52rem);
      height: auto;
      aspect-ratio: 1.8;
      overflow: visible;
    }

    .track-shadow,
    .track-line {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .track-shadow {
      stroke: rgba(0, 0, 0, 0.34);
      stroke-width: 5.2;
      transform: translate(1px, 1px);
    }

    .track-line {
      stroke: #ffffff;
      stroke-width: 3.3;
    }

    .vehicle-dot {
      fill: #f27032;
      stroke: #ffffff;
      stroke-width: 0.7;
      filter: drop-shadow(0 0 0.35rem rgba(242, 112, 50, 0.9));
    }

    .track-empty,
    .position-note {
      position: relative;
      z-index: 1;
      color: #ffffff;
      font-size: clamp(1.3rem, 4vw, 2.7rem);
      font-weight: 700;
      text-align: center;
    }

    .position-note {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      margin: 0;
      color: rgba(255, 255, 255, 0.78);
      font-size: clamp(0.95rem, 2vw, 1.25rem);
    }

    @media (max-width: 991.98px) {
      .track-panel {
        min-height: clamp(11rem, 29vh, 16rem);
        border: 0;
        background: transparent;
        box-shadow: none;
      }

      .track-panel::before {
        display: none;
      }

      .track-map {
        width: min(80%, 24rem);
      }

      .track-shadow {
        stroke-width: 6.1;
      }

      .track-line {
        stroke-width: 4;
      }

      .position-note {
        bottom: 0.45rem;
        color: #ffffff;
        font-size: clamp(1.15rem, 5vw, 1.85rem);
        text-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.75);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMapComponent {
  @Input() trackPath: string | null = null;
  @Input() vehiclePoint: { x: number; y: number } | null = null;
}
