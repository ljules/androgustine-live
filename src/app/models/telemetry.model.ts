export type StrategyMode = 'depart' | 'course' | string;
export type CopilotInstruction = 'accelerer' | 'maintenir' | 'ralentir' | string;
export type RaceState = 'course' | 'ne_pas_doubler' | 'stop' | string;

export interface TrackPoint {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  distanceM?: number;
}

export interface VehiclePosition {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  progress?: number;
}

export interface RaceTelemetry {
  lap?: number;
  currentLap?: number;
  current?: number;
  totalLaps?: number;
  lapTotal?: number;
  total?: number;
  chrono?: string;
  elapsedMs?: number;
  elapsedSeconds?: number;
  strategy?: StrategyMode;
  activeStrategy?: StrategyMode;
  state?: RaceState;
  status?: RaceState;
  raceState?: RaceState;
  pitStop?: boolean;
  stands?: boolean;
}

export interface GpsTelemetry extends VehiclePosition {
  speed?: number;
  speedGps?: number;
  gpsSpeed?: number;
  speedKmh?: number;
  kmh?: number;
}

export interface WeatherTelemetry {
  temperature?: number;
  temp?: number;
  windSpeed?: number;
  windKmh?: number;
  wind?: number;
  rainProbability?: number;
  rainPercent?: number;
  rain?: number;
}

export interface HeartRateTelemetry {
  bpm?: number;
  value?: number;
  heartRate?: number;
}

export interface JoulemeterTelemetry {
  joules?: number;
  energy?: number;
  energyConsumed?: number;
  energyJ?: number;
  consumed?: number;
}

export interface CopilotTelemetry {
  strategy?: StrategyMode;
  activeStrategy?: StrategyMode;
  copilotInstruction?: CopilotInstruction;
  instruction?: CopilotInstruction;
  cadence?: CopilotInstruction;
  command?: CopilotInstruction;
  raceState?: RaceState;
  state?: RaceState;
  status?: RaceState;
  pitStop?: boolean;
  stands?: boolean;
}

export interface Telemetry {
  race?: RaceTelemetry;
  gps?: GpsTelemetry;
  weather?: WeatherTelemetry;
  heartRateData?: HeartRateTelemetry;
  joulemeter?: JoulemeterTelemetry;
  copilot?: CopilotTelemetry;
  lap?: number;
  currentLap?: number;
  totalLaps?: number;
  lapTotal?: number;
  chrono?: string;
  elapsedMs?: number;
  elapsedSeconds?: number;
  elapsedSessionS?: number;
  elapsedLapS?: number;
  speedGps?: number;
  gpsSpeed?: number;
  gpsSpeedKmh?: number;
  speed?: number;
  gpsLat?: number;
  gpsLon?: number;
  snappedDistanceM?: number;
  ghostDistanceM?: number;
  deltaDistanceM?: number;
  temperature?: number;
  weatherTemperatureC?: number;
  windSpeed?: number;
  windKmh?: number;
  weatherWindKmh?: number;
  rainProbability?: number;
  rainPercent?: number;
  weatherRainProbability?: number;
  heartRate?: number | HeartRateTelemetry;
  heartRateBpm?: number;
  bpm?: number;
  joules?: number;
  energy?: number;
  energyConsumed?: number;
  energyJ?: number;
  strategy?: StrategyMode;
  activeStrategy?: StrategyMode;
  copilotInstruction?: CopilotInstruction;
  instruction?: CopilotInstruction;
  raceState?: RaceState;
  status?: RaceState;
  pitStop?: boolean;
  stands?: boolean;
  track?: {
    points?: TrackPoint[];
    path?: TrackPoint[];
    position?: VehiclePosition;
  };
  circuit?: {
    points?: TrackPoint[];
    path?: TrackPoint[];
    position?: VehiclePosition;
  };
  circuitPoints?: TrackPoint[];
  vehiclePosition?: VehiclePosition;
  position?: VehiclePosition;
  latitude?: number;
  longitude?: number;
  progress?: number;
  timestampIso?: string;
  raceStarted?: boolean;
  updatedAt?: unknown;
}

export interface RaceSessionDocument {
  id?: string;
  sessionId?: string;
  createdAtIso?: string;
  appRole?: string;
  status?: string;
  raceStarted?: boolean;
  totalLaps?: number;
  trackName?: string;
}

export interface TrackDocument {
  trackName?: string;
  totalDistanceM?: number;
  pointCount?: number;
  points?: TrackPoint[];
}

export interface StrategySegment {
  startDistanceM?: number;
  endDistanceM?: number;
  fromDistanceM?: number;
  toDistanceM?: number;
  distanceStartM?: number;
  distanceEndM?: number;
  beginDistanceM?: number;
  finishDistanceM?: number;
  color?: string;
  segmentColor?: string;
  colorKey?: string;
  kind?: string;
  type?: string;
  label?: string;
}

export interface StrategyDocument {
  startSegments?: StrategySegment[];
  raceSegments?: StrategySegment[];
}

export interface InstructionsDocument {
  pilotPaceInstruction?: string;
  raceStatusInstruction?: string;
  pitStopRequest?: boolean;
  updatedAtIso?: string;
  updatedBy?: string;
}

export interface TelemetrySnapshot {
  data: Telemetry | null;
  telemetry?: Telemetry | null;
  session?: RaceSessionDocument | null;
  track?: TrackDocument | null;
  strategy?: StrategyDocument | null;
  instructions?: InstructionsDocument | null;
  sessionId?: string | null;
  connectionState?: 'Initializing' | 'Connected' | 'WaitingForTelemetry' | 'NoSession' | 'Error';
  connected: boolean;
  error?: string;
}
