import React from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
  animate?: boolean
  heavy?: boolean
  icy?: boolean
}

export function GlassCard({
  children,
  className = '',
  onClick,
  animate = false,
  heavy = false,
  icy = false,
}: GlassCardProps) {
  const baseClass = heavy ? 'glass-card-heavy' : icy ? 'icy-surface rounded-2xl' : 'glass-card'

  const content = (
    <div
      className={`${baseClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${baseClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        whileHover={onClick ? { scale: 1.01 } : undefined}
      >
        {children}
      </motion.div>
    )
  }

  return content
}
