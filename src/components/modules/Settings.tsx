import { GlassCard } from '../ui/GlassCard'
import type { DashboardData } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SettingsProps { data: DashboardData }

export function SettingsModule({ data: _ }: SettingsProps) {
  const sections = [
    {
      title: 'General',
      items: ['Application name', 'Theme', 'Language', 'Timezone'],
    },
    {
      title: 'Data Sources',
      items: ['Simulator interval (ms)', 'History length', 'Alert thresholds', 'Webhook endpoints'],
    },
    {
      title: 'Authentication',
      items: ['PIN length', 'Session timeout', 'Biometric policy', 'Operator ID'],
    },
    {
      title: 'Notifications',
      items: ['Critical alerts', 'Warning alerts', 'Slack integration', 'Email on critical'],
    },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">Configure the dashboard — wire up your own settings here</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <GlassCard key={section.title} className="p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item} className="flex items-center justify-between py-1.5 border-b border-white/4">
                  <span className="text-xs text-slate-400">{item}</span>
                  <div className="h-6 w-32 rounded-lg bg-white/5 border border-white/8 flex items-center px-2">
                    <span className="text-xxs font-mono text-slate-600">— configure —</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Boilerplate note */}
      <GlassCard className="p-4" icy>
        <h3 className="text-sm font-semibold text-lro-accent mb-2">Glass Dashboard Boilerplate</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          This is a reusable glassmorphism dashboard template built with React, Vite, TypeScript, Tailwind CSS,
          Framer Motion, Recharts, and Zustand. Swap out the data simulator, module list, and branding constants
          at the top of each file to adapt it to your project.
        </p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Zustand', 'Lucide'].map((lib) => (
            <div key={lib} className="px-2 py-1 rounded-lg text-center"
              style={{ background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.15)' }}>
              <span className="text-xxs font-mono text-lro-accent">{lib}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
