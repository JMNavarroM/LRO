import { useMemo } from 'react'
import { Globe, Navigation } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { TelemetryData } from '../../types'
import { telemetrySimulator } from '../../services/telemetrySimulator'

interface OrbitalMechanicsProps {
  data: TelemetryData
}

const ORBIT_PARAMS = [
  { label: 'Inclination', value: '89.9°', desc: 'Near-polar orbit' },
  { label: 'Eccentricity', value: '0.0013', desc: 'Near-circular' },
  { label: 'Semi-Major Axis', value: '1,787 km', desc: 'From lunar center' },
  { label: 'Orbital Period', value: '113.0 min', desc: 'Per revolution' },
  { label: 'RAAN', value: '172.4°', desc: 'Right ascension' },
  { label: 'Arg. of Perigee', value: '94.2°', desc: 'Perilune argument' },
  { label: 'Mean Anomaly', value: '—', desc: 'Computed live' },
  { label: 'True Anomaly', value: '—', desc: 'Computed live' },
]

export function OrbitalMechanics({ data }: OrbitalMechanicsProps) {
  const angle = data.orbitAngle.value
  const rad = (angle * Math.PI) / 180

  // Probe position on orbit ellipse
  const cx = 180, cy = 180
  const rx = 120, ry = 75 // slightly elliptical
  const probeX = cx + rx * Math.cos(rad)
  const probeY = cy + ry * Math.sin(rad)

  // Ground track dot (simplified)
  const trackX = ((angle / 360) * 100)

  const orbitCount = telemetrySimulator.getOrbitCount()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Orbital Mechanics</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time orbital position and parameters</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Orbit diagram */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Orbital Position</h3>
          <div>
            <svg viewBox="0 0 360 360" className="w-full h-auto max-w-sm mx-auto" style={{ display: 'block' }}>
              {/* Space background */}
              <defs>
                <radialGradient id="moon-grad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#4a4a5e" />
                  <stop offset="60%" stopColor="#2a2a3e" />
                  <stop offset="100%" stopColor="#1a1a2e" />
                </radialGradient>
                <radialGradient id="probe-glow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#00b4d8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00b4d8" stopOpacity={0} />
                </radialGradient>
                <filter id="glow-filter">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Outer glow ring */}
              <circle cx={cx} cy={cy} r={135} fill="none" stroke="rgba(0,180,216,0.05)" strokeWidth={20} />

              {/* Orbit ellipse (dashed) */}
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                fill="none" stroke="rgba(0,180,216,0.25)" strokeWidth={1.5}
                strokeDasharray="6 4" />

              {/* Orbit trail */}
              {Array.from({ length: 20 }).map((_, i) => {
                const trailAngle = angle - i * 4
                const tr = (trailAngle * Math.PI) / 180
                const tx = cx + rx * Math.cos(tr)
                const ty = cy + ry * Math.sin(tr)
                return (
                  <circle key={i} cx={tx} cy={ty} r={1.5}
                    fill="#00b4d8" opacity={(20 - i) / 20 * 0.6} />
                )
              })}

              {/* Moon */}
              <circle cx={cx} cy={cy} r={50} fill="url(#moon-grad)" />
              {/* Moon craters */}
              <circle cx={cx - 20} cy={cy - 15} r={6} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <circle cx={cx + 18} cy={cy + 12} r={9} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <circle cx={cx - 5} cy={cy + 22} r={4} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              <circle cx={cx + 10} cy={cy - 20} r={5} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono">MOON</text>

              {/* North/South poles */}
              <text x={cx} y={cy - 56} textAnchor="middle" fill="rgba(56,189,248,0.4)" fontSize={9} fontFamily="JetBrains Mono">N</text>
              <text x={cx} y={cy + 68} textAnchor="middle" fill="rgba(56,189,248,0.4)" fontSize={9} fontFamily="JetBrains Mono">S</text>

              {/* Probe glow */}
              <circle cx={probeX} cy={probeY} r={12} fill="url(#probe-glow)" opacity={0.5} />

              {/* Probe */}
              <g filter="url(#glow-filter)">
                <circle cx={probeX} cy={probeY} r={5} fill="#00b4d8"
                  style={{ filter: 'drop-shadow(0 0 4px #00b4d8)' }} />
                {/* Solar panels */}
                <line x1={probeX - 10} y1={probeY} x2={probeX - 4} y2={probeY}
                  stroke="#38bdf8" strokeWidth={2} />
                <line x1={probeX + 4} y1={probeY} x2={probeX + 10} y2={probeY}
                  stroke="#38bdf8" strokeWidth={2} />
              </g>

              {/* Angle label */}
              <text x={probeX + 10} y={probeY - 8} fill="#38bdf8" fontSize={9} fontFamily="JetBrains Mono">
                {angle.toFixed(1)}°
              </text>

              {/* Alt label */}
              <text x={20} y={340} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="JetBrains Mono">
                ALT: {data.altitude.value.toFixed(1)} km
              </text>
              <text x={220} y={340} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="JetBrains Mono">
                VEL: {data.velocity.value.toFixed(0)} m/s
              </text>
            </svg>
          </div>
        </GlassCard>

        {/* Parameters table */}
        <div className="space-y-3">
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Keplerian Elements</h3>
            <div className="space-y-2.5">
              {ORBIT_PARAMS.map((p) => (
                <div key={p.label} className="flex items-center justify-between py-1.5 border-b border-white/4">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{p.label}</div>
                    <div className="text-xxs text-slate-600 font-mono">{p.desc}</div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-lro-accent">
                    {p.value === '—'
                      ? p.label === 'Mean Anomaly'
                        ? `${angle.toFixed(1)}°`
                        : `${((angle + 90) % 360).toFixed(1)}°`
                      : p.value}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Mission Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Orbits', value: orbitCount.toLocaleString() },
                { label: 'Coverage', value: '98.2%' },
                { label: 'Data Returned', value: '931 TB' },
                { label: 'Observations', value: '1.2M+' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-xxs text-slate-500 font-mono">{s.label.toUpperCase()}</span>
                  <span className="text-base font-bold text-white font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Ground track */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Lunar Ground Track</h3>
        <div className="relative h-24 rounded-lg overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Lunar surface grid */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="10%" height="25%" patternUnits="objectBoundingBox">
                <path d="M 0 0 L 0 100% M 0 0 L 100% 0" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Equator */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="4 4" />
            {/* Ground track dots */}
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={`${(i / 40) * 100}%`}
                cy={`${50 + 45 * Math.sin((i / 40) * 2 * Math.PI * 2)}%`}
                r={1.5}
                fill="rgba(0,180,216,0.4)"
              />
            ))}
            {/* Current position */}
            <circle
              cx={`${trackX}%`}
              cy={`${50 + 45 * Math.sin((trackX / 100) * 2 * Math.PI * 2)}%`}
              r={4}
              fill="#00b4d8"
              style={{ filter: 'drop-shadow(0 0 4px #00b4d8)' }}
            />
          </svg>
          {/* Labels */}
          <div className="absolute left-1 bottom-1 text-xxs font-mono text-slate-600">0°</div>
          <div className="absolute right-1 bottom-1 text-xxs font-mono text-slate-600">360°</div>
          <div className="absolute left-1 top-1 text-xxs font-mono text-slate-600">+90°N</div>
          <div className="absolute left-1 bottom-6 text-xxs font-mono text-slate-600">-90°S</div>
        </div>
      </GlassCard>
    </div>
  )
}
