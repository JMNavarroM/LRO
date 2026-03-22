import { useState, useEffect } from 'react'
import { Zap, Sun, Battery, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { GlassCard } from '../ui/GlassCard'
import { TelemetryChart } from '../ui/TelemetryChart'
import type { TelemetryData } from '../../types'

interface PowerSystemsProps {
  data: TelemetryData
}

const POWER_CONSUMERS = [
  { name: 'LROC WAC', watts: 11.2, color: '#00b4d8' },
  { name: 'LROC NAC', watts: 21.8, color: '#38bdf8' },
  { name: 'Mini-RF', watts: 150, color: '#a78bfa' },
  { name: 'LAMP', watts: 9.1, color: '#f59e0b' },
  { name: 'LEND', watts: 4.8, color: '#34d399' },
  { name: 'DIVINER', watts: 14.6, color: '#fb923c' },
  { name: 'CRaTER', watts: 6.5, color: '#f43f5e' },
  { name: 'C&DH', watts: 35.0, color: '#94a3b8' },
  { name: 'Comm', watts: 28.4, color: '#67e8f9' },
]

function BatteryGauge({ level }: { level: number }) {
  const r = 70
  const circumference = 2 * Math.PI * r
  const progress = (level / 100) * circumference
  const color = level > 50 ? '#22c55e' : level > 20 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center w-full max-w-[180px]">
      <svg viewBox="0 0 180 180" className="w-full h-auto" style={{ display: 'block' }}>
        {/* Track */}
        <circle cx={90} cy={90} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={14} strokeLinecap="round" />
        {/* Progress */}
        <circle cx={90} cy={90} r={r} fill="none"
          stroke={color} strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          transform="rotate(-90 90 90)"
        />
        {/* Inner glow ring */}
        <circle cx={90} cy={90} r={60} fill="none"
          stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        {/* Value */}
        <text x="90" y="86" textAnchor="middle" fill="white" fontSize={28} fontWeight="bold" fontFamily="JetBrains Mono">
          {level.toFixed(0)}
        </text>
        <text x="90" y="102" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11} fontFamily="JetBrains Mono">%</text>
        <text x="90" y="118" textAnchor="middle" fill={color} fontSize={9} fontFamily="JetBrains Mono">BATTERY</text>
      </svg>
    </div>
  )
}

export function PowerSystems({ data }: PowerSystemsProps) {
  const [consumers, setConsumers] = useState(POWER_CONSUMERS)

  useEffect(() => {
    const t = setInterval(() => {
      setConsumers(prev => prev.map(c => ({
        ...c,
        watts: Math.max(0.1, c.watts + (Math.random() - 0.5) * 0.5),
      })))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const totalConsumption = consumers.reduce((sum, c) => sum + c.watts, 0)
  const powerBalance = data.powerOutput.value - totalConsumption
  const efficiency = (totalConsumption / data.powerOutput.value) * 100

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Power Systems</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Solar array, battery, and power distribution</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-xs font-mono font-bold ${powerBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {powerBalance >= 0 ? <TrendingDown size={12} /> : <TrendingDown size={12} />}
            {powerBalance >= 0 ? '+' : ''}{powerBalance.toFixed(0)} W balance
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Battery gauge */}
        <GlassCard className="p-4 flex flex-col items-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Battery State</h3>
          <BatteryGauge level={data.batteryLevel.value} />
          <div className="mt-2 text-center">
            <div className="text-xs text-slate-500 font-mono">CAPACITY</div>
            <div className="text-sm font-mono font-bold text-white">
              {(data.batteryLevel.value * 0.8).toFixed(1)} / 80.0 Ah
            </div>
          </div>
        </GlassCard>

        {/* Solar output */}
        <GlassCard className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Solar Generation</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)' }}>
                <Sun size={20} className="text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white">{data.powerOutput.value.toFixed(0)}</div>
                <div className="text-xs text-slate-500 font-mono">Watts</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${(data.powerOutput.value / 2200) * 100}%`,
                  background: 'linear-gradient(90deg, #f97316, #fbbf24)',
                  boxShadow: '0 0 8px rgba(249,115,22,0.5)',
                }} />
            </div>
            <div className="flex justify-between text-xxs font-mono text-slate-600">
              <span>0 W</span>
              <span>2200 W max</span>
            </div>
            {[
              { label: 'Array A', pct: 48, watts: data.powerOutput.value * 0.51 },
              { label: 'Array B', pct: 49, watts: data.powerOutput.value * 0.49 },
            ].map(arr => (
              <div key={arr.label} className="flex items-center gap-2">
                <span className="text-xxs text-slate-500 font-mono w-12">{arr.label}</span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${arr.pct}%`,
                    background: '#f97316',
                  }} />
                </div>
                <span className="text-xxs font-mono text-slate-400 w-14 text-right">{arr.watts.toFixed(0)} W</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Power balance */}
        <GlassCard className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Power Budget</h3>
          <div className="space-y-2">
            {[
              { label: 'Generation', value: data.powerOutput.value, color: '#22c55e', icon: <Zap size={12} /> },
              { label: 'Consumption', value: totalConsumption, color: '#f59e0b', icon: <TrendingDown size={12} /> },
              { label: 'To Battery', value: Math.max(0, powerBalance), color: '#38bdf8', icon: <Battery size={12} /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xxs text-slate-500 font-mono flex-1">{item.label}</span>
                <span className="text-sm font-mono font-bold" style={{ color: item.color }}>
                  {item.value.toFixed(0)} W
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex justify-between text-xxs font-mono">
              <span className="text-slate-500">EFFICIENCY</span>
              <span className="text-lro-accent">{Math.min(100, efficiency).toFixed(1)}%</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, efficiency)}%`,
                background: efficiency > 80 ? '#22c55e' : '#f59e0b',
              }} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Consumption breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Power Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="w-36 h-36 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consumers}
                    dataKey="watts"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {consumers.map((c, i) => (
                      <Cell key={i} fill={c.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    formatter={(v: number) => [`${v.toFixed(1)} W`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {consumers.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-xxs text-slate-400 flex-1 truncate">{c.name}</span>
                  <span className="text-xxs font-mono text-slate-500">{c.watts.toFixed(0)}W</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Battery Level History</h3>
          <TelemetryChart channel={data.batteryLevel} height={160} />
        </GlassCard>
      </div>
    </div>
  )
}
