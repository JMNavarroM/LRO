import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import type { AuthStatus } from '../../types'

interface PinPadProps {
  pinInput: string
  onDigit: (d: string) => void
  onBackspace: () => void
  onClear: () => void
  status: AuthStatus
  errorMsg: string
}

const DIGITS = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['*','0','⌫'],
]

export function PinPad({ pinInput, onDigit, onBackspace, onClear, status, errorMsg }: PinPadProps) {
  const isError = status === 'error'
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col items-center gap-6">
      {/* PIN dots */}
      <motion.div
        className="flex gap-3"
        animate={isError ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const filled = i < pinInput.length
          return (
            <motion.div
              key={i}
              className="rounded-full border-2 transition-all duration-200"
              style={{
                width: 14,
                height: 14,
                borderColor: isError
                  ? 'rgba(239,68,68,0.8)'
                  : isSuccess
                  ? 'rgba(34,197,94,0.8)'
                  : filled
                  ? '#00b4d8'
                  : 'rgba(255,255,255,0.2)',
                backgroundColor: filled
                  ? isError
                    ? 'rgba(239,68,68,0.8)'
                    : isSuccess
                    ? 'rgba(34,197,94,0.8)'
                    : '#00b4d8'
                  : 'transparent',
                boxShadow: filled
                  ? isError
                    ? '0 0 8px rgba(239,68,68,0.6)'
                    : isSuccess
                    ? '0 0 8px rgba(34,197,94,0.6)'
                    : '0 0 8px rgba(0,180,216,0.6)'
                  : 'none',
              }}
              animate={filled ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            />
          )
        })}
      </motion.div>

      {/* Error message */}
      <div className="h-5 flex items-center">
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-400 font-mono"
          >
            {errorMsg}
          </motion.p>
        )}
      </div>

      {/* Numpad */}
      <div className="flex flex-col gap-3">
        {DIGITS.map((row, ri) => (
          <div key={ri} className="flex gap-3">
            {row.map((d) => (
              <motion.button
                key={d}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (d === '⌫') onBackspace()
                  else if (d === '*') onClear()
                  else onDigit(d)
                }}
                disabled={d === '*'}
                className="glass-button rounded-2xl flex items-center justify-center text-white font-semibold transition-all"
                style={{
                  width: 68,
                  height: 68,
                  fontSize: d === '⌫' ? 16 : 22,
                  opacity: d === '*' ? 0 : 1,
                  cursor: d === '*' ? 'default' : 'pointer',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                {d === '⌫' ? <Delete size={20} className="text-slate-300" /> : d}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600 font-mono">Demo PIN: 123456</p>
    </div>
  )
}
