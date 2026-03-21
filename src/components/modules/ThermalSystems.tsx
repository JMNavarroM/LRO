import { useState, useEffect } from 'react'
import { Thermometer, AlertTriangle } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { TelemetryChart } from '../ui/TelemetryChart'
import type { TelemetryData } from '../../types'

interface ThermalSystemsProps {
  data: TelemetryData
}

interface ThermalZone {
  id: string
  label: string
  temp: number
  nominal: number
  min: number
  max: number
  x: number
  y: number
  w: number
  h: number
}

function tempToColor(temp: number, min: number, max: number): string {
  const t = (temp - min) / (max - min)
  if (t < 0.25) return `rgba(56, 189, 248, ${0.4 + t * 1.2})`
  if (t < 0.5) return `rgba(0, 180, 216, ${0.5 + t})`
  if (t < 0.75) return `rgba(245, 158, 11, ${0.4 + t * 0.8})`
  return `rgba(239, 68, 68, ${0.5 + t * 0.5})`
}

function tempToStatus(temp: number, min: number, max: number): string {
  const range = max - min
  const pct = (temp - min) / range
  if (pct < 0.15 || pct > 0.85) return 'text-red-400'
  if (pct < 0.25 || pct > 0.75) return 'text-yellow-400'
  return 'text-green-400'
}

const BASE_ZONES: Omit<ThermalZone, 'temp'>[] = [
  { id: 'bus-top', label: 'Bus (Top)', nominal: -30, min: -80, max: 50, x: 20, y: 20, w: 160, h: 40 },
  { id: 'bus-bottom', label: 'Bus (Bottom)', nominal: -45, min: -100, max: 30, x: 20, y: 100, w: 160, h: 40 },
  { id: 'solar-a', label: 'Solar Array A', nominal: 80, min: -150, max: 120, x: 190, y: 50, w: 60, h: 60 },
  { id: 'solar-b', label: 'Solar Array B', nominal: 80, min: -150, max: 120, x: -50, y: 50, w: 60, h: 60 },
  { id: 'star-tracker', label: 'Star Tracker', nominal: -20, min: -60, max: 20, x: 20, y: 70, w: 40, h: 20 },
  { id: 'hga', label: 'HGA', nominal: 10, min: -40, max: 80, x: 100, y: 150, w: 60, h: 30 },
]

export function ThermalSystems({ data }: ThermalSystemsProps) {
  const [zones, setZones] = useState<ThermalZone[]>(
    BASE_ZONES.map(z => ({
      ...z,
      temp: z.nominal + (Math.random() - 0.5) * 10,
    }))
  )

  useEffect(() => {
    const t = setInterval(() => {
      setZones(prev => prev.map(z => ({
        ...z,
        temp: Math.max(z.min, Math.min(z.max, z.temp + (Math.random() - 0.5) * 0.8 + (z.nominal - z.temp) * 0.01)),
      })))
    }, 800)
    return () => clearInterval(t)
  }, [])

  const hottest = zones.reduce((a, b) => a.temp > b.temp ? a : b)
  const coldest = zones.reduce((a, b) => a.temp < b.temp ? a : b)
  const criticalZones = zones.filter(z => Math.abs(z.temp - z.nominal) / (z.max - z.min) > 0.25)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Thermal Management</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Probe temperature distribution and control</p>
        </div>
        {criticalZones.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-xs font-mono text-yellow-400">{criticalZones.length} zone{criticalZones.length > 1 ? 's' : ''} attention</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Probe diagram */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Thermal Map</h3>
          <div className="flex justify-center">
            <svg width={300} height={220} viewBox="-70 0 340 220">
              <defs>
                {zones.map(z => (
                  <radialGradient key={z.id} id={`thermal-${z.id}`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={tempToColor(z.temp, -150, 120)} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={tempToColor(z.temp, -150, 120)} stopOpacity={0.3} />
                  </radialGradient>
                ))}
              </defs>

              {/* Solar Array B (left) */}
              <rect x={-50} y={50} width={60} height={60} rx={4}
                fill={`url(#thermal-solar-b)`}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text x={-20} y={85} textAnchor="middle" fill="white" fontSize={7} fontFamily="JetBrains Mono">SOLAR-B</text>
              <text x={-20} y={95} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8} fontFamily="JetBrains Mono">
                {zones.find(z => z.id === 'solar-b')?.temp.toFixed(0)}°C
              </text>

              {/* Connecting struts */}
              <line x1={10} y1={70} x2={20} y2={70} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
              <line x1={180} y1={70} x2={190} y2={70} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />

              {/* Main bus */}
              <rect x={20} y={20} width={160} height={140} rx={8}
                fill="rgba(20,25,40,0.8)" stroke="rgba(0,180,216,0.2)" strokeWidth={1.5} />

              {/* Bus zones */}
              <rect x={20} y={20} width={160} height={40} rx={8}
                fill={`url(#thermal-bus-top)`} opacity={0.7} />
              <rect x={20} y={100} width={160} height={40} rx={0}
                fill={`url(#thermal-bus-bottom)`} opacity={0.7} />

              {/* Star tracker */}
              <rect x={20} y={70} width={40} height={20} rx={3}
                fill={`url(#thermal-star-tracker)`} opacity={0.8} />
              <text x={40} y={83} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={6} fontFamily="JetBrains Mono">ST</text>

              {/* Bus labels */}
              <text x={100} y={44} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={8} fontFamily="JetBrains Mono">TOP</text>
              <text x={100} y={55} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={9} fontFamily="JetBrains Mono" fontWeight="bold">
                {zones.find(z => z.id === 'bus-top')?.temp.toFixed(1)}°C
              </text>
              <text x={100} y={118} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={8} fontFamily="JetBrains Mono">BOTTOM</text>
              <text x={100} y={130} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={9} fontFamily="JetBrains Mono" fontWeight="bold">
                {zones.find(z => z.id === 'bus-bottom')?.temp.toFixed(1)}°C
              </text>

              {/* HGA */}
              <ellipse cx={130} cy={168} rx={30} ry={12}
                fill={`url(#thermal-hga)`} opacity={0.7}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <line x1={130} y1={160} x2={130} y2={156} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              <text x={130} y={172} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={7} fontFamily="JetBrains Mono">HGA</text>

              {/* Solar Array A (right) */}
              <rect x={190} y={50} width={60} height={60} rx={4}
                fill={`url(#thermal-solar-a)`}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text x={220} y={85} textAnchor="middle" fill="white" fontSize={7} fontFamily="JetBrains Mono">SOLAR-A</text>
              <text x={220} y={95} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8} fontFamily="JetBrains Mono">
                {zones.find(z => z.id === 'solar-a')?.temp.toFixed(0)}°C
              </text>

              {/* Color scale */}
              <defs>
                <linearGradient id="scale-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(56,189,248,0.8)" />
                  <stop offset="50%" stopColor="rgba(0,180,216,0.8)" />
                  <stop offset="75%" stopColor="rgba(245,158,11,0.8)" />
                  <stop offset="100%" stopColor="rgba(239,68,68,0.8)" />
                </linearGradient>
              </defs>
              <rect x={20} y={200} width={160} height={6} rx={3} fill="url(#scale-grad)" />
              <text x={20} y={214} fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="JetBrains Mono">-150°C</text>
              <text x={155} y={214} fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="JetBrains Mono">+120°C</text>
            </svg>
          </div>
        </GlassCard>

        {/* Zone details */}
        <div className="space-y-2">
          {zones.map((zone) => {
            const pct = ((zone.temp - zone.min) / (zone.max - zone.min)) * 100
            const statusClass = tempToStatus(zone.temp, zone.min, zone.max)
            return (
              <GlassCard key={zone.id} className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">{zone.label}</span>
                  <span className={`text-sm font-mono font-bold ${statusClass}`}>
                    {zone.temp > 0 ? '+' : ''}{zone.temp.toFixed(1)}°C
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, pct)}%`,
                      background: tempToColor(zone.temp, zone.min, zone.max),
                    }} />
                </div>
                <div className="flex justify-between mt-1 text-xxs font-mono text-slate-600">
                  <span>{zone.min}°</span>
                  <span className="text-slate-500">nom: {zone.nominal}°C</span>
                  <span>{zone.max}°</span>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-3 text-center">
          <div className="text-xxs text-slate-500 font-mono mb-1">HOTTEST ZONE</div>
          <div className="text-sm font-bold text-red-400 font-mono">{hottest.temp.toFixed(1)}°C</div>
          <div className="text-xxs text-slate-600">{hottest.label}</div>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <div className="text-xxs text-slate-500 font-mono mb-1">BUS TEMPERATURE</div>
          <div className="text-sm font-bold font-mono" style={{ color: '#00b4d8' }}>{data.temperature.value.toFixed(1)}°C</div>
          <div className="text-xxs text-slate-600">Main spacecraft bus</div>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <div className="text-xxs text-slate-500 font-mono mb-1">COLDEST ZONE</div>
          <div className="text-sm font-bold text-blue-400 font-mono">{coldest.temp.toFixed(1)}°C</div>
          <div className="text-xxs text-slate-600">{coldest.label}</div>
        </GlassCard>
      </div>

      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Bus Temperature History</h3>
        <TelemetryChart channel={data.temperature} height={140} />
      </GlassCard>
    </div>
  )
}
