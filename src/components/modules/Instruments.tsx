import { useState, useEffect } from 'react'
import { Telescope, Camera, Radio, Zap, Wind, Radiation, Atom } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { TelemetryData } from '../../types'

interface InstrumentsProps {
  data: TelemetryData
}

type InstrumentStatus = 'operational' | 'standby' | 'maintenance' | 'fault'

interface InstrumentDef {
  id: string
  name: string
  short: string
  desc: string
  icon: React.ReactNode
  dataRate: number
  health: number
  status: InstrumentStatus
  observations: number
  color: string
}

const STATUS_MAP: Record<InstrumentStatus, 'nominal' | 'warning' | 'critical' | 'offline'> = {
  operational: 'nominal',
  standby: 'warning',
  maintenance: 'warning',
  fault: 'critical',
}

const INSTRUMENTS: InstrumentDef[] = [
  {
    id: 'lroc-wac', name: 'Lunar Reconnaisance Orbiter Camera (Wide)', short: 'LROC WAC',
    desc: 'Wide-angle camera providing 100m/pixel global coverage in 7 color bands',
    icon: <Camera size={20} />, dataRate: 28.2, health: 98.7,
    status: 'operational', observations: 4821093, color: '#00b4d8',
  },
  {
    id: 'lroc-nac', name: 'Lunar Reconnaisance Orbiter Camera (Narrow)', short: 'LROC NAC',
    desc: 'High-resolution 0.5m/pixel imaging of lunar surface features',
    icon: <Camera size={20} />, dataRate: 48.1, health: 99.1,
    status: 'operational', observations: 2341876, color: '#38bdf8',
  },
  {
    id: 'minirf', name: 'Miniature Radio Frequency', short: 'Mini-RF',
    desc: 'Synthetic aperture radar for subsurface imaging and ice detection',
    icon: <Radio size={20} />, dataRate: 12.4, health: 94.2,
    status: 'operational', observations: 892341, color: '#a78bfa',
  },
  {
    id: 'lamp', name: 'Lyman Alpha Mapping Project', short: 'LAMP',
    desc: 'UV spectrograph mapping lunar surface composition and exosphere',
    icon: <Zap size={20} />, dataRate: 4.8, health: 97.5,
    status: 'operational', observations: 1203847, color: '#f59e0b',
  },
  {
    id: 'lend', name: 'Lunar Exploration Neutron Detector', short: 'LEND',
    desc: 'Neutron detector mapping hydrogen deposits and water ice',
    icon: <Atom size={20} />, dataRate: 2.1, health: 91.3,
    status: 'standby', observations: 765234, color: '#34d399',
  },
  {
    id: 'diviner', name: 'Diviner Lunar Radiometer Experiment', short: 'DIVINER',
    desc: 'Thermal radiometer measuring surface temperatures from -240°C to 120°C',
    icon: <Wind size={20} />, dataRate: 6.2, health: 96.8,
    status: 'operational', observations: 3289471, color: '#fb923c',
  },
  {
    id: 'crater', name: 'Cosmic Ray Telescope for Effects of Radiation', short: 'CRaTER',
    desc: 'Characterizing the lunar radiation environment for future missions',
    icon: <Radiation size={20} />, dataRate: 0.8, health: 99.4,
    status: 'operational', observations: 981234, color: '#f43f5e',
  },
]

export function Instruments({ data }: InstrumentsProps) {
  const [instruments, setInstruments] = useState(INSTRUMENTS)
  const [selected, setSelected] = useState<string | null>(null)

  // Slightly fluctuate health and data rates
  useEffect(() => {
    const t = setInterval(() => {
      setInstruments(prev => prev.map(inst => ({
        ...inst,
        health: Math.max(80, Math.min(100, inst.health + (Math.random() - 0.5) * 0.2)),
        dataRate: Math.max(0, inst.dataRate + (Math.random() - 0.5) * 0.3),
        observations: inst.status === 'operational' ? inst.observations + Math.floor(Math.random() * 3) : inst.observations,
      })))
    }, 1500)
    return () => clearInterval(t)
  }, [])

  const operational = instruments.filter(i => i.status === 'operational').length
  const totalDataRate = instruments.reduce((sum, i) => sum + (i.status === 'operational' ? i.dataRate : 0), 0)
  const selectedInst = instruments.find(i => i.id === selected)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Scientific Instruments</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">7 instruments — {operational} operational</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-3 py-1.5">
            <span className="text-xxs text-slate-500 font-mono">TOTAL DATA RATE </span>
            <span className="text-xs font-mono font-bold text-lro-accent">{totalDataRate.toFixed(1)} Mbps</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {instruments.map((inst) => (
          <GlassCard
            key={inst.id}
            className={`p-4 cursor-pointer transition-all ${selected === inst.id ? 'border-lro-500/40' : ''}`}
            onClick={() => setSelected(selected === inst.id ? null : inst.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${inst.color}18`, border: `1px solid ${inst.color}30`, color: inst.color }}>
                  {inst.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{inst.short}</div>
                  <div className="text-xxs text-slate-500 font-mono">{inst.name.split('(')[0].trim()}</div>
                </div>
              </div>
              <StatusDot status={STATUS_MAP[inst.status]} size="sm" showLabel />
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">{inst.desc}</p>

            {/* Health bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-mono">
                <span className="text-slate-500">HEALTH</span>
                <span style={{ color: inst.health > 95 ? '#22c55e' : inst.health > 85 ? '#f59e0b' : '#ef4444' }}>
                  {inst.health.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${inst.health}%`,
                    backgroundColor: inst.health > 95 ? inst.color : inst.health > 85 ? '#f59e0b' : '#ef4444',
                    boxShadow: `0 0 6px ${inst.color}60`,
                  }} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div className="text-xxs font-mono text-slate-500">
                <span className="text-slate-400">{inst.dataRate.toFixed(1)}</span> Mbps
              </div>
              <div className="text-xxs font-mono text-slate-500">
                <span className="text-slate-400">{inst.observations.toLocaleString()}</span> obs
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Detail panel */}
      {selectedInst && (
        <GlassCard className="p-4" icy>
          <h3 className="text-sm font-semibold text-lro-accent mb-2">{selectedInst.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Status', value: selectedInst.status.toUpperCase() },
              { label: 'Health', value: `${selectedInst.health.toFixed(2)}%` },
              { label: 'Data Rate', value: `${selectedInst.dataRate.toFixed(2)} Mbps` },
              { label: 'Observations', value: selectedInst.observations.toLocaleString() },
            ].map(s => (
              <div key={s.label}>
                <div className="text-xxs text-slate-500 font-mono">{s.label.toUpperCase()}</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
