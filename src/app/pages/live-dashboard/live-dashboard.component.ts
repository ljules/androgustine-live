import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import {
  CopilotInstruction,
  RaceState,
  StrategyMode,
  Telemetry,
  TrackPoint,
  VehiclePosition,
} from '../../models/telemetry.model';
import { TelemetryService } from '../../services/telemetry.service';

interface DashboardViewModel {
  telemetry: Telemetry | null;
  connected: boolean;
  error?: string;
  currentLap: number | null;
  totalLaps: number | null;
  chrono: string;
  speed: number | null;
  temperature: number | null;
  windSpeed: number | null;
  rainProbability: number | null;
  heartRate: number | null;
  energy: number | null;
  strategy: StrategyMode | null;
  instruction: CopilotInstruction | null;
  raceState: RaceState | null;
  pitStop: boolean | null;
  trackPath: string | null;
  vehiclePoint: { x: number; y: number } | null;
}

@Component({
  selector: 'app-live-dashboard',
  imports: [AsyncPipe, DecimalPipe, NgClass],
  templateUrl: './live-dashboard.component.html',
  styleUrl: './live-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveDashboardComponent {
  private readonly telemetryService = inject(TelemetryService);

  readonly vm$ = this.telemetryService.latest$.pipe(
    map((snapshot): DashboardViewModel => {
      const telemetry = snapshot.data;
      const trackPoints = this.trackPoints(telemetry);
      const normalizedTrack = this.normalizeTrack(trackPoints);

      return {
        telemetry,
        connected: snapshot.connected,
        error: snapshot.error,
        currentLap: this.firstNumber(telemetry?.currentLap, telemetry?.lap),
        totalLaps: this.firstNumber(telemetry?.totalLaps, telemetry?.lapTotal),
        chrono: this.chrono(telemetry),
        speed: this.firstNumber(telemetry?.speedGps, telemetry?.gpsSpeed, telemetry?.speed),
        temperature: this.firstNumber(telemetry?.temperature),
        windSpeed: this.firstNumber(telemetry?.windSpeed, telemetry?.windKmh),
        rainProbability: this.firstNumber(telemetry?.rainProbability, telemetry?.rainPercent),
        heartRate: this.firstNumber(telemetry?.heartRate, telemetry?.bpm),
        energy: this.firstNumber(telemetry?.energyConsumed, telemetry?.energyJ),
        strategy: telemetry?.activeStrategy ?? telemetry?.strategy ?? null,
        instruction: telemetry?.copilotInstruction ?? telemetry?.instruction ?? null,
        raceState: telemetry?.raceState ?? telemetry?.status ?? null,
        pitStop: this.firstBoolean(telemetry?.pitStop, telemetry?.stands),
        trackPath: this.pathFromPoints(normalizedTrack),
        vehiclePoint: this.vehiclePoint(telemetry, trackPoints, normalizedTrack),
      };
    }),
  );

  instructionLabel(instruction: CopilotInstruction | null): string {
    return this.label(instruction, {
      accelerer: 'Accélérer',
      maintenir: 'Maintenir',
      ralentir: 'Ralentir',
    });
  }

  raceStateLabel(state: RaceState | null): string {
    return this.label(state, {
      course: 'Course',
      ne_pas_doubler: 'Ne pas doubler',
      stop: 'Stop',
    });
  }

  strategyLabel(strategy: StrategyMode | null): string {
    return this.label(strategy, {
      depart: 'Départ',
      course: 'Course',
    });
  }

  normalizedKey(value: string | null): string {
    return (value ?? 'unknown')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase();
  }

  private label(value: string | null, knownLabels: Record<string, string>): string {
    if (!value) {
      return '--';
    }

    const key = this.normalizedKey(value);
    return knownLabels[key] ?? value;
  }

  private chrono(telemetry: Telemetry | null): string {
    if (telemetry?.chrono) {
      return telemetry.chrono;
    }

    const seconds = this.firstNumber(telemetry?.elapsedSeconds, telemetry?.elapsedMs);
    if (seconds === null) {
      return '--:--';
    }

    const totalSeconds = telemetry?.elapsedMs ? Math.floor(seconds / 1000) : Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  private firstNumber(...values: Array<number | undefined>): number | null {
    return values.find((value) => typeof value === 'number' && Number.isFinite(value)) ?? null;
  }

  private firstBoolean(...values: Array<boolean | undefined>): boolean | null {
    return values.find((value) => typeof value === 'boolean') ?? null;
  }

  private trackPoints(telemetry: Telemetry | null): TrackPoint[] {
    return (
      telemetry?.circuitPoints ??
      telemetry?.circuit?.points ??
      telemetry?.track?.points ??
      []
    ).filter((point) => this.pointX(point) !== null && this.pointY(point) !== null);
  }

  private normalizeTrack(points: TrackPoint[]): Array<{ x: number; y: number }> {
    if (!points.length) {
      return [];
    }

    const rawPoints = points.map((point) => ({
      x: this.pointX(point) ?? 0,
      y: this.pointY(point) ?? 0,
    }));
    const xs = rawPoints.map((point) => point.x);
    const ys = rawPoints.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;

    return rawPoints.map((point) => ({
      x: 8 + ((point.x - minX) / width) * 84,
      y: 8 + ((point.y - minY) / height) * 84,
    }));
  }

  private pathFromPoints(points: Array<{ x: number; y: number }>): string | null {
    if (points.length < 2) {
      return null;
    }

    const [firstPoint, ...rest] = points;
    return [
      `M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`,
      ...rest.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
      'Z',
    ].join(' ');
  }

  private vehiclePoint(
    telemetry: Telemetry | null,
    trackPoints: TrackPoint[],
    normalizedTrack: Array<{ x: number; y: number }>,
  ): { x: number; y: number } | null {
    const position = telemetry?.vehiclePosition ?? telemetry?.position ?? telemetry ?? null;
    if (!position) {
      return null;
    }

    if (typeof position.progress === 'number' && normalizedTrack.length) {
      const index = Math.round(
        Math.max(0, Math.min(1, position.progress)) * (normalizedTrack.length - 1),
      );
      return normalizedTrack[index];
    }

    const positionX = this.pointX(position);
    const positionY = this.pointY(position);
    if (positionX === null || positionY === null || !trackPoints.length) {
      return null;
    }

    const allPoints = [...trackPoints, position];
    const normalized = this.normalizeTrack(allPoints);
    return normalized[normalized.length - 1] ?? null;
  }

  private pointX(point: TrackPoint | VehiclePosition): number | null {
    return this.firstNumber(point.x, point.lng, point.longitude);
  }

  private pointY(point: TrackPoint | VehiclePosition): number | null {
    return this.firstNumber(point.y, point.lat, point.latitude);
  }
}
