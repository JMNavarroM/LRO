import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { DashboardData } from '../../types'

interface MonitorsProps {
  data: DashboardData
}

export function Monitors({ data }: MonitorsProps) {
  const channels = Object.values(data)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Monitors</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">Live data stream — raw values</p>
      </div>

      {/* Live feed */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Raw Data Stream</h3>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xxs font-mono text-green-400">STREAMING</span>
          </div>
        </div>
        <div className="space-y-1 font-mono text-xs max-h-60 overflow-y-auto">
          {channels.map((ch) => (
            <div key={ch.id} className="flex items-center gap-2 py-0.5">
              <span className="text-slate-600 text-xxs w-20 flex-shrink-0">
                {new Date().toISOString().slice(11, 23)}
              </span>
              <span className="text-slate-500 w-28 truncate flex-shrink-0">{ch.id.toUpperCase()}</span>
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

      {/* Per-channel cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {channels.map((ch) => {
          const pct = ((ch.value - ch.min) / (ch.max - ch.min)) * 100
          return (
            <GlassCard key={ch.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={ch.status} size="sm" />
                  <span className="text-sm font-semibold text-slate-200">{ch.label}</span>
                </div>
                <span className="text-lg font-bold font-mono text-white">
                  {ch.value.toFixed(2)}
                  <span className="text-xs text-slate-500 ml-1">{ch.unit}</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(2, Math.min(100, pct))}%`,
                    backgroundColor: ch.status === 'nominal' ? '#00b4d8' : ch.status === 'warning' ? '#f59e0b' : '#ef4444',
                  }} />
              </div>
              <div className="flex justify-between mt-1 text-xxs font-mono text-slate-600">
                <span>{ch.min} {ch.unit}</span>
                <span className="text-slate-500">nominal: {ch.nominal}</span>
                <span>{ch.max} {ch.unit}</span>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
