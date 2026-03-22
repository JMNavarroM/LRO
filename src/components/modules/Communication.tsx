import { useState, useEffect } from 'react'
import { Wifi, Radio, Upload, Download, Clock } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import { TelemetryChart } from '../ui/TelemetryChart'
import type { TelemetryData } from '../../types'

interface CommunicationProps {
  data: TelemetryData
}

const DSN_STATIONS = [
  { id: 'dss14', name: 'DSS-14 Mars', location: 'Goldstone, CA', active: true, elevation: 42.3 },
  { id: 'dss65', name: 'DSS-65 Madrid', location: 'Robledo, Spain', active: false, elevation: -12.1 },
  { id: 'dss43', name: 'DSS-43 Canberra', location: 'Tidbinbilla, AU', active: false, elevation: -28.4 },
]

function SignalGauge({ value }: { value: number }) {
  const bars = 12
  const activeBars = Math.floor((value / 100) * bars)
  const color = value > 70 ? '#22c55e' : value > 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex items-end gap-0.5 h-10">
      {Array.from({ length: bars }).map((_, i) => {
        const active = i < activeBars
        const height = 20 + (i / bars) * 80
        return (
          <div
            key={i}
            className="w-2 rounded-sm transition-all duration-300"
            style={{
              height: `${height}%`,
              backgroundColor: active ? color : 'rgba(255,255,255,0.06)',
              boxShadow: active ? `0 0 4px ${color}60` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

function ArcGauge({ value, label, color = '#00b4d8' }: { value: number; label: string; color?: string }) {
  const r = 54
  const circumference = Math.PI * r // half circle
  const progress = (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={130} height={75} viewBox="0 0 130 75">
        {/* Track */}
        <path
          d={`M 10 70 A ${r} ${r} 0 0 1 120 70`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M 10 70 A ${r} ${r} 0 0 1 120 70`}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        {/* Value */}
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize={18} fontWeight="bold" fontFamily="JetBrains Mono">
          {value.toFixed(0)}
        </text>
        <text x="65" y="72" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="JetBrains Mono">%</text>
      </svg>
      <span className="text-xxs text-slate-500 font-mono tracking-wider">{label}</span>
    </div>
  )
}

export function Communication({ data }: CommunicationProps) {
  const [transfered, setTransfered] = useState(842.7)
  const [contactWindow, setContactWindow] = useState(1847)

  useEffect(() => {
    const t = setInterval(() => {
      setTransfered(v => v + data.dataRate.value * 0.001)
      setContactWindow(v => Math.max(0, v - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [data.dataRate.value])

  const cwMins = Math.floor(contactWindow / 60)
  const cwSecs = contactWindow % 60

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Communication Systems</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">DSN uplink/downlink status and data transfer</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Signal strength */}
        <GlassCard className="p-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signal Strength</h3>
          <div className="flex items-end justify-between">
            <SignalGauge value={data.signalStrength.value} />
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-white">{data.signalStrength.value.toFixed(0)}</div>
              <div className="text-xs font-mono text-slate-500">%</div>
            </div>
          </div>
          <StatusDot
            status={data.signalStrength.value > 60 ? 'nominal' : data.signalStrength.value > 30 ? 'warning' : 'critical'}
            size="sm" showLabel
          />
        </GlassCard>

        {/* Data rate */}
        <GlassCard className="p-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Transfer Rate</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Download size={12} className="text-green-400" /> Downlink
              </div>
              <span className="font-mono font-bold text-white text-sm">{data.dataRate.value.toFixed(2)} <span className="text-xs text-slate-500">Mbps</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Upload size={12} className="text-lro-accent" /> Uplink
              </div>
              <span className="font-mono font-bold text-white text-sm">{(data.dataRate.value * 0.05).toFixed(3)} <span className="text-xs text-slate-500">Mbps</span></span>
            </div>
          </div>
          <div className="mt-1">
            <div className="text-xxs text-slate-500 font-mono">SESSION TRANSFERRED</div>
            <div className="text-sm font-mono font-bold text-lro-accent">{transfered.toFixed(1)} GB</div>
          </div>
        </GlassCard>

        {/* Contact window */}
        <GlassCard className="p-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Window</h3>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-lro-accent" />
            <div>
              <div className="text-2xl font-bold font-mono text-white">
                {cwMins.toString().padStart(2,'0')}:{cwSecs.toString().padStart(2,'0')}
              </div>
              <div className="text-xxs font-mono text-slate-500">REMAINING</div>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${(contactWindow / 2400) * 100}%`,
                background: 'linear-gradient(90deg, #00b4d8, #38bdf8)',
              }} />
          </div>
          <div className="text-xxs font-mono text-slate-600">Next pass: +47 min</div>
        </GlassCard>
      </div>

      {/* Signal gauges */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Link Quality Metrics</h3>
        <div className="flex flex-wrap justify-around gap-4">
          <ArcGauge value={data.signalStrength.value} label="SIGNAL STRENGTH" color="#00b4d8" />
          <ArcGauge value={Math.min(100, data.dataRate.value)} label="BANDWIDTH UTIL" color="#38bdf8" />
          <ArcGauge value={98.7} label="LINK INTEGRITY" color="#22c55e" />
          <ArcGauge value={100 - (data.signalStrength.value * 0.02)} label="BIT ERROR RATE" color="#a78bfa" />
        </div>
      </GlassCard>

      {/* DSN stations */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Deep Space Network</h3>
        <div className="space-y-3">
          {DSN_STATIONS.map((station) => (
            <div key={station.id} className="flex items-center gap-4 p-3 rounded-xl transition-all"
              style={{
                background: station.active ? 'rgba(0,180,216,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${station.active ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.05)'}`,
              }}>
              <StatusDot status={station.active ? 'live' : 'offline'} size="md" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{station.name}</div>
                <div className="text-xs text-slate-500 font-mono">{station.location}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono" style={{ color: station.elevation > 0 ? '#22c55e' : '#6b7280' }}>
                  EL {station.elevation > 0 ? '+' : ''}{station.elevation.toFixed(1)}°
                </div>
                <div className="text-xxs font-mono text-slate-600">
                  {station.active ? 'IN CONTACT' : 'BELOW HORIZON'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Signal chart */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Signal Strength History</h3>
        <TelemetryChart channel={data.signalStrength} height={140} />
      </GlassCard>
    </div>
  )
}
