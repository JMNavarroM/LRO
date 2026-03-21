import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, CheckCircle2 } from 'lucide-react'
import type { AuthStatus } from '../../types'

interface BiometricScannerProps {
  status: AuthStatus
  onScan: () => void
}

export function BiometricScanner({ status, onScan }: BiometricScannerProps) {
  const isScanning = status === 'scanning'
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(0,180,216,0.2)',
          }}
          animate={isScanning ? { rotate: 360 } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 12,
            border: '1px solid rgba(0,180,216,0.15)',
          }}
          animate={isScanning ? { rotate: -360 } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Scanning arcs */}
        {isScanning && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid transparent',
                borderTopColor: 'rgba(0,180,216,0.8)',
                boxShadow: '0 0 12px rgba(0,180,216,0.4)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                inset: 12,
                border: '1.5px solid transparent',
                borderBottomColor: 'rgba(56,189,248,0.6)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* Center icon */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CheckCircle2 size={64} className="text-green-400" style={{ filter: 'drop-shadow(0 0 12px rgba(34,197,94,0.6))' }} />
            </motion.div>
          ) : (
            <motion.div
              key="finger"
              animate={isScanning ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ position: 'relative' }}
            >
              <Fingerprint
                size={80}
                style={{
                  color: isScanning ? '#00b4d8' : 'rgba(255,255,255,0.3)',
                  filter: isScanning ? 'drop-shadow(0 0 16px rgba(0,180,216,0.6))' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              {/* Scan line effect */}
              {isScanning && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded"
                  style={{ pointerEvents: 'none' }}
                >
                  <motion.div
                    className="absolute w-full h-0.5"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.9), transparent)',
                      boxShadow: '0 0 8px rgba(0,180,216,0.6)',
                    }}
                    animate={{ y: [-40, 80] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow bg */}
        {isScanning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      <div className="text-center space-y-2">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-semibold">
              Identity Verified
            </motion.p>
          ) : isScanning ? (
            <motion.p key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lro-accent font-semibold font-mono">
              Scanning...
            </motion.p>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400">
              Touch sensor to authenticate
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!isScanning && !isSuccess && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onScan}
          className="px-8 py-3 rounded-2xl font-semibold text-white transition-all"
          style={{
            background: 'rgba(0,180,216,0.15)',
            border: '1px solid rgba(0,180,216,0.4)',
            boxShadow: '0 0 20px rgba(0,180,216,0.15)',
          }}
        >
          Activate Scanner
        </motion.button>
      )}
    </div>
  )
}
