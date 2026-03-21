import type { TelemetryChannel, TelemetryData, Alert } from '../types'

const HISTORY_LENGTH = 80

function makeChannel(
  id: string,
  label: string,
  unit: string,
  nominal: number,
  min: number,
  max: number,
  alertLow?: number,
  alertHigh?: number
): TelemetryChannel {
  return {
    id,
    label,
    unit,
    value: nominal + (Math.random() - 0.5) * (max - min) * 0.05,
    min,
    max,
    nominal,
    history: Array.from({ length: HISTORY_LENGTH }, (_, i) => ({
      timestamp: Date.now() - (HISTORY_LENGTH - i) * 100,
      value: nominal + (Math.random() - 0.5) * (max - min) * 0.06,
    })),
    status: 'nominal',
    alertThresholdLow: alertLow,
    alertThresholdHigh: alertHigh,
  }
}

function getChannelStatus(ch: TelemetryChannel): TelemetryChannel['status'] {
  const { value, alertThresholdLow, alertThresholdHigh } = ch
  if (alertThresholdLow !== undefined && value < alertThresholdLow) return 'critical'
  if (alertThresholdHigh !== undefined && value > alertThresholdHigh) return 'critical'
  const range = ch.max - ch.min
  const deviation = Math.abs(value - ch.nominal) / range
  if (deviation > 0.15) return 'warning'
  return 'nominal'
}

class TelemetrySimulator {
  private data: TelemetryData
  private listeners: Set<(data: TelemetryData) => void> = new Set()
  private alertListeners: Set<(alert: Alert) => void> = new Set()
  private interval: ReturnType<typeof setInterval> | null = null
  private tick = 0
  private missionStart = Date.now() - 1000 * 60 * 60 * 24 * 365 * 16 // ~16 years ago (LRO launched 2009)

  constructor() {
    this.data = {
      altitude: makeChannel('altitude', 'Altitude', 'km', 50.2, 45, 60, 46, 58),
      velocity: makeChannel('velocity', 'Orbital Velocity', 'm/s', 1633, 1580, 1700, 1590, 1680),
      temperature: makeChannel('temperature', 'Bus Temperature', '°C', -30, -80, 50, -75, 45),
      powerOutput: makeChannel('powerOutput', 'Solar Power', 'W', 1850, 1200, 2200, 1300, 2100),
      signalStrength: makeChannel('signalStrength', 'Signal Strength', '%', 87, 0, 100, 20, undefined),
      dataRate: makeChannel('dataRate', 'Data Rate', 'Mbps', 52.4, 0, 100, 10, undefined),
      batteryLevel: makeChannel('batteryLevel', 'Battery Level', '%', 94, 0, 100, 20, undefined),
      orbitAngle: makeChannel('orbitAngle', 'Orbit Angle', '°', 0, 0, 360),
    }
    this.data.orbitAngle.value = 0
  }

  private updateChannel(ch: TelemetryChannel, noiseScale: number, driftSpeed = 0.002): TelemetryChannel {
    const range = ch.max - ch.min
    // Random walk with mean reversion toward nominal
    const noise = (Math.random() - 0.5) * range * noiseScale
    const drift = (ch.nominal - ch.value) * driftSpeed
    let newValue = ch.value + noise + drift

    // Clamp
    newValue = Math.max(ch.min, Math.min(ch.max, newValue))

    // Occasional anomaly spike (1% chance)
    if (Math.random() < 0.005) {
      newValue = ch.nominal + (Math.random() - 0.5) * range * 0.4
    }

    const newHistory = [
      ...ch.history.slice(1),
      { timestamp: Date.now(), value: newValue },
    ]

    const updated: TelemetryChannel = { ...ch, value: newValue, history: newHistory }
    updated.status = getChannelStatus(updated)
    return updated
  }

  private step() {
    this.tick++

    // Orbit angle increments continuously
    const orbitPeriod = 113 * 60 * 1000 // 113 min in ms
    const orbitAngleValue = ((Date.now() - this.missionStart) % orbitPeriod) / orbitPeriod * 360

    this.data = {
      altitude: this.updateChannel(this.data.altitude, 0.004),
      velocity: this.updateChannel(this.data.velocity, 0.003),
      temperature: this.updateChannel(this.data.temperature, 0.008),
      powerOutput: this.updateChannel(this.data.powerOutput, 0.006),
      signalStrength: this.updateChannel(this.data.signalStrength, 0.01),
      dataRate: this.updateChannel(this.data.dataRate, 0.015),
      batteryLevel: this.updateChannel(this.data.batteryLevel, 0.002),
      orbitAngle: { ...this.data.orbitAngle, value: orbitAngleValue },
    }

    // Check for alerts
    Object.values(this.data).forEach((ch) => {
      if (ch.status === 'critical' && Math.random() < 0.1) {
        const alert: Alert = {
          id: `${ch.id}-${Date.now()}`,
          timestamp: Date.now(),
          severity: 'critical',
          channel: ch.label,
          message: `${ch.label} out of range: ${ch.value.toFixed(2)} ${ch.unit}`,
          acknowledged: false,
        }
        this.alertListeners.forEach((cb) => cb(alert))
      }
    })

    this.listeners.forEach((cb) => cb(this.data))
  }

  start() {
    if (this.interval) return
    this.interval = setInterval(() => this.step(), 150)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  subscribe(cb: (data: TelemetryData) => void) {
    this.listeners.add(cb)
    cb(this.data) // immediate initial value
    return () => this.listeners.delete(cb)
  }

  subscribeAlerts(cb: (alert: Alert) => void) {
    this.alertListeners.add(cb)
    return () => this.alertListeners.delete(cb)
  }

  getData(): TelemetryData {
    return this.data
  }

  getMissionElapsed(): number {
    return Date.now() - this.missionStart
  }

  getOrbitCount(): number {
    const orbitPeriod = 113 * 60 * 1000
    return Math.floor((Date.now() - this.missionStart) / orbitPeriod)
  }
}

export const telemetrySimulator = new TelemetrySimulator()
