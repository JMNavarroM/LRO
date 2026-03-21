import { useState, useCallback } from 'react'
import type { AuthMode, AuthStatus } from '../types'

const CORRECT_PIN = '123456'

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('pin')
  const [pinInput, setPinInput] = useState('')
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const appendPin = useCallback((digit: string) => {
    if (pinInput.length >= 6) return
    const next = pinInput + digit
    setPinInput(next)
    setErrorMsg('')

    if (next.length === 6) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          setAuthStatus('success')
          setTimeout(() => setAuthenticated(true), 600)
        } else {
          setAuthStatus('error')
          setErrorMsg('Invalid PIN. Try again.')
          setTimeout(() => {
            setPinInput('')
            setAuthStatus('idle')
          }, 1200)
        }
      }, 200)
    }
  }, [pinInput])

  const clearPin = useCallback(() => {
    setPinInput('')
    setAuthStatus('idle')
    setErrorMsg('')
  }, [])

  const backspacePin = useCallback(() => {
    setPinInput((p) => p.slice(0, -1))
    setErrorMsg('')
    setAuthStatus('idle')
  }, [])

  const startBiometric = useCallback(() => {
    setAuthStatus('scanning')
    setErrorMsg('')
    // Simulate 3s biometric scan then success
    setTimeout(() => {
      setAuthStatus('success')
      setTimeout(() => setAuthenticated(true), 600)
    }, 3000)
  }, [])

  const logout = useCallback(() => {
    setAuthenticated(false)
    setPinInput('')
    setAuthStatus('idle')
    setErrorMsg('')
  }, [])

  return {
    authenticated,
    authMode,
    setAuthMode,
    pinInput,
    appendPin,
    clearPin,
    backspacePin,
    authStatus,
    errorMsg,
    startBiometric,
    logout,
  }
}
