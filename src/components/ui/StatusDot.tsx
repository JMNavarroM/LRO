interface StatusDotProps {
  status: 'nominal' | 'warning' | 'critical' | 'offline' | 'live'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const STATUS_CONFIG = {
  nominal: { color: '#22c55e', label: 'NOMINAL', ring: 'rgba(34,197,94,0.3)' },
  warning: { color: '#f59e0b', label: 'WARNING', ring: 'rgba(245,158,11,0.3)' },
  critical: { color: '#ef4444', label: 'CRITICAL', ring: 'rgba(239,68,68,0.3)' },
  offline: { color: '#6b7280', label: 'OFFLINE', ring: 'rgba(107,114,128,0.2)' },
  live: { color: '#00b4d8', label: 'LIVE', ring: 'rgba(0,180,216,0.3)' },
}

const SIZES = {
  sm: 6,
  md: 8,
  lg: 12,
}

export function StatusDot({ status, size = 'md', showLabel = false }: StatusDotProps) {
  const cfg = STATUS_CONFIG[status]
  const px = SIZES[size]

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-flex" style={{ width: px, height: px }}>
        <span
          className="absolute inline-flex rounded-full animate-ping-slow"
          style={{
            inset: 0,
            backgroundColor: cfg.ring,
          }}
        />
        <span
          className="relative inline-flex rounded-full"
          style={{
            width: px,
            height: px,
            backgroundColor: cfg.color,
            boxShadow: `0 0 ${px}px ${cfg.color}`,
          }}
        />
      </span>
      {showLabel && (
        <span
          className="font-mono text-xs font-semibold tracking-widest"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
      )}
    </span>
  )
}
