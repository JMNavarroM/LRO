import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { AlertBanner } from '../ui/AlertBanner'
import { useAppStore } from '../../store/appStore'
import { useTelemetry } from '../../hooks/useTelemetry'

// Module pages
import { Dashboard } from '../modules/Dashboard'
import { TelemetryModule } from '../modules/Telemetry'
import { OrbitalMechanics } from '../modules/OrbitalMechanics'
import { Instruments } from '../modules/Instruments'
import { Communication } from '../modules/Communication'
import { ThermalSystems } from '../modules/ThermalSystems'
import { PowerSystems } from '../modules/PowerSystems'

interface MainLayoutProps {
  onLogout: () => void
}

const MODULE_COMPONENTS = {
  dashboard: Dashboard,
  telemetry: TelemetryModule,
  orbital: OrbitalMechanics,
  instruments: Instruments,
  communication: Communication,
  thermal: ThermalSystems,
  power: PowerSystems,
}

export function MainLayout({ onLogout }: MainLayoutProps) {
  const { activeModule } = useAppStore()
  const { data, alerts, dismissAlert, missionElapsed, orbitCount } = useTelemetry()

  const ActiveComponent = MODULE_COMPONENTS[activeModule]

  return (
    <div className="fixed inset-0 flex" style={{ background: '#050a14' }}>
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00b4d8 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full opacity-4"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar
          missionElapsed={missionElapsed}
          orbitCount={orbitCount}
          alerts={alerts}
          onAlertsClick={() => {}}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 xl:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ActiveComponent data={data} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Alert notifications */}
      <AlertBanner alerts={alerts} onDismiss={dismissAlert} />
    </div>
  )
}
