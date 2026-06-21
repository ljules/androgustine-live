import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import {
  CopilotInstruction,
  RaceState,
  RaceSessionDocument,
  StrategyMode,
  StrategyDocument,
  Telemetry,
  TrackPoint,
  TrackDocument,
  VehiclePosition,
  InstructionsDocument,
} from '../../models/telemetry.model';
import { TelemetryService } from '../../services/telemetry.service';
import { ConnectionStatusComponent } from './components/connection-status.component';
import { DebugPanelComponent } from './components/debug-panel.component';
import { InstructionPanelComponent } from './components/instruction-panel.component';
import { PrimaryTelemetryComponent } from './components/primary-telemetry.component';
import { RaceStatePanelComponent } from './components/race-state-panel.component';
import { SecondaryMetricsComponent } from './components/secondary-metrics.component';
import { StrategySummaryComponent } from './components/strategy-summary.component';
import { TrackMapComponent } from './components/track-map.component';

interface DashboardViewModel {
  telemetry: Telemetry | null;
  session: RaceSessionDocument | null;
  track: TrackDocument | null;
  strategyDocument: StrategyDocument | null;
  instructions: InstructionsDocument | null;
  sessionId: string | null;
  connectionState?: string;
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
  ghostDistance: number | null;
  deltaDistance: number | null;
  strategy: StrategyMode | null;
  strategyLabel: string;
  strategyKey: string;
  instruction: CopilotInstruction | null;
  instructionLabel: string;
  instructionKey: string;
  raceState: RaceState | null;
  raceStateLabel: string;
  raceStateKey: string;
  pitStop: boolean | null;
  trackPath: string | null;
  vehiclePoint: { x: number; y: number } | null;
  hasUsableData: boolean;
}

@Component({
  selector: 'app-live-dashboard',
  imports: [
    AsyncPipe,
    ConnectionStatusComponent,
    DebugPanelComponent,
    InstructionPanelComponent,
    PrimaryTelemetryComponent,
    RaceStatePanelComponent,
    SecondaryMetricsComponent,
    StrategySummaryComponent,
    TrackMapComponent,
  ],
  templateUrl: './live-dashboard.responsive.html',
  styleUrl: './live-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveDashboardComponent {
  readonly debug = false;
  private readonly telemetryService = inject(TelemetryService);

  readonly vm$ = this.telemetryService.latest$.pipe(
    map((snapshot): DashboardViewModel => {
      const telemetry = snapshot.data;
      const session = snapshot.session ?? null;
      const track = snapshot.track ?? null;
      const strategyDocument = snapshot.strategy ?? null;
      const instructions = snapshot.instructions ?? null;
      const trackPoints = this.trackPoints(telemetry, track);
      const normalizedTrack = this.normalizeTrack(trackPoints);
      const currentLap = this.firstNumber(
        telemetry?.currentLap,
        telemetry?.lap,
        telemetry?.race?.currentLap,
        telemetry?.race?.lap,
        telemetry?.race?.current,
      );
      const totalLaps = this.firstNumber(
        session?.totalLaps,
        telemetry?.totalLaps,
        telemetry?.lapTotal,
        telemetry?.race?.totalLaps,
        telemetry?.race?.lapTotal,
        telemetry?.race?.total,
      );
      const chrono = this.chrono(telemetry);
      const speed = this.firstNumber(
        telemetry?.gpsSpeedKmh,
        telemetry?.speedGps,
        telemetry?.gpsSpeed,
        telemetry?.speed,
        telemetry?.gps?.speedGps,
        telemetry?.gps?.gpsSpeed,
        telemetry?.gps?.speedKmh,
        telemetry?.gps?.kmh,
        telemetry?.gps?.speed,
      );
      const temperature = this.firstNumber(
        telemetry?.weatherTemperatureC,
        telemetry?.temperature,
        telemetry?.weather?.temperature,
        telemetry?.weather?.temp,
      );
      const windSpeed = this.firstNumber(
        telemetry?.weatherWindKmh,
        telemetry?.windSpeed,
        telemetry?.windKmh,
        telemetry?.weather?.windSpeed,
        telemetry?.weather?.windKmh,
        telemetry?.weather?.wind,
      );
      const rainProbability = this.firstNumber(
        telemetry?.weatherRainProbability,
        telemetry?.rainProbability,
        telemetry?.rainPercent,
        telemetry?.weather?.rainProbability,
        telemetry?.weather?.rainPercent,
        telemetry?.weather?.rain,
      );
      const heartRate = this.firstNumber(
        telemetry?.heartRateBpm,
        typeof telemetry?.heartRate === 'number' ? telemetry.heartRate : undefined,
        typeof telemetry?.heartRate === 'object' ? telemetry.heartRate.bpm : undefined,
        typeof telemetry?.heartRate === 'object' ? telemetry.heartRate.value : undefined,
        typeof telemetry?.heartRate === 'object' ? telemetry.heartRate.heartRate : undefined,
        telemetry?.heartRateData?.bpm,
        telemetry?.heartRateData?.value,
        telemetry?.heartRateData?.heartRate,
        telemetry?.bpm,
      );
      const energy = this.firstNumber(
        telemetry?.energyConsumed,
        telemetry?.energyJ,
        telemetry?.energy,
        telemetry?.joules,
        telemetry?.joulemeter?.energyConsumed,
        telemetry?.joulemeter?.energyJ,
        telemetry?.joulemeter?.energy,
        telemetry?.joulemeter?.joules,
        telemetry?.joulemeter?.consumed,
      );
      const ghostDistance = this.firstNumber(telemetry?.ghostDistanceM);
      const deltaDistance = this.firstNumber(telemetry?.deltaDistanceM);
      const strategy =
        telemetry?.activeStrategy ??
        telemetry?.strategy ??
        telemetry?.race?.activeStrategy ??
        telemetry?.race?.strategy ??
        telemetry?.copilot?.activeStrategy ??
        telemetry?.copilot?.strategy ??
        null;
      const instruction =
        instructions?.pilotPaceInstruction ??
        telemetry?.copilotInstruction ??
        telemetry?.instruction ??
        telemetry?.copilot?.copilotInstruction ??
        telemetry?.copilot?.instruction ??
        telemetry?.copilot?.cadence ??
        telemetry?.copilot?.command ??
        null;
      const raceState =
        instructions?.raceStatusInstruction ??
        telemetry?.raceState ??
        telemetry?.status ??
        telemetry?.race?.raceState ??
        telemetry?.race?.state ??
        telemetry?.race?.status ??
        telemetry?.copilot?.raceState ??
        telemetry?.copilot?.state ??
        telemetry?.copilot?.status ??
        null;
      const pitStop = this.firstBoolean(
        instructions?.pitStopRequest,
        telemetry?.pitStop,
        telemetry?.stands,
        telemetry?.race?.pitStop,
        telemetry?.race?.stands,
        telemetry?.copilot?.pitStop,
        telemetry?.copilot?.stands,
      );
      const trackPath = this.pathFromPoints(normalizedTrack);
      const vehiclePoint = this.vehiclePoint(telemetry, track, trackPoints, normalizedTrack);

      const vm: DashboardViewModel = {
        telemetry,
        session,
        track,
        strategyDocument,
        instructions,
        sessionId: snapshot.sessionId ?? null,
        connectionState: snapshot.connectionState,
        connected: snapshot.connected,
        error: snapshot.error,
        currentLap,
        totalLaps,
        chrono,
        speed,
        temperature,
        windSpeed,
        rainProbability,
        heartRate,
        energy,
        ghostDistance,
        deltaDistance,
        strategy,
        strategyLabel: this.strategyLabel(strategy),
        strategyKey: this.normalizedKey(strategy),
        instruction,
        instructionLabel: this.instructionLabel(instruction),
        instructionKey: this.normalizedKey(instruction),
        raceState,
        raceStateLabel: this.raceStateLabel(raceState),
        raceStateKey: this.normalizedKey(raceState),
        pitStop,
        trackPath,
        vehiclePoint,
        hasUsableData: false,
      };

      vm.hasUsableData = this.hasUsableData(vm);
      return vm;
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
    const globalLabels: Record<string, string> = {
      accelerate: 'Accélérer',
      accelerer: 'Accélérer',
      maintain: 'Maintenir',
      maintenir: 'Maintenir',
      slow_down: 'Ralentir',
      ralentir: 'Ralentir',
      race: 'Course',
      course: 'Course',
      no_overtaking: 'Ne pas doubler',
      ne_pas_doubler: 'Ne pas doubler',
      stop: 'Stop',
      start: 'Départ',
      depart: 'Départ',
    };
    return globalLabels[key] ?? knownLabels[key] ?? value;
  }

  private chrono(telemetry: Telemetry | null): string {
    if (telemetry?.chrono) {
      return telemetry.chrono;
    }

    if (telemetry?.race?.chrono) {
      return telemetry.race.chrono;
    }

    const seconds = this.firstNumber(
      telemetry?.elapsedSessionS,
      telemetry?.elapsedSeconds,
      telemetry?.race?.elapsedSeconds,
      telemetry?.elapsedLapS,
      telemetry?.elapsedMs,
      telemetry?.race?.elapsedMs,
    );
    if (seconds === null) {
      return '--:--';
    }

    const elapsedMs = this.firstNumber(telemetry?.elapsedMs, telemetry?.race?.elapsedMs);
    const totalSeconds = elapsedMs !== null ? Math.floor(elapsedMs / 1000) : Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  private firstNumber(...values: unknown[]): number | null {
    for (const value of values) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const parsed = Number(value.replace(',', '.'));
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return null;
  }

  private firstBoolean(...values: unknown[]): boolean | null {
    for (const value of values) {
      if (typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', 'on', '1', 'oui', 'yes'].includes(normalized)) {
          return true;
        }
        if (['false', 'off', '0', 'non', 'no'].includes(normalized)) {
          return false;
        }
      }
    }

    return null;
  }

  private trackPoints(telemetry: Telemetry | null, track: TrackDocument | null): TrackPoint[] {
    return (
      track?.points ??
      telemetry?.circuitPoints ??
      telemetry?.circuit?.points ??
      telemetry?.circuit?.path ??
      telemetry?.track?.points ??
      telemetry?.track?.path ??
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
    track: TrackDocument | null,
    trackPoints: TrackPoint[],
    normalizedTrack: Array<{ x: number; y: number }>,
  ): { x: number; y: number } | null {
    const gpsLat = this.firstNumber(telemetry?.gpsLat);
    const gpsLon = this.firstNumber(telemetry?.gpsLon);
    if (gpsLat !== null && gpsLon !== null && trackPoints.length) {
      const normalized = this.normalizeTrack([...trackPoints, { lat: gpsLat, lon: gpsLon }]);
      return normalized[normalized.length - 1] ?? null;
    }

    const snappedDistanceM = this.firstNumber(telemetry?.snappedDistanceM);
    const projectedPosition = this.positionAtDistance(
      trackPoints,
      snappedDistanceM,
      track?.totalDistanceM,
    );
    if (projectedPosition) {
      const normalized = this.normalizeTrack([...trackPoints, projectedPosition]);
      return normalized[normalized.length - 1] ?? null;
    }

    const position =
      telemetry?.vehiclePosition ??
      telemetry?.position ??
      telemetry?.gps ??
      telemetry?.track?.position ??
      telemetry?.circuit?.position ??
      telemetry ??
      null;
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
    return this.firstNumber(point.x, point.lng, point.lon, point.longitude);
  }

  private pointY(point: TrackPoint | VehiclePosition): number | null {
    return this.firstNumber(point.y, point.lat, point.latitude);
  }

  private hasUsableData(vm: DashboardViewModel): boolean {
    return [
      vm.currentLap,
      vm.totalLaps,
      vm.speed,
      vm.temperature,
      vm.windSpeed,
      vm.rainProbability,
      vm.heartRate,
      vm.energy,
      vm.strategy,
      vm.instruction,
      vm.raceState,
      vm.pitStop,
      vm.trackPath,
      vm.vehiclePoint,
    ].some((value) => value !== null && value !== undefined);
  }

  private positionAtDistance(
    points: TrackPoint[],
    distanceM: number | null,
    totalDistanceM?: number,
  ): TrackPoint | null {
    if (!points.length || distanceM === null) {
      return null;
    }

    const sorted = [...points]
      .filter((point) => this.firstNumber(point.distanceM) !== null)
      .sort((a, b) => (this.firstNumber(a.distanceM) ?? 0) - (this.firstNumber(b.distanceM) ?? 0));
    if (!sorted.length) {
      return null;
    }

    const distance = totalDistanceM && totalDistanceM > 0 ? distanceM % totalDistanceM : distanceM;
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const firstDistance = this.firstNumber(first.distanceM) ?? 0;
    const lastDistance = this.firstNumber(last.distanceM) ?? firstDistance;

    if (distance <= firstDistance) {
      return first;
    }
    if (distance >= lastDistance) {
      return last;
    }

    const nextIndex = sorted.findIndex(
      (point) => (this.firstNumber(point.distanceM) ?? 0) >= distance,
    );
    const previous = sorted[nextIndex - 1];
    const next = sorted[nextIndex];
    const previousDistance = this.firstNumber(previous.distanceM) ?? 0;
    const nextDistance = this.firstNumber(next.distanceM) ?? previousDistance;
    const span = nextDistance - previousDistance;
    if (span <= 0) {
      return previous;
    }

    const ratio = (distance - previousDistance) / span;
    const previousLat = this.pointY(previous);
    const nextLat = this.pointY(next);
    const previousLon = this.pointX(previous);
    const nextLon = this.pointX(next);
    if (previousLat === null || nextLat === null || previousLon === null || nextLon === null) {
      return previous;
    }

    return {
      distanceM: distance,
      lat: previousLat + (nextLat - previousLat) * ratio,
      lon: previousLon + (nextLon - previousLon) * ratio,
    };
  }
}
