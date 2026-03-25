import { useState, useEffect } from 'react'
import { Bell, Clock, Activity } from 'lucide-react'
import { StatusDot } from '../ui/StatusDot'
import type { Alert } from '../../types'

// ─── Config ──────────────────────────────────────────────────────────────────
const SYSTEM_LABEL = 'SYS-01'
const ENV_LABEL = 'PRODUCTION'
// ─────────────────────────────────────────────────────────────────────────────

interface TopBarProps {
  sessionElapsed: number
  alerts: Alert[]
  onAlertsClick: () => void
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export function TopBar({ sessionElapsed, alerts, onAlertsClick }: TopBarProps) {
  const [now, setNow] = useState(new Date())
  const [elapsed, setElapsed] = useState(sessionElapsed)

  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); setElapsed((e) => e + 1000) }, 1000)
    return () => clearInterval(t)
  }, [])

  const criticals = alerts.filter((a) => a.severity === 'critical').length
  const warnings  = alerts.filter((a) => a.severity === 'warning').length

  return (
    <header
      className="h-14 flex items-center px-4 flex-shrink-0"
      style={{
        background: 'rgba(5,10,20,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left: live indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <StatusDot status="live" size="sm" />
          <span className="text-xs font-mono text-lro-accent font-semibold tracking-widest animate-flicker">LIVE</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <Activity size={12} />
          <span>{ENV_LABEL}</span>
        </div>
      </div>

      {/* Center: session info */}
      <div className="flex-1 flex items-center justify-center gap-3 md:gap-5 min-w-0 overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs font-mono flex-shrink-0">
          <Clock size={12} className="text-slate-600" />
          <span className="text-slate-500 hidden sm:inline">SESSION</span>
          <span className="text-lro-accent font-semibold">{formatElapsed(elapsed)}</span>
        </div>

        <div className="h-4 w-px bg-white/8 flex-shrink-0 hidden lg:block" />

        <div className="text-xs font-mono text-slate-500 hidden lg:block truncate">
          {now.toUTCString().replace('GMT', 'UTC').slice(0, -4)}
        </div>
      </div>

      {/* Right: alerts + operator */}
      <div className="flex items-center gap-3">
        {(criticals > 0 || warnings > 0) && (
          <div className="flex items-center gap-2">
            {criticals > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xxs font-mono font-semibold"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                {criticals} CRITICAL
              </span>
            )}
            {warnings > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xxs font-mono font-semibold"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                {warnings} WARN
              </span>
            )}
          </div>
        )}

        <button
          onClick={onAlertsClick}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <Bell size={16} />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        <div className="text-xs font-mono text-slate-600 pl-2 border-l border-white/8">
          <span className="text-slate-500">OPERATOR</span>
          <span className="text-slate-300 ml-1">{SYSTEM_LABEL}</span>
        </div>
      </div>
    </header>
  )
}
