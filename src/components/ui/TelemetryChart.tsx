import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { TelemetryChannel } from '../../types'

interface TelemetryChartProps {
  channel: TelemetryChannel
  height?: number
  showGrid?: boolean
  showAxes?: boolean
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`
}

const STATUS_COLORS: Record<string, string> = {
  nominal: '#00b4d8',
  warning: '#f59e0b',
  critical: '#ef4444',
  offline: '#6b7280',
}

export function TelemetryChart({ channel, height = 180, showGrid = true, showAxes = true }: TelemetryChartProps) {
  const chartData = useMemo(
    () => channel.history.map((h) => ({
      t: formatTime(h.timestamp),
      v: Math.round(h.value * 100) / 100,
    })),
    [channel.history]
  )

  const color = STATUS_COLORS[channel.status] ?? '#00b4d8'
  const gradId = `grad-full-${channel.id}`

  return (
    <div className="chart-container p-3" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: showAxes ? 0 : -40, bottom: showAxes ? 0 : -16 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
          )}
          {showAxes && (
            <XAxis
              dataKey="t"
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
          )}
          {showAxes && (
            <YAxis
              domain={[channel.min * 0.98, channel.max * 1.02]}
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              width={48}
              tickFormatter={(v) => `${Number(v).toFixed(0)}${channel.unit}`}
            />
          )}
          <Tooltip
            contentStyle={{
              background: 'rgba(10,14,26,0.95)',
              border: '1px solid rgba(0,180,216,0.3)',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
            }}
            formatter={(v: number) => [`${v} ${channel.unit}`, channel.label]}
            labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          />
          <ReferenceLine
            y={channel.nominal}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="6 4"
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
            dot={false}
            activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
