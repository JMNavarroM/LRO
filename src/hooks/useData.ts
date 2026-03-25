import { useEffect, useState } from 'react'
import { dataSimulator } from '../services/dataSimulator'
import type { DashboardData, Alert } from '../types'

export function useData() {
  const [data, setData] = useState<DashboardData>(dataSimulator.getData())
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    dataSimulator.start()
    const unsubData = dataSimulator.subscribe(setData)
    const unsubAlerts = dataSimulator.subscribeAlerts((alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20))
    })
    return () => { unsubData(); unsubAlerts() }
  }, [])

  const dismissAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id))

  return { data, alerts, dismissAlert, sessionElapsed: dataSimulator.getSessionElapsed() }
}
