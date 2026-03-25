import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { MetricWidget } from '../ui/MetricWidget'
import { GlassCard } from '../ui/GlassCard'
import { StatusDot } from '../ui/StatusDot'
import type { DashboardData } from '../../types'

interface OverviewProps {
  data: DashboardData
}

export function Overview({ data }: OverviewProps) {
  const channels = Object.values(data)
  const nominal  = channels.filter((c) => c.status === 'nominal').length
  const warnings  = channels.filter((c) => c.status === 'warning').length
  const criticals = channels.filter((c) => c.status === 'critical').length
  const overall   = criticals > 0 ? 'critical' : warnings > 0 ? 'warning' : 'nominal'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Overview</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time system metrics</p>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-2">
          <StatusDot status={overall} size="sm" />
          <span className="text-xs font-mono font-semibold" style={{
            color: overall === 'nominal' ? '#22c55e' : overall === 'critical' ? '#ef4444' : '#f59e0b'
          }}>
            {overall.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL METRICS', value: String(channels.length),  icon: <Activity size={14} /> },
          { label: 'NOMINAL',       value: String(nominal),           icon: <CheckCircle size={14} className="text-green-400" /> },
          { label: 'WARNINGS',      value: String(warnings),          icon: <TrendingUp size={14} className="text-yellow-400" /> },
          { label: 'CRITICAL',      value: String(criticals),         icon: <AlertTriangle size={14} className="text-red-400" /> },
        ].map((s) => (
          <div key={s.label} className="glass-card px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              {s.icon}
              <span className="text-xxs font-mono tracking-widest">{s.label}</span>
            </div>
            <div className="text-sm font-bold text-lro-accent font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Metric widgets */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {channels.map((ch) => (
          <MetricWidget key={ch.id} channel={ch} icon={<Activity size={16} />} />
        ))}
      </div>

      {/* System health table */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">System Health</h3>
        <div className="space-y-2">
          {channels.map((ch) => (
            <div key={ch.id} className="flex items-center gap-3">
              <StatusDot status={ch.status} size="sm" />
              <span className="text-xs text-slate-400 flex-1 truncate">{ch.label}</span>
              <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((ch.value - ch.min) / (ch.max - ch.min)) * 100}%`,
                    backgroundColor: ch.status === 'nominal' ? '#00b4d8' : ch.status === 'warning' ? '#f59e0b' : '#ef4444',
                  }} />
              </div>
              <span className="text-xxs font-mono text-slate-500 w-20 text-right">
                {ch.value.toFixed(1)} {ch.unit}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
