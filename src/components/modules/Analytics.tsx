import { TelemetryChart } from '../ui/TelemetryChart'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { DashboardData } from '../../types'

interface AnalyticsProps {
  data: DashboardData
}

export function Analytics({ data }: AnalyticsProps) {
  const channels = Object.values(data)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Analytics</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">Historical trends — 150ms refresh</p>
      </div>

      <div className="space-y-4">
        {channels.map((ch, i) => {
          const colors = ['#00b4d8','#38bdf8','#a78bfa','#f59e0b','#34d399','#fb923c']
          const color = colors[i % colors.length]
          return (
            <GlassCard key={ch.id} className="p-4">
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
    </div>
  )
}
