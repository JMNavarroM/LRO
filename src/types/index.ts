export interface MetricReading {
  timestamp: number
  value: number
}

export interface MetricChannel {
  id: string
  label: string
  unit: string
  value: number
  min: number
  max: number
  nominal: number
  history: MetricReading[]
  status: 'nominal' | 'warning' | 'critical' | 'offline'
  alertThresholdLow?: number
  alertThresholdHigh?: number
}

export interface DashboardData {
  [key: string]: MetricChannel
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
export type ModuleId = 'overview' | 'analytics' | 'monitors' | 'settings'
