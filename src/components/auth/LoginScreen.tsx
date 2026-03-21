import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Satellite, Shield, Fingerprint } from 'lucide-react'
import { PinPad } from './PinPad'
import { BiometricScanner } from './BiometricScanner'
import type { AuthMode } from '../../types'
import { useAuth } from '../../hooks/useAuth'

interface LoginScreenProps {
  onAuthenticated: () => void
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const {
    authMode, setAuthMode, pinInput, appendPin, clearPin, backspacePin,
    authStatus, errorMsg, startBiometric, authenticated,
  } = useAuth()

  useEffect(() => {
    if (authenticated) onAuthenticated()
  }, [authenticated, onAuthenticated])

  const tabs: { id: AuthMode; label: string; icon: React.ReactNode }[] = [
    { id: 'pin', label: 'PIN Code', icon: <Shield size={14} /> },
    { id: 'biometric', label: 'Biometric', icon: <Fingerprint size={14} /> },
  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: '#050a14' }}>
      {/* Starfield */}
      <div className="absolute inset-0 starfield opacity-60" />

      {/* Nebula glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(0,180,216,1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,1) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0,180,216,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="glass-card-heavy p-8 flex flex-col items-center gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 w-full">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(56,189,248,0.1))',
                border: '1px solid rgba(0,180,216,0.3)',
                boxShadow: '0 0 24px rgba(0,180,216,0.2)',
              }}
            >
              <Satellite size={32} className="text-lro-accent" />
            </motion.div>

            <div className="text-center">
              <h1 className="text-xl font-bold text-white tracking-wider text-glow">LRO TWIN</h1>
              <p className="text-xs text-slate-500 font-mono tracking-widest mt-0.5">MISSION CONTROL PLATFORM</p>
            </div>

            {/* Status strip */}
            <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.1)' }}>
              <span className="text-xxs font-mono text-slate-500 tracking-wider">SECURE UPLINK</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xxs font-mono text-green-400">CONNECTED</span>
              </div>
            </div>
          </div>

          {/* Auth mode tabs */}
          <div className="w-full flex rounded-xl overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAuthMode(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all"
                style={{
                  color: authMode === tab.id ? '#00b4d8' : 'rgba(255,255,255,0.3)',
                  background: authMode === tab.id ? 'rgba(0,180,216,0.1)' : 'transparent',
                  borderRight: tab.id === 'pin' ? '1px solid rgba(255,255,255,0.06)' : undefined,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Auth content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              {authMode === 'pin' ? (
                <PinPad
                  pinInput={pinInput}
                  onDigit={appendPin}
                  onBackspace={backspacePin}
                  onClear={clearPin}
                  status={authStatus}
                  errorMsg={errorMsg}
                />
              ) : (
                <BiometricScanner status={authStatus} onScan={startBiometric} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="w-full pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-xxs text-slate-600 font-mono">NASA / GSFC</span>
            <span className="text-xxs text-slate-600 font-mono">CLASSIFICATION: RESTRICTED</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xxs text-slate-700 font-mono tracking-widest">
          LUNAR RECONNAISSANCE ORBITER — DIGITAL TWIN v2.4.1
        </p>
      </div>
    </div>
  )
}
