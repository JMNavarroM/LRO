import { useState } from 'react'
import { Activity, Download, Filter } from 'lucide-react'
import { TelemetryChart } from '../ui/TelemetryChart'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { TelemetryData, TelemetryChannel } from '../../types'

interface TelemetryModuleProps {
  data: TelemetryData
}

type ChannelKey = keyof TelemetryData

const ALL_CHANNELS: { key: ChannelKey; color: string }[] = [
  { key: 'altitude', color: '#00b4d8' },
  { key: 'velocity', color: '#38bdf8' },
  { key: 'temperature', color: '#f59e0b' },
  { key: 'powerOutput', color: '#22c55e' },
  { key: 'signalStrength', color: '#a78bfa' },
  { key: 'dataRate', color: '#fb923c' },
  { key: 'batteryLevel', color: '#34d399' },
]

function DataRateTicker({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.1)' }}>
      <Activity size={12} className="text-lro-accent animate-pulse" />
      <span className="text-xs font-mono text-slate-400">INGESTION</span>
      <span className="text-xs font-mono font-bold text-lro-accent">{value.toFixed(2)} Mbps</span>
    </div>
  )
}

export function TelemetryModule({ data }: TelemetryModuleProps) {
  const [selectedChannels, setSelectedChannels] = useState<Set<ChannelKey>>(
    new Set(['altitude', 'velocity', 'temperature'])
  )

  const toggleChannel = (key: ChannelKey) => {
    setSelectedChannels(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Live Telemetry</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time data ingestion — 150ms refresh</p>
        </div>
        <DataRateTicker value={data.dataRate.value} />
      </div>

      {/* Channel selector */}
      <GlassCard className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-500" />
          <span className="text-xxs text-slate-500 font-mono mr-1">CHANNELS:</span>
          {ALL_CHANNELS.map(({ key, color }) => {
            const ch: TelemetryChannel = data[key]
            const active = selectedChannels.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleChannel(key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                  color: active ? color : 'rgba(255,255,255,0.3)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? color : 'rgba(255,255,255,0.15)' }} />
                {ch.label}
                <StatusDot status={ch.status} size="sm" />
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Charts */}
      <div className="space-y-4">
        {ALL_CHANNELS
          .filter(({ key }) => selectedChannels.has(key))
          .map(({ key, color }) => {
            const ch: TelemetryChannel = data[key]
            return (
              <GlassCard key={key} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                    <h3 className="text-sm font-semibold text-slate-200">{ch.label}</h3>
                    <StatusDot status={ch.status} size="sm" showLabel />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">MIN </span>
                      <span className="text-xs font-mono text-slate-400">{ch.min}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">NOM </span>
                      <span className="text-xs font-mono text-lro-accent">{ch.nominal}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">CUR </span>
                      <span className="text-sm font-mono font-bold text-white">{ch.value.toFixed(2)}</span>
                      <span className="text-xs font-mono text-slate-500 ml-1">{ch.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">MAX </span>
                      <span className="text-xs font-mono text-slate-400">{ch.max}</span>
                    </div>
                  </div>
                </div>
                <TelemetryChart channel={ch} height={160} />
              </GlassCard>
            )
          })}
      </div>

      {/* Raw data feed */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Raw Data Stream</h3>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xxs font-mono text-green-400">STREAMING</span>
          </div>
        </div>
        <div className="space-y-1 font-mono text-xs max-h-40 overflow-y-auto">
          {Object.values(data).map((ch) => (
            <div key={ch.id} className="flex items-center gap-2 py-0.5">
              <span className="text-slate-600 text-xxs w-20 flex-shrink-0">
                {new Date().toISOString().slice(11, 23)}
              </span>
              <span className="text-slate-500 w-32 truncate flex-shrink-0">{ch.id.toUpperCase()}</span>
              <span className={`w-16 text-right flex-shrink-0 ${
                ch.status === 'nominal' ? 'text-green-400' :
                ch.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {ch.value.toFixed(3)}
              </span>
              <span className="text-slate-600">{ch.unit}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
