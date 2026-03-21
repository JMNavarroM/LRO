import { useMemo } from 'react'
import { Navigation, Gauge, Thermometer, Zap, Wifi, Battery, Globe, Activity } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { MetricWidget } from '../ui/MetricWidget'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { TelemetryData } from '../../types'
import { telemetrySimulator } from '../../services/telemetrySimulator'

interface DashboardProps {
  data: TelemetryData
}

function formatMET(ms: number) {
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

export function Dashboard({ data }: DashboardProps) {
  const metrics = [
    { channel: data.altitude, icon: <Navigation size={16} /> },
    { channel: data.velocity, icon: <Gauge size={16} /> },
    { channel: data.temperature, icon: <Thermometer size={16} /> },
    { channel: data.powerOutput, icon: <Zap size={16} /> },
    { channel: data.signalStrength, icon: <Wifi size={16} /> },
    { channel: data.batteryLevel, icon: <Battery size={16} /> },
  ]

  const orbitData = useMemo(() =>
    data.orbitAngle.history.slice(-40).map(h => ({ v: h.value })), [data.orbitAngle.history])

  const systemStatus = Object.values(data).every(ch => ch.status === 'nominal') ? 'nominal' :
    Object.values(data).some(ch => ch.status === 'critical') ? 'critical' : 'warning'

  const operationalCount = Object.values(data).filter(ch => ch.status === 'nominal').length

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Mission Dashboard</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Lunar Reconnaissance Orbiter — Real-time Overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-3 py-1.5 flex items-center gap-2">
            <StatusDot status={systemStatus} size="sm" />
            <span className="text-xs font-mono font-semibold" style={{
              color: systemStatus === 'nominal' ? '#22c55e' : systemStatus === 'critical' ? '#ef4444' : '#f59e0b'
            }}>
              SYS {systemStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Mission stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'MISSION ELAPSED', value: formatMET(telemetrySimulator.getMissionElapsed()), icon: <Activity size={14} /> },
          { label: 'TOTAL ORBITS', value: `#${telemetrySimulator.getOrbitCount().toLocaleString()}`, icon: <Globe size={14} /> },
          { label: 'SYSTEMS OK', value: `${operationalCount}/8`, icon: <StatusDot status="nominal" size="sm" /> },
          { label: 'PHASE', value: 'NOMINAL OPS', icon: <Zap size={14} /> },
        ].map((stat) => (
          <div key={stat.label} className="glass-card px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>{stat.icon}</span>
              <span className="text-xxs font-mono tracking-widest">{stat.label}</span>
            </div>
            <div className="text-sm font-bold text-lro-accent font-mono">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ channel, icon }) => (
          <MetricWidget key={channel.id} channel={channel} icon={icon} />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Orbit progress */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-300">Orbital Angle</h3>
            <span className="text-xs font-mono text-lro-accent">{data.orbitAngle.value.toFixed(1)}°</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orbitData} margin={{ top: 2, right: 2, left: -36, bottom: -8 }}>
                <defs>
                  <linearGradient id="orbit-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00b4d8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00b4d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  formatter={(v: number) => [`${v.toFixed(1)}°`, 'Angle']}
                />
                <Area type="monotone" dataKey="v" stroke="#00b4d8" strokeWidth={2} fill="url(#orbit-grad)" isAnimationActive={false} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Orbit ring visualization */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(data.orbitAngle.value / 360) * 100}%`,
                  background: 'linear-gradient(90deg, #00b4d8, #38bdf8)',
                  boxShadow: '0 0 8px rgba(0,180,216,0.5)',
                }} />
            </div>
            <span className="text-xxs font-mono text-slate-600">
              {((data.orbitAngle.value / 360) * 100).toFixed(0)}%
            </span>
          </div>
        </GlassCard>

        {/* System health */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">System Health</h3>
          <div className="space-y-2">
            {Object.values(data).slice(0, 7).map((ch) => (
              <div key={ch.id} className="flex items-center gap-3">
                <StatusDot status={ch.status} size="sm" />
                <span className="text-xs text-slate-400 flex-1 truncate">{ch.label}</span>
                <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((ch.value - ch.min) / (ch.max - ch.min)) * 100}%`,
                      backgroundColor: ch.status === 'nominal' ? '#00b4d8' : ch.status === 'warning' ? '#f59e0b' : '#ef4444',
                    }} />
                </div>
                <span className="text-xxs font-mono text-slate-600 w-8 text-right">
                  {ch.status === 'nominal' ? 'OK' : ch.status.toUpperCase().slice(0, 4)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
