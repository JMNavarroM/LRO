export interface TelemetryReading {
  timestamp: number
  value: number
}

export interface TelemetryChannel {
  id: string
  label: string
  unit: string
  value: number
  min: number
  max: number
  nominal: number
  history: TelemetryReading[]
  status: 'nominal' | 'warning' | 'critical' | 'offline'
  alertThresholdLow?: number
  alertThresholdHigh?: number
}

export interface TelemetryData {
  altitude: TelemetryChannel
  velocity: TelemetryChannel
  temperature: TelemetryChannel
  powerOutput: TelemetryChannel
  signalStrength: TelemetryChannel
  dataRate: TelemetryChannel
  batteryLevel: TelemetryChannel
  orbitAngle: TelemetryChannel
}

export interface OrbitalParams {
  inclination: number
  eccentricity: number
  semiMajorAxis: number
  period: number
  altitude: number
  velocity: number
  orbitCount: number
  missionElapsed: number
}

export interface Instrument {
  id: string
  name: string
  shortName: string
  description: string
  status: 'operational' | 'standby' | 'maintenance' | 'fault'
  health: number
  dataRate: number
  lastCalibration: string
  observations: number
}

export interface DSNStation {
  id: string
  name: string
  location: string
  active: boolean
  signalStrength: number
  distance: number
}

export interface Alert {
  id: string
  timestamp: number
  severity: 'info' | 'warning' | 'critical'
  channel: string
  message: string
  acknowledged: boolean
}

export type AuthMode = 'pin' | 'biometric'
export type AuthStatus = 'idle' | 'scanning' | 'success' | 'error'
export type ModuleId = 'dashboard' | 'telemetry' | 'orbital' | 'instruments' | 'communication' | 'thermal' | 'power'

export interface ModuleConfig {
  id: ModuleId
  label: string
  icon: string
  description: string
}
