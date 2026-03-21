import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginScreen } from './components/auth/LoginScreen'
import { MainLayout } from './components/layout/MainLayout'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  const handleAuthenticated = useCallback(() => {
    setAuthenticated(true)
  }, [])

  const handleLogout = useCallback(() => {
    setAuthenticated(false)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          style={{ height: '100vh' }}
        >
          <LoginScreen onAuthenticated={handleAuthenticated} />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ height: '100vh' }}
        >
          <MainLayout onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
