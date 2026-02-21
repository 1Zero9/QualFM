import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { can, type AppPermission, type SessionRole } from '../auth/permissions'

type AdminSessionContextValue = {
  isBuilderSession: boolean
  role: SessionRole
  username: string
  isCheckingSession: boolean
  refreshSession: () => Promise<void>
  hasPermission: (permission: AppPermission) => boolean
}

const AdminSessionContext = createContext<AdminSessionContextValue>({
  isBuilderSession: false,
  role: null,
  username: '',
  isCheckingSession: true,
  refreshSession: async () => undefined,
  hasPermission: () => false
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

      const payload = (await response.json()) as { role?: string; username?: string }
      const nextRole = String(payload.role || '').trim()
      if (nextRole === 'owner' || nextRole === 'admin') setRole('owner')
      else if (nextRole === 'client_admin' || nextRole === 'client') setRole('client_admin')
      else if (nextRole === 'customer') setRole('customer')
      else setRole(null)
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
      isBuilderSession: role === 'owner' || role === 'client_admin',
      role,
      username,
      isCheckingSession,
      refreshSession,
      hasPermission: (permission: AppPermission) => can(role, permission)
    }),
    [role, username, isCheckingSession, refreshSession]
  )

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>
}

export function useAdminSession() {
  return useContext(AdminSessionContext)
}
