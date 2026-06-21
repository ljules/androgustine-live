import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-race-state-panel',
  imports: [NgClass],
  template: `
    <section class="race-state-panel">
      <div class="situation-panel">
        <div class="panel-title">Situation de course :</div>
        <div class="situation-row">
          <img [src]="raceIcon" alt="" />
          <span class="situation-badge" [ngClass]="'situation-' + raceStateKey">
            {{ raceLabel }}
          </span>
        </div>
      </div>

      <div class="state-list">
        <span
          class="state-badge state-course"
          [ngClass]="{ active: ['course', 'race', 'running'].includes(raceStateKey) }"
        >
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

      <div class="stand-request-panel">
        <div class="panel-title">Demande sortie stands :</div>
        <div class="stand-request-row" [class.is-hidden]="pitStop !== true">
          <img src="assets/icons/ico_stands.png" alt="" />
          <strong>Sortie stands</strong>
        </div>
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

    .stand-request-panel {
      display: none;
    }

    @media (max-width: 991.98px) {
      .race-state-panel {
        border: 2px solid #f27032;
        border-radius: 8px;
        background: rgba(0, 18, 24, 0.18);
        padding: 0.65rem 0.8rem 0.75rem;
      box-shadow: none;
    }

      .panel-title {
        margin-bottom: 0.45rem;
        color: #ffffff;
        font-size: clamp(0.82rem, 3vw, 1rem);
        font-weight: 800;
      }

      .situation-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .situation-row img {
        width: clamp(2.4rem, 11vw, 3.4rem);
        height: clamp(2.4rem, 11vw, 3.4rem);
        object-fit: contain;
      }

      .situation-badge {
        flex: 1 1 auto;
        max-width: 13rem;
        border-radius: 999px;
        padding: 0.34rem 0.75rem 0.42rem;
        color: #ffffff;
        font-size: clamp(1rem, 4.4vw, 1.45rem);
        font-weight: 800;
        line-height: 1.1;
        text-align: center;
      }

      .situation-course {
        background: #00b807;
      }

      .situation-race,
      .situation-running {
        background: #00b807;
      }

      .situation-ne_pas_doubler,
      .situation-no_overtaking {
        background: #ffc400;
        color: #ffffff;
      }

      .situation-stop {
        background: #d40000;
      }

      .state-list {
        display: none;
      }

      .stands-row {
        display: none;
      }

      .stand-request-panel {
        display: none;
      }
    }

    @media (min-width: 992px) {
      .race-state-panel {
        border: 0;
        border-top: 1px solid rgba(242, 112, 50, 0.65);
        border-radius: 0;
        background: transparent;
        padding: 1.25rem 0 0;
        box-shadow: none;
      }

      .situation-panel {
        display: block;
      }

      .panel-title {
        margin-bottom: 1rem;
        color: #ffffff;
        font-size: 1.25rem;
        font-weight: 800;
      }

      .situation-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .situation-row img {
        width: clamp(3.5rem, 5vw, 5rem);
        height: clamp(3.5rem, 5vw, 5rem);
        object-fit: contain;
      }

      .situation-badge {
        flex: 1 1 auto;
        max-width: 26rem;
        border-radius: 999px;
        padding: 0.6rem 1rem 0.72rem;
        color: #ffffff;
        font-size: clamp(1.05rem, 2.2vw, 1.5rem);
        font-weight: 800;
        line-height: 1.1;
        text-align: center;
      }

      .situation-course,
      .situation-race,
      .situation-running {
        background: #00b807;
      }

      .situation-ne_pas_doubler,
      .situation-no_overtaking {
        background: #ffc400;
      }

      .situation-stop {
        background: #d40000;
      }

      .state-list {
        display: none;
      }

      .stands-row {
        display: none;
      }

      .stand-request-panel {
        display: block;
        border-top: 1px solid rgba(242, 112, 50, 0.65);
        padding-top: 1rem;
      }

      .stand-request-row {
        display: flex;
        min-height: 5.4rem;
        align-items: center;
        justify-content: center;
        gap: 0.85rem;
        color: #ffffff;
        font-size: clamp(1.25rem, 2.4vw, 2rem);
        font-weight: 800;
      }

      .stand-request-row.is-hidden {
        visibility: hidden;
      }

      .stand-request-row img {
        width: clamp(3rem, 4.5vw, 4.4rem);
        height: clamp(3rem, 4.5vw, 4.4rem);
        object-fit: contain;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceStatePanelComponent {
  @Input() raceStateKey = 'unknown';
  @Input() pitStop: boolean | null = null;

  get raceLabel(): string {
    if (['course', 'race', 'running'].includes(this.raceStateKey)) {
      return 'Course';
    }
    if (this.raceStateKey === 'ne_pas_doubler' || this.raceStateKey === 'no_overtaking') {
      return 'Ne pas doubler';
    }
    if (this.raceStateKey === 'stop') {
      return 'Stop';
    }
    return '--';
  }

  get raceIcon(): string {
    if (['course', 'race', 'running'].includes(this.raceStateKey)) {
      return 'assets/icons/flag_green.png';
    }
    if (this.raceStateKey === 'ne_pas_doubler' || this.raceStateKey === 'no_overtaking') {
      return 'assets/icons/flag_yellow.png';
    }
    if (this.raceStateKey === 'stop') {
      return 'assets/icons/flag_red.png';
    }
    return 'assets/icons/flag_orange.png';
  }
}
