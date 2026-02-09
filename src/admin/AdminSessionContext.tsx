import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

type AdminSessionContextValue = {
  isAdminSession: boolean
  isCheckingSession: boolean
  refreshSession: () => Promise<void>
}

const AdminSessionContext = createContext<AdminSessionContextValue>({
  isAdminSession: false,
  isCheckingSession: true,
  refreshSession: async () => undefined
})

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const [isAdminSession, setIsAdminSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const location = useLocation()

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session', {
        method: 'GET',
        credentials: 'include'
      })
      setIsAdminSession(response.ok)
    } catch {
      setIsAdminSession(false)
    } finally {
      setIsCheckingSession(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession, location.pathname])

  const value = useMemo(
    () => ({ isAdminSession, isCheckingSession, refreshSession }),
    [isAdminSession, isCheckingSession, refreshSession]
  )

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>
}

export function useAdminSession() {
  return useContext(AdminSessionContext)
}
