import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-race-state-panel',
  imports: [NgClass],
  template: `
    <section class="race-state-panel">
      <div class="state-list">
        <span class="state-badge state-course" [ngClass]="{ active: raceStateKey === 'course' }">
          Course
        </span>
        <span
          class="state-badge state-warning"
          [ngClass]="{ active: raceStateKey === 'ne_pas_doubler' }"
        >
          Ne pas doubler
        </span>
        <span class="state-badge state-stop" [ngClass]="{ active: raceStateKey === 'stop' }">
          Stop
        </span>
      </div>

      <div class="stands-row">
        <img src="assets/icons/ico_stands.png" alt="" />
        <span class="stands-label">stands</span>
        <span class="stands-toggle" [ngClass]="{ active: pitStop === true, unknown: pitStop === null }">
          {{ pitStop === null ? '--' : pitStop ? 'ON' : 'OFF' }}
        </span>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .race-state-panel {
      display: grid;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      background: rgba(0, 15, 20, 0.38);
      padding: clamp(1rem, 3vw, 2rem);
      box-shadow: inset 0 0 2.2rem rgba(255, 255, 255, 0.04);
    }

    .state-list {
      display: grid;
      gap: 0.85rem;
    }

    .state-badge {
      border: 0.25rem solid currentColor;
      border-radius: 999px;
      padding: 0.65rem 1rem;
      text-align: center;
      font-size: clamp(1.35rem, 4vw, 2.35rem);
      font-weight: 800;
      line-height: 1.1;
      opacity: 0.48;
    }

    .state-badge.active {
      opacity: 1;
      color: #ffffff;
    }

    .state-course {
      color: #00c90c;
    }

    .state-warning {
      color: #ffd000;
    }

    .state-stop {
      color: #d40000;
    }

    .state-course.active {
      background: #00c90c;
    }

    .state-warning.active {
      background: #ffd000;
      color: #041014;
    }

    .state-stop.active {
      background: #d40000;
    }

    .stands-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: #ffffff;
      font-size: clamp(1.3rem, 4vw, 2.5rem);
      font-weight: 800;
    }

    .stands-row img {
      width: clamp(2.5rem, 6vw, 4.5rem);
      height: clamp(2.5rem, 6vw, 4.5rem);
      object-fit: contain;
    }

    .stands-toggle {
      min-width: 5.5rem;
      border: 0.25rem solid #f27032;
      border-radius: 999px;
      padding: 0.2rem 0.75rem;
      color: #f27032;
      font-size: clamp(1rem, 2.6vw, 1.35rem);
      text-align: center;
    }

    .stands-toggle.active {
      border-color: #00c90c;
      color: #00c90c;
    }

    .stands-toggle.unknown {
      opacity: 0.6;
    }

    @media (max-width: 991.98px) {
      .race-state-panel {
        gap: 0.55rem;
        border: 0;
        border-top: 1px solid #f27032;
        border-radius: 0;
        background: transparent;
        padding: 0.7rem 0 0;
        box-shadow: none;
      }

      .state-list {
        gap: 0.4rem;
      }

      .state-badge {
        width: min(100%, 23rem);
        margin-inline: auto;
        border-width: 0.18rem;
        padding-block: 0.26rem;
        font-size: clamp(0.85rem, 3.2vw, 1.2rem);
      }

      .state-badge:not(.active) {
        display: none;
      }

      .stands-row {
        justify-content: center;
        font-size: clamp(1rem, 4.2vw, 1.55rem);
      }

      .stands-row img {
        width: clamp(1.9rem, 7vw, 2.6rem);
        height: clamp(1.9rem, 7vw, 2.6rem);
      }

      .stands-toggle {
        min-width: 3.7rem;
        border-width: 0.18rem;
        font-size: clamp(0.75rem, 2.6vw, 0.95rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceStatePanelComponent {
  @Input() raceStateKey = 'unknown';
  @Input() pitStop: boolean | null = null;
}
