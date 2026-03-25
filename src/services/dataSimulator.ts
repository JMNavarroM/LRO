import type { MetricChannel, DashboardData, Alert } from '../types'

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
): MetricChannel {
  return {
    id,
    label,
    unit,
    value: nominal + (Math.random() - 0.5) * (max - min) * 0.05,
    min,
    max,
    nominal,
    history: Array.from({ length: HISTORY_LENGTH }, (_, i) => ({
      timestamp: Date.now() - (HISTORY_LENGTH - i) * 150,
      value: nominal + (Math.random() - 0.5) * (max - min) * 0.06,
    })),
    status: 'nominal',
    alertThresholdLow: alertLow,
    alertThresholdHigh: alertHigh,
  }
}

function getChannelStatus(ch: MetricChannel): MetricChannel['status'] {
  const { value, alertThresholdLow, alertThresholdHigh } = ch
  if (alertThresholdLow !== undefined && value < alertThresholdLow) return 'critical'
  if (alertThresholdHigh !== undefined && value > alertThresholdHigh) return 'critical'
  const range = ch.max - ch.min
  const deviation = Math.abs(value - ch.nominal) / range
  if (deviation > 0.15) return 'warning'
  return 'nominal'
}

// ─── Replace these channels with your own data sources ───────────────────────
const INITIAL_DATA: DashboardData = {
  metric1: makeChannel('metric1', 'CPU Usage',      '%',   42,  0, 100, undefined, 90),
  metric2: makeChannel('metric2', 'Memory',         '%',   61,  0, 100, undefined, 90),
  metric3: makeChannel('metric3', 'Request Rate',   'rpm', 320, 0, 600, 50, 550),
  metric4: makeChannel('metric4', 'Latency (p99)',  'ms',  95,  0, 500, undefined, 400),
  metric5: makeChannel('metric5', 'Error Rate',     '%',   0.4, 0,  10, undefined, 5),
  metric6: makeChannel('metric6', 'Throughput',     'MB/s',48,  0, 200, 10, 180),
}
// ─────────────────────────────────────────────────────────────────────────────

class DataSimulator {
  private data: DashboardData = { ...INITIAL_DATA }
  private listeners: Set<(data: DashboardData) => void> = new Set()
  private alertListeners: Set<(alert: Alert) => void> = new Set()
  private interval: ReturnType<typeof setInterval> | null = null
  private sessionStart = Date.now()

  private updateChannel(ch: MetricChannel): MetricChannel {
    const range = ch.max - ch.min
    const noise = (Math.random() - 0.5) * range * 0.012
    const drift = (ch.nominal - ch.value) * 0.003
    let newValue = Math.max(ch.min, Math.min(ch.max, ch.value + noise + drift))

    // Occasional spike (0.5% chance)
    if (Math.random() < 0.005) {
      newValue = ch.nominal + (Math.random() - 0.5) * range * 0.4
    }

    const updated: MetricChannel = {
      ...ch,
      value: newValue,
      history: [...ch.history.slice(1), { timestamp: Date.now(), value: newValue }],
    }
    updated.status = getChannelStatus(updated)
    return updated
  }

  private step() {
    this.data = Object.fromEntries(
      Object.entries(this.data).map(([k, ch]) => [k, this.updateChannel(ch)])
    )

    Object.values(this.data).forEach((ch) => {
      if (ch.status === 'critical' && Math.random() < 0.08) {
        this.alertListeners.forEach((cb) =>
          cb({
            id: `${ch.id}-${Date.now()}`,
            timestamp: Date.now(),
            severity: 'critical',
            channel: ch.label,
            message: `${ch.label} threshold breach: ${ch.value.toFixed(2)} ${ch.unit}`,
            acknowledged: false,
          })
        )
      }
    })

    this.listeners.forEach((cb) => cb(this.data))
  }

  start() {
    if (this.interval) return
    this.interval = setInterval(() => this.step(), 150)
  }

  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval = null }
  }

  subscribe(cb: (data: DashboardData) => void) {
    this.listeners.add(cb)
    cb(this.data)
    return () => this.listeners.delete(cb)
  }

  subscribeAlerts(cb: (alert: Alert) => void) {
    this.alertListeners.add(cb)
    return () => this.alertListeners.delete(cb)
  }

  getData(): DashboardData { return this.data }
  getSessionElapsed(): number { return Date.now() - this.sessionStart }
}

export const dataSimulator = new DataSimulator()
