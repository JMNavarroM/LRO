import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Info, AlertCircle } from 'lucide-react'
import type { Alert } from '../../types'

interface AlertBannerProps {
  alerts: Alert[]
  onDismiss: (id: string) => void
}

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
}

const COLORS = {
  info: { border: 'rgba(56,189,248,0.3)', bg: 'rgba(56,189,248,0.08)', text: '#38bdf8' },
  warning: { border: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.08)', text: '#f59e0b' },
  critical: { border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  const visible = alerts.slice(0, 3)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence>
        {visible.map((alert) => {
          const Icon = ICONS[alert.severity]
          const cfg = COLORS[alert.severity]
          const time = new Date(alert.timestamp).toLocaleTimeString()

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-3 flex items-start gap-3"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <Icon size={16} color={cfg.text} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: cfg.text }}>
                  {alert.channel}
                </div>
                <div className="text-xs text-slate-300 mt-0.5 truncate">{alert.message}</div>
                <div className="text-xxs text-slate-500 mt-1 font-mono">{time}</div>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
              >
                <X size={12} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
