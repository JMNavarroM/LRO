import { useMemo } from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import type { TelemetryChannel } from '../../types'
import { StatusDot } from './StatusDot'

interface MetricWidgetProps {
  channel: TelemetryChannel
  icon: React.ReactNode
}

function formatValue(value: number, unit: string): string {
  if (unit === 'km' || unit === 'm/s' || unit === 'W') return value.toFixed(1)
  if (unit === '%') return value.toFixed(1)
  if (unit === '°C') return value.toFixed(1)
  if (unit === 'Mbps') return value.toFixed(2)
  return value.toFixed(2)
}

const STATUS_COLORS: Record<string, string> = {
  nominal: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
}

const CHART_STROKE: Record<string, string> = {
  nominal: '#00b4d8',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
}

export function MetricWidget({ channel, icon }: MetricWidgetProps) {
  const chartData = useMemo(
    () => channel.history.slice(-30).map((h) => ({ v: h.value })),
    [channel.history]
  )

  const statusColor = STATUS_COLORS[channel.status] ?? '#22c55e'
  const chartColor = CHART_STROKE[channel.status] ?? '#00b4d8'
  const deviation = ((channel.value - channel.nominal) / (channel.max - channel.min)) * 100
  const pct = ((channel.value - channel.min) / (channel.max - channel.min)) * 100

  return (
    <div className="glass-card p-4 flex flex-col gap-3 hover:border-lro-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lro-accent">{icon}</span>
          <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{channel.label}</span>
        </div>
        <StatusDot status={channel.status} size="sm" />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="data-ticker text-2xl font-bold text-white" style={{ color: channel.status === 'nominal' ? undefined : statusColor }}>
            {formatValue(channel.value, channel.unit)}
          </span>
          <span className="text-xs text-slate-500 ml-1">{channel.unit}</span>
        </div>
        <div className="text-right">
          <div className={`text-xs font-mono ${deviation > 0 ? 'text-lro-400' : 'text-lro-300'}`}>
            {deviation >= 0 ? '+' : ''}{deviation.toFixed(1)}%
          </div>
          <div className="text-xxs text-slate-600">vs nominal</div>
        </div>
      </div>

      {/* Mini bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.max(2, Math.min(100, pct))}%`,
            backgroundColor: chartColor,
            boxShadow: `0 0 6px ${chartColor}60`,
          }}
        />
      </div>

      {/* Sparkline */}
      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${channel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={chartColor}
              strokeWidth={1.5}
              fill={`url(#grad-${channel.id})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
