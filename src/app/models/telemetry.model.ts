export type StrategyMode = 'depart' | 'course' | string;
export type CopilotInstruction = 'accelerer' | 'maintenir' | 'ralentir' | string;
export type RaceState = 'course' | 'ne_pas_doubler' | 'stop' | string;

export interface TrackPoint {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

export interface VehiclePosition {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  progress?: number;
}

export interface Telemetry {
  lap?: number;
  currentLap?: number;
  totalLaps?: number;
  lapTotal?: number;
  chrono?: string;
  elapsedMs?: number;
  elapsedSeconds?: number;
  speedGps?: number;
  gpsSpeed?: number;
  speed?: number;
  temperature?: number;
  windSpeed?: number;
  windKmh?: number;
  rainProbability?: number;
  rainPercent?: number;
  heartRate?: number;
  bpm?: number;
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
  };
  circuit?: {
    points?: TrackPoint[];
  };
  circuitPoints?: TrackPoint[];
  vehiclePosition?: VehiclePosition;
  position?: VehiclePosition;
  latitude?: number;
  longitude?: number;
  progress?: number;
  updatedAt?: unknown;
}

export interface TelemetrySnapshot {
  data: Telemetry | null;
  connected: boolean;
  error?: string;
}
