import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-track-map',
  template: `
    <section class="track-panel">
      @if (mode === 'osm') {
        @if (osmMap) {
          <svg [attr.viewBox]="osmMap.viewBox" class="track-map osm-map" aria-label="Carte OSM du circuit">
            @for (tile of osmMap.tiles; track tile.url) {
              <image
                class="osm-tile"
                [attr.href]="tile.url"
                [attr.x]="tile.x"
                [attr.y]="tile.y"
                [attr.width]="tile.size"
                [attr.height]="tile.size"
              ></image>
            }
            <path class="osm-track-halo" [attr.d]="osmMap.trackPath"></path>
            <path class="osm-track-line" [attr.d]="osmMap.trackPath"></path>
            @for (segment of osmMap.trackSegments; track segment.path) {
              <path
                class="strategy-segment osm-strategy-segment"
                [attr.d]="segment.path"
                [attr.stroke]="segment.color"
              ></path>
            }
            @if (osmMap.vehiclePoint) {
              <circle
                class="vehicle-dot"
                [attr.cx]="osmMap.vehiclePoint.x"
                [attr.cy]="osmMap.vehiclePoint.y"
                r="21"
              ></circle>
            }
            @if (osmMap.ghostPoint) {
              <circle
                class="ghost-dot"
                [attr.cx]="osmMap.ghostPoint.x"
                [attr.cy]="osmMap.ghostPoint.y"
                r="21"
              ></circle>
            }
          </svg>
        } @else {
          <div class="track-empty">
            <span>Carte OSM indisponible</span>
          </div>
        }
      } @else if (trackPath) {
        <svg viewBox="0 0 100 100" class="track-map" aria-label="Trace circuit">
          <path class="track-shadow" [attr.d]="trackPath"></path>
          <path class="track-line" [attr.d]="trackPath"></path>
          @for (segment of trackSegments; track segment.path) {
            <path
              class="strategy-segment"
              [attr.d]="segment.path"
              [attr.stroke]="segment.color"
            ></path>
          }
          @if (vehiclePoint) {
            <circle
              class="vehicle-dot"
              [attr.cx]="vehiclePoint.x"
              [attr.cy]="vehiclePoint.y"
              r="2.8"
            ></circle>
          }
          @if (ghostPoint) {
            <circle
              class="ghost-dot"
              [attr.cx]="ghostPoint.x"
              [attr.cy]="ghostPoint.y"
              r="2.8"
            ></circle>
          }
        </svg>
      } @else {
        <div class="track-empty">
          <span>Trace circuit indisponible</span>
        </div>
      }

      @if (mode === 'osm' ? !osmMap?.vehiclePoint : !vehiclePoint) {
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

    @media (min-width: 992px) {
      :host {
        height: 100%;
      }

      .track-panel {
        border-color: #f27032;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        min-height: 0;
        height: 100%;
      }
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
      width: min(98%, 60rem);
      height: auto;
      aspect-ratio: 1.8;
      overflow: visible;
    }

    .track-shadow,
    .track-line,
    .osm-track-halo,
    .osm-track-line {
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

    .osm-map {
      border-radius: 6px;
      background: #d5d9d4;
      box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.32);
      overflow: hidden;
    }

    .osm-tile {
      image-rendering: auto;
    }

    .osm-track-halo {
      stroke: rgba(255, 255, 255, 0.88);
      stroke-width: 48;
    }

    .osm-track-line {
      stroke: #050505;
      stroke-width: 24;
    }

    .strategy-segment {
      position: relative;
      fill: none;
      stroke-width: 3.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .osm-strategy-segment {
      stroke-width: 27;
    }

    .vehicle-dot {
      fill: #e60000;
      stroke: #ffffff;
      stroke-width: 0.7;
      filter: drop-shadow(0 0 0.35rem rgba(230, 0, 0, 0.9));
    }

    .ghost-dot {
      fill: rgba(178, 65, 214, 0.52);
      stroke: #ffffff;
      stroke-width: 0.7;
      filter: drop-shadow(0 0 0.35rem rgba(178, 65, 214, 0.64));
    }

    .osm-map .vehicle-dot,
    .osm-map .ghost-dot {
      stroke-width: 4;
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
        width: min(96%, 32rem);
      }

      .track-shadow {
        stroke-width: 6.1;
      }

      .track-line {
        stroke-width: 4;
      }

      .strategy-segment {
        stroke-width: 4.6;
      }

      .osm-track-halo {
        stroke-width: 54;
      }

      .osm-track-line {
        stroke-width: 30;
      }

      .osm-strategy-segment {
        stroke-width: 33;
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
  @Input() mode: 'circuit' | 'osm' = 'circuit';
  @Input() trackPath: string | null = null;
  @Input() trackSegments: Array<{ path: string; color: string }> = [];
  @Input() osmMap: {
    viewBox: string;
    tiles: Array<{ url: string; x: number; y: number; size: number }>;
    trackPath: string;
    trackSegments: Array<{ path: string; color: string }>;
    vehiclePoint: { x: number; y: number } | null;
    ghostPoint: { x: number; y: number } | null;
  } | null = null;
  @Input() vehiclePoint: { x: number; y: number } | null = null;
  @Input() ghostPoint: { x: number; y: number } | null = null;
}
