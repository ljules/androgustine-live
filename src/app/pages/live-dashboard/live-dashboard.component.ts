import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import {
  CopilotInstruction,
  RaceState,
  RaceSessionDocument,
  StrategySegment,
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
  trackName: string | null;
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
  trackSegments: TrackSegmentPath[];
  osmMap: OsmTrackMap | null;
  vehiclePoint: { x: number; y: number } | null;
  ghostPoint: { x: number; y: number } | null;
  hasUsableData: boolean;
}

interface NormalizedTrack {
  points: ProjectedTrackPoint[];
  project: (point: TrackPoint | VehiclePosition) => { x: number; y: number } | null;
}

interface TrackSegmentPath {
  path: string;
  color: string;
}

interface ProjectedTrackPoint {
  x: number;
  y: number;
  distanceM: number | null;
}

interface OsmTile {
  url: string;
  x: number;
  y: number;
  size: number;
}

interface OsmTrackMap {
  viewBox: string;
  tiles: OsmTile[];
  trackPath: string;
  trackSegments: TrackSegmentPath[];
  vehiclePoint: { x: number; y: number } | null;
  ghostPoint: { x: number; y: number } | null;
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
  readonly mapMode = signal<'circuit' | 'osm'>('circuit');
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
      const segmentStrategy = this.segmentStrategy(strategy, currentLap);
      const trackPath = this.pathFromPoints(normalizedTrack.points, true);
      const trackSegments = this.strategySegments(
        strategyDocument,
        segmentStrategy,
        normalizedTrack,
      );
      const vehiclePoint = this.vehiclePoint(telemetry, track, trackPoints, normalizedTrack);
      const ghostPoint = this.ghostPoint(telemetry, track, trackPoints, normalizedTrack);
      const osmMap = this.osmMap(trackPoints, telemetry, track, strategyDocument, segmentStrategy);

      const vm: DashboardViewModel = {
        telemetry,
        session,
        track,
        strategyDocument,
        instructions,
        sessionId: snapshot.sessionId ?? null,
        trackName: session?.trackName ?? track?.trackName ?? null,
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
        trackSegments,
        osmMap,
        vehiclePoint,
        ghostPoint,
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

  setMapMode(mode: 'circuit' | 'osm'): void {
    this.mapMode.set(mode);
  }

  private segmentStrategy(strategy: StrategyMode | null, currentLap: number | null): StrategyMode | null {
    if (currentLap !== null) {
      return currentLap <= 1 ? 'depart' : 'course';
    }

    return strategy;
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

  private normalizeTrack(points: TrackPoint[]): NormalizedTrack {
    if (!points.length) {
      return {
        points: [],
        project: () => null,
      };
    }

    const usesGeoCoordinates = points.every(
      (point) =>
        this.firstNumber(point.x) === null &&
        this.firstNumber(point.y) === null &&
        this.pointX(point) !== null &&
        this.pointY(point) !== null,
    );
    const meanLatitude =
      points.reduce((sum, point) => sum + (this.pointY(point) ?? 0), 0) / points.length;
    const longitudeScale = usesGeoCoordinates ? Math.cos((meanLatitude * Math.PI) / 180) : 1;
    const rawPoints = points.map((point) => ({
      x: (this.pointX(point) ?? 0) * longitudeScale,
      y: this.pointY(point) ?? 0,
      distanceM: this.firstNumber(point.distanceM),
      source: point,
    }));
    const xs = rawPoints.map((point) => point.x);
    const ys = rawPoints.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const scale = 94 / Math.max(width, height);
    const offsetX = (100 - width * scale) / 2;
    const offsetY = (100 - height * scale) / 2;

    const project = (point: TrackPoint | VehiclePosition): { x: number; y: number } | null => {
      const x = this.pointX(point);
      const y = this.pointY(point);
      if (x === null || y === null) {
        return null;
      }

      return {
        x: offsetX + (x * longitudeScale - minX) * scale,
        y: offsetY + (maxY - y) * scale,
      };
    };

    return {
      points: rawPoints.map((point) => ({
        x: offsetX + (point.x - minX) * scale,
        y: offsetY + (maxY - point.y) * scale,
        distanceM: point.distanceM,
      })),
      project,
    };
  }

  private pathFromPoints(points: Array<{ x: number; y: number }>, close = false): string | null {
    if (points.length < 2) {
      return null;
    }

    const [firstPoint, ...rest] = points;
    return [
      `M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`,
      ...rest.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
      close ? 'Z' : '',
    ].join(' ');
  }

  private vehiclePoint(
    telemetry: Telemetry | null,
    track: TrackDocument | null,
    trackPoints: TrackPoint[],
    normalizedTrack: NormalizedTrack,
  ): { x: number; y: number } | null {
    const gpsLat = this.firstNumber(telemetry?.gpsLat);
    const gpsLon = this.firstNumber(telemetry?.gpsLon);
    if (gpsLat !== null && gpsLon !== null && trackPoints.length) {
      return normalizedTrack.project({ lat: gpsLat, lon: gpsLon });
    }

    const snappedDistanceM = this.firstNumber(telemetry?.snappedDistanceM);
    const projectedPosition = this.positionAtDistance(
      trackPoints,
      snappedDistanceM,
      track?.totalDistanceM,
    );
    if (projectedPosition) {
      return normalizedTrack.project(projectedPosition);
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

    if (typeof position.progress === 'number' && normalizedTrack.points.length) {
      const index = Math.round(
        Math.max(0, Math.min(1, position.progress)) * (normalizedTrack.points.length - 1),
      );
      return normalizedTrack.points[index];
    }

    const positionX = this.pointX(position);
    const positionY = this.pointY(position);
    if (positionX === null || positionY === null || !trackPoints.length) {
      return null;
    }

    return normalizedTrack.project(position);
  }

  private ghostPoint(
    telemetry: Telemetry | null,
    track: TrackDocument | null,
    trackPoints: TrackPoint[],
    normalizedTrack: NormalizedTrack,
  ): { x: number; y: number } | null {
    const ghostLat = this.firstNumber(telemetry?.ghostLat, telemetry?.ghostGpsLat);
    const ghostLon = this.firstNumber(telemetry?.ghostLon, telemetry?.ghostGpsLon);
    if (ghostLat !== null && ghostLon !== null && trackPoints.length) {
      return normalizedTrack.project({ lat: ghostLat, lon: ghostLon });
    }

    const ghostDistanceM = this.firstNumber(
      telemetry?.ghostSnappedDistanceM,
      telemetry?.ghostTrackDistanceM,
      telemetry?.ghostDistanceFromStartM,
    );
    const projectedPosition = this.positionAtDistance(
      trackPoints,
      ghostDistanceM,
      track?.totalDistanceM,
    );
    if (projectedPosition) {
      return normalizedTrack.project(projectedPosition);
    }

    const position =
      telemetry?.ghostPosition ??
      telemetry?.ghostCarPosition ??
      telemetry?.ghost ??
      telemetry?.ghostCar ??
      null;
    if (!position) {
      return null;
    }

    const ghostProgress = this.firstNumber(telemetry?.ghostProgress, position.progress);
    if (ghostProgress !== null && normalizedTrack.points.length) {
      const index = Math.round(
        Math.max(0, Math.min(1, ghostProgress)) * (normalizedTrack.points.length - 1),
      );
      return normalizedTrack.points[index];
    }

    if (this.pointX(position) === null || this.pointY(position) === null || !trackPoints.length) {
      return null;
    }

    return normalizedTrack.project(position);
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
      vm.ghostPoint,
    ].some((value) => value !== null && value !== undefined);
  }

  private strategySegments(
    strategyDocument: StrategyDocument | null,
    activeStrategy: StrategyMode | null,
    normalizedTrack: NormalizedTrack,
  ): TrackSegmentPath[] {
    return this.strategySegmentsFromPoints(strategyDocument, activeStrategy, normalizedTrack.points);
  }

  private strategySegmentsFromPoints(
    strategyDocument: StrategyDocument | null,
    activeStrategy: StrategyMode | null,
    points: ProjectedTrackPoint[],
  ): TrackSegmentPath[] {
    if (!strategyDocument || points.length < 2) {
      return [];
    }

    const key = this.normalizedKey(activeStrategy);
    const sourceSegments =
      key === 'depart' || key === 'start'
        ? strategyDocument.startSegments
        : strategyDocument.raceSegments ?? strategyDocument.startSegments;

    return (sourceSegments ?? [])
      .map((segment) => this.segmentPath(segment, points))
      .filter((segment): segment is TrackSegmentPath => segment !== null);
  }

  private segmentPath(segment: StrategySegment, points: ProjectedTrackPoint[]): TrackSegmentPath | null {
    const startDistance = this.firstNumber(
      segment.startDistanceM,
      segment.fromDistanceM,
      segment.distanceStartM,
      segment.beginDistanceM,
    );
    const endDistance = this.firstNumber(
      segment.endDistanceM,
      segment.toDistanceM,
      segment.distanceEndM,
      segment.finishDistanceM,
    );
    if (startDistance === null || endDistance === null || startDistance === endDistance) {
      return null;
    }

    const segmentPoints = this.segmentPointsByDistance(points, startDistance, endDistance);
    const path = this.pathFromPoints(segmentPoints);
    if (!path) {
      return null;
    }

    return {
      path,
      color: this.segmentColor(segment),
    };
  }

  private segmentPointsByDistance(
    points: ProjectedTrackPoint[],
    startDistance: number,
    endDistance: number,
  ): Array<{ x: number; y: number }> {
    const sorted = [...points]
      .filter((point) => point.distanceM !== null)
      .sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0));
    if (sorted.length < 2) {
      return [];
    }

    const start = Math.min(startDistance, endDistance);
    const end = Math.max(startDistance, endDistance);
    const result: Array<{ x: number; y: number }> = [];
    const startPoint = this.pointAtNormalizedDistance(sorted, start);
    if (startPoint) {
      result.push(startPoint);
    }

    for (const point of sorted) {
      const distance = point.distanceM ?? 0;
      if (distance > start && distance < end) {
        result.push(point);
      }
    }

    const endPoint = this.pointAtNormalizedDistance(sorted, end);
    if (endPoint) {
      result.push(endPoint);
    }

    return result;
  }

  private pointAtNormalizedDistance(
    points: ProjectedTrackPoint[],
    distance: number,
  ): { x: number; y: number } | null {
    const first = points[0];
    const last = points[points.length - 1];
    const firstDistance = first.distanceM ?? 0;
    const lastDistance = last.distanceM ?? firstDistance;

    if (distance <= firstDistance) {
      return first;
    }
    if (distance >= lastDistance) {
      return last;
    }

    const nextIndex = points.findIndex((point) => (point.distanceM ?? 0) >= distance);
    const previous = points[nextIndex - 1];
    const next = points[nextIndex];
    const previousDistance = previous.distanceM ?? 0;
    const nextDistance = next.distanceM ?? previousDistance;
    const span = nextDistance - previousDistance;
    if (span <= 0) {
      return previous;
    }

    const ratio = (distance - previousDistance) / span;
    return {
      x: previous.x + (next.x - previous.x) * ratio,
      y: previous.y + (next.y - previous.y) * ratio,
    };
  }

  private segmentColor(segment: {
    color?: string;
    segmentColor?: string;
    colorKey?: string;
    kind?: string;
    type?: string;
    label?: string;
  }): string {
    const rawColor =
      segment.color ??
      segment.segmentColor ??
      segment.colorKey ??
      segment.kind ??
      segment.type ??
      segment.label ??
      '';
    const key = this.normalizedKey(rawColor);
    const colors: Record<string, string> = {
      blue: '#58a6ff',
      bleu: '#58a6ff',
      green: '#43d17a',
      vert: '#43d17a',
      yellow: '#ffc61a',
      jaune: '#ffc61a',
      red: '#e60000',
      rouge: '#e60000',
      cyan: '#19e7ef',
      turquoise: '#19e7ef',
    };

    if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(rawColor)) {
      return rawColor;
    }

    return colors[key] ?? '#f27032';
  }

  private osmMap(
    trackPoints: TrackPoint[],
    telemetry: Telemetry | null,
    track: TrackDocument | null,
    strategyDocument: StrategyDocument | null,
    activeStrategy: StrategyMode | null,
  ): OsmTrackMap | null {
    const geoPoints = trackPoints.filter(
      (point) =>
        this.firstNumber(point.lat, point.latitude) !== null &&
        this.firstNumber(point.lon, point.lng, point.longitude) !== null,
    );
    if (geoPoints.length < 2) {
      return null;
    }

    const latitudes = geoPoints.map((point) => this.pointY(point) ?? 0);
    const longitudes = geoPoints.map((point) => this.pointX(point) ?? 0);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
    const zoom = this.osmZoom(maxLat - minLat, maxLon - minLon);
    const scale = 2 ** zoom;
    const projected = geoPoints.map((point) => {
      const lat = this.pointY(point) ?? 0;
      const lon = this.pointX(point) ?? 0;
      const mercator = this.osmProject(lat, lon, scale);
      return {
        x: mercator.x,
        y: mercator.y,
        distanceM: this.firstNumber(point.distanceM),
      };
    });
    const xs = projected.map((point) => point.x);
    const ys = projected.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const padding = Math.max(80, Math.max(width, height) * 0.18);
    const originX = Math.floor((minX - padding) / 256) * 256;
    const originY = Math.floor((minY - padding) / 256) * 256;
    const endX = Math.ceil((maxX + padding) / 256) * 256;
    const endY = Math.ceil((maxY + padding) / 256) * 256;
    const tiles = this.osmTiles(originX, originY, endX, endY, zoom);
    const mapPoints = projected.map((point) => ({
      x: point.x - originX,
      y: point.y - originY,
      distanceM: point.distanceM,
    }));
    const trackPath = this.pathFromPoints(mapPoints, true);
    if (!trackPath) {
      return null;
    }

    return {
      viewBox: `0 0 ${endX - originX} ${endY - originY}`,
      tiles,
      trackPath,
      trackSegments: this.strategySegmentsFromPoints(strategyDocument, activeStrategy, mapPoints),
      vehiclePoint: this.osmVehiclePoint(telemetry, track, geoPoints, scale, originX, originY),
      ghostPoint: this.osmGhostPoint(telemetry, track, geoPoints, scale, originX, originY),
    };
  }

  private osmVehiclePoint(
    telemetry: Telemetry | null,
    track: TrackDocument | null,
    geoPoints: TrackPoint[],
    scale: number,
    originX: number,
    originY: number,
  ): { x: number; y: number } | null {
    const gpsLat = this.firstNumber(telemetry?.gpsLat);
    const gpsLon = this.firstNumber(telemetry?.gpsLon);
    if (gpsLat !== null && gpsLon !== null) {
      return this.osmPoint(gpsLat, gpsLon, scale, originX, originY);
    }

    const snappedDistanceM = this.firstNumber(telemetry?.snappedDistanceM);
    const projectedPosition = this.positionAtDistance(
      geoPoints,
      snappedDistanceM,
      track?.totalDistanceM,
    );
    if (projectedPosition) {
      const lat = this.pointY(projectedPosition);
      const lon = this.pointX(projectedPosition);
      if (lat !== null && lon !== null) {
        return this.osmPoint(lat, lon, scale, originX, originY);
      }
    }

    return null;
  }

  private osmGhostPoint(
    telemetry: Telemetry | null,
    track: TrackDocument | null,
    geoPoints: TrackPoint[],
    scale: number,
    originX: number,
    originY: number,
  ): { x: number; y: number } | null {
    const ghostLat = this.firstNumber(telemetry?.ghostLat, telemetry?.ghostGpsLat);
    const ghostLon = this.firstNumber(telemetry?.ghostLon, telemetry?.ghostGpsLon);
    if (ghostLat !== null && ghostLon !== null) {
      return this.osmPoint(ghostLat, ghostLon, scale, originX, originY);
    }

    const ghostDistanceM = this.firstNumber(
      telemetry?.ghostSnappedDistanceM,
      telemetry?.ghostTrackDistanceM,
      telemetry?.ghostDistanceFromStartM,
    );
    const projectedPosition = this.positionAtDistance(
      geoPoints,
      ghostDistanceM,
      track?.totalDistanceM,
    );
    if (projectedPosition) {
      const lat = this.pointY(projectedPosition);
      const lon = this.pointX(projectedPosition);
      if (lat !== null && lon !== null) {
        return this.osmPoint(lat, lon, scale, originX, originY);
      }
    }

    const position =
      telemetry?.ghostPosition ??
      telemetry?.ghostCarPosition ??
      telemetry?.ghost ??
      telemetry?.ghostCar ??
      null;
    if (!position) {
      return null;
    }

    const ghostProgress = this.firstNumber(telemetry?.ghostProgress, position.progress);
    if (ghostProgress !== null && geoPoints.length) {
      const index = Math.round(Math.max(0, Math.min(1, ghostProgress)) * (geoPoints.length - 1));
      const progressPosition = geoPoints[index];
      const lat = this.pointY(progressPosition);
      const lon = this.pointX(progressPosition);
      if (lat !== null && lon !== null) {
        return this.osmPoint(lat, lon, scale, originX, originY);
      }
    }

    const positionLat = this.pointY(position);
    const positionLon = this.pointX(position);
    if (positionLat === null || positionLon === null) {
      return null;
    }

    return this.osmPoint(positionLat, positionLon, scale, originX, originY);
  }

  private osmPoint(
    lat: number,
    lon: number,
    scale: number,
    originX: number,
    originY: number,
  ): { x: number; y: number } {
    const point = this.osmProject(lat, lon, scale);
    return {
      x: point.x - originX,
      y: point.y - originY,
    };
  }

  private osmProject(lat: number, lon: number, scale: number): { x: number; y: number } {
    const sinLat = Math.sin((Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI) / 180);
    return {
      x: ((lon + 180) / 360) * 256 * scale,
      y:
        (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
        256 *
        scale,
    };
  }

  private osmZoom(latSpan: number, lonSpan: number): number {
    const span = Math.max(Math.abs(latSpan), Math.abs(lonSpan));
    if (span > 0.08) {
      return 14;
    }
    if (span > 0.025) {
      return 16;
    }
    return 18;
  }

  private osmTiles(
    originX: number,
    originY: number,
    endX: number,
    endY: number,
    zoom: number,
  ): OsmTile[] {
    const tiles: OsmTile[] = [];
    const scale = 2 ** zoom;
    const minTileX = Math.max(0, Math.floor(originX / 256));
    const minTileY = Math.max(0, Math.floor(originY / 256));
    const maxTileX = Math.min(scale - 1, Math.ceil(endX / 256) - 1);
    const maxTileY = Math.min(scale - 1, Math.ceil(endY / 256) - 1);

    for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
      for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
        tiles.push({
          url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
          x: tileX * 256 - originX,
          y: tileY * 256 - originY,
          size: 256,
        });
      }
    }

    return tiles;
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
