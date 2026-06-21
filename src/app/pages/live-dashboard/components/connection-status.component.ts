import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-connection-status',
  imports: [NgClass],
  template: `
    <div class="connection" [ngClass]="{ online: connected, offline: !connected }">
      <span class="connection-dot"></span>
      <span>{{ statusLabel }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .connection {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      font-size: clamp(1rem, 2vw, 1.5rem);
      font-weight: 700;
      letter-spacing: 0;
    }

    .connection-dot {
      width: 0.9rem;
      height: 0.9rem;
      flex: 0 0 auto;
      border-radius: 50%;
      background: #d40000;
      box-shadow: 0 0 1rem currentColor;
    }

    .connection.online .connection-dot {
      background: #00c90c;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionStatusComponent {
  @Input() connected = false;
  @Input() connectionState: string | null | undefined;

  get statusLabel(): string {
    if (this.connectionState === 'NoSession') {
      return 'En attente de session';
    }
    if (this.connectionState === 'WaitingForTelemetry') {
      return 'Session active - attente telemetrie';
    }
    if (this.connectionState === 'Error') {
      return 'Erreur Firestore';
    }
    return this.connected ? 'Connecte - session Firestore active' : 'Connexion Firestore...';
  }
}
