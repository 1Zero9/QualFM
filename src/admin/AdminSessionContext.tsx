import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

type SessionRole = 'admin' | 'client' | null

type AdminSessionContextValue = {
  isBuilderSession: boolean
  role: SessionRole
  username: string
  isCheckingSession: boolean
  refreshSession: () => Promise<void>
}

const AdminSessionContext = createContext<AdminSessionContextValue>({
  isBuilderSession: false,
  role: null,
  username: '',
  isCheckingSession: true,
  refreshSession: async () => undefined
})

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<SessionRole>(null)
  const [username, setUsername] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const location = useLocation()

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        setRole(null)
        setUsername('')
        return
      }

      const payload = (await response.json()) as { role?: SessionRole; username?: string }
      setRole(payload.role === 'admin' || payload.role === 'client' ? payload.role : null)
      setUsername(payload.username || '')
    } catch {
      setRole(null)
      setUsername('')
    } finally {
      setIsCheckingSession(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession, location.pathname])

  const value = useMemo(
    () => ({
      isBuilderSession: role === 'admin' || role === 'client',
      role,
      username,
      isCheckingSession,
      refreshSession
    }),
    [role, username, isCheckingSession, refreshSession]
  )

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>
}

export function useAdminSession() {
  return useContext(AdminSessionContext)
}
