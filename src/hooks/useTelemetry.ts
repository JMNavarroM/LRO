import { useEffect, useState } from 'react'
import { telemetrySimulator } from '../services/telemetrySimulator'
import type { TelemetryData, Alert } from '../types'

export function useTelemetry() {
  const [data, setData] = useState<TelemetryData>(telemetrySimulator.getData())
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    telemetrySimulator.start()

    const unsubData = telemetrySimulator.subscribe(setData)
    const unsubAlerts = telemetrySimulator.subscribeAlerts((alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20))
    })

    return () => {
      unsubData()
      unsubAlerts()
    }
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  return {
    data,
    alerts,
    dismissAlert,
    missionElapsed: telemetrySimulator.getMissionElapsed(),
    orbitCount: telemetrySimulator.getOrbitCount(),
  }
}
