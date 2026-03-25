import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BarChart2, Monitor, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { StatusDot } from '../ui/StatusDot'
import type { ModuleId } from '../../types'

// ─── Add / remove modules here ───────────────────────────────────────────────
const MODULES: { id: ModuleId; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'overview',   label: 'Overview',   icon: <LayoutDashboard size={18} />, desc: 'Key metrics' },
  { id: 'analytics',  label: 'Analytics',  icon: <BarChart2 size={18} />,       desc: 'Trends & charts' },
  { id: 'monitors',   label: 'Monitors',   icon: <Monitor size={18} />,         desc: 'Live data streams' },
  { id: 'settings',   label: 'Settings',   icon: <Settings size={18} />,        desc: 'Configuration' },
]
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const { activeModule, sidebarCollapsed, setActiveModule, toggleSidebar } = useAppStore()

  // Auto-collapse on small viewports
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024 && !sidebarCollapsed) toggleSidebar()
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 56 : 200 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{
        background: 'rgba(5,10,20,0.9)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center h-14 px-3 border-b border-white/5 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.25)' }}>
                <LayoutDashboard size={16} className="text-lro-accent" />
              </div>
              <div className="min-w-0">
                {/* ─── Update your app name here ─── */}
                <div className="text-sm font-bold text-white tracking-wider truncate">GLASS DASH</div>
                <div className="text-xxs text-slate-600 font-mono tracking-widest">PLATFORM</div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full flex justify-center">
              <LayoutDashboard size={18} className="text-lro-accent" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all flex-shrink-0"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Live status */}
      {!sidebarCollapsed && (
        <div className="px-3 py-2 flex-shrink-0">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg"
            style={{ background: 'rgba(0,180,216,0.05)', border: '1px solid rgba(0,180,216,0.08)' }}>
            <span className="text-xxs text-slate-500 font-mono">DATA</span>
            <StatusDot status="live" size="sm" showLabel />
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {MODULES.map((mod) => {
          const isActive = activeModule === mod.id
          return (
            <motion.button
              key={mod.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveModule(mod.id)}
              className="w-full flex items-center rounded-xl transition-all relative group"
              style={{
                padding: sidebarCollapsed ? '10px 0' : '9px 10px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(0,180,216,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(0,180,216,0.2)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 12px rgba(0,180,216,0.1)' : 'none',
                color: isActive ? '#38bdf8' : 'rgba(255,255,255,0.45)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                  style={{ background: '#00b4d8', boxShadow: '0 0 8px #00b4d8' }}
                />
              )}

              <span className={isActive ? 'text-lro-accent' : ''}>{mod.icon}</span>

              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {mod.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 hidden group-hover:flex items-center z-50">
                  <div className="px-2 py-1 rounded-lg text-xs text-white whitespace-nowrap"
                    style={{ background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(0,180,216,0.2)' }}>
                    {mod.label}
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/5 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-full flex items-center rounded-xl py-2 transition-all text-slate-500 hover:text-red-400 hover:bg-red-400/5"
          style={{
            padding: sidebarCollapsed ? '8px 0' : '8px 10px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}
        >
          <LogOut size={16} />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 text-sm whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
