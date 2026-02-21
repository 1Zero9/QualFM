import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileText, LogOut, Send } from 'lucide-react'
import { cloneSiteContent } from '../content/siteContent'
import { flattenContent, getEditableBlocks } from '../admin/contentPack'
import { useAdminSession } from '../admin/AdminSessionContext'
import './ClientPortal.css'

type ChangeRequest = {
  id: string
  blockId: string
  page: string
  section: string
  currentText: string
  newText: string
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  requester: string
  submittedAt: string
  reviewedAt: string
  reviewedBy: string
  reviewNotes: string
}

const SESSION_DURATION_MS = 10 * 60 * 1000
const SESSION_WARNING_MS = 2 * 60 * 1000

function tokenToLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function blockPreview(blockText: string) {
  const firstLine = blockText.split('\n').find((line) => line.trim().length > 0) || ''
  const value = firstLine.includes(':') ? firstLine.split(':').slice(1).join(':').trim() : firstLine.trim()
  if (value.length <= 72) return value
  return `${value.slice(0, 72)}...`
}

function formatRemaining(seconds: number) {
  const safeSeconds = Math.max(0, seconds)
  const mins = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function ClientPortal() {
  const { role, username, refreshSession } = useAdminSession()
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState<ChangeRequest[]>([])

  const [selectedPage, setSelectedPage] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedBlockId, setSelectedBlockId] = useState('')
  const [sectionSearch, setSectionSearch] = useState('')
  const [newText, setNewText] = useState('')
  const [notes, setNotes] = useState('')
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number>(Date.now() + SESSION_DURATION_MS)
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(SESSION_DURATION_MS / 1000))
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const autoLogoutTriggered = useRef(false)

  const blocks = useMemo(() => getEditableBlocks(flattenContent(cloneSiteContent())), [])

  const pages = useMemo(() => Array.from(new Set(blocks.map((block) => block.page))), [blocks])

  useEffect(() => {
    if (!selectedPage && pages.length > 0) {
      setSelectedPage(pages[0])
    }
  }, [pages, selectedPage])

  const pageBlocks = useMemo(
    () =>
      blocks.filter((block) => (selectedPage ? block.page === selectedPage : true)),
    [blocks, selectedPage]
  )

  const sections = useMemo(() => {
    const uniqueSections = Array.from(new Set(pageBlocks.map((block) => block.section)))
    const search = sectionSearch.trim().toLowerCase()
    return uniqueSections.filter((section) => {
      if (!search) return true
      return tokenToLabel(section).toLowerCase().includes(search)
    })
  }, [pageBlocks, sectionSearch])

  useEffect(() => {
    if (!sections.length) {
      setSelectedSection('')
      return
    }

    if (!selectedSection || !sections.includes(selectedSection)) {
      setSelectedSection(sections[0])
    }
  }, [sections, selectedSection])

  const sectionBlocks = useMemo(
    () => pageBlocks.filter((block) => (selectedSection ? block.section === selectedSection : true)),
    [pageBlocks, selectedSection]
  )

  const paragraphOptions = useMemo(
    () =>
      sectionBlocks.map((block, index) => ({
        id: block.id,
        label: `Paragraph ${index + 1}`,
        preview: blockPreview(block.current_block_text)
      })),
    [sectionBlocks]
  )

  const selectedBlock = useMemo(
    () => sectionBlocks.find((block) => block.id === selectedBlockId) || null,
    [sectionBlocks, selectedBlockId]
  )

  useEffect(() => {
    setSelectedBlockId('')
  }, [selectedPage, selectedSection, sectionSearch])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/changes', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) return
      const payload = (await response.json()) as { items: ChangeRequest[] }
      setRequests(payload.items || [])
    } catch {
      setError('Unable to load your requests')
    }
  }

  useEffect(() => {
    if (role !== 'client') return
    void fetchRequests()
  }, [role])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          expectedRole: 'client'
        })
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error || 'Unable to log in')
        return
      }

      await refreshSession()
      setLoginPassword('')
    } catch {
      setError('Unable to reach login service')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    await refreshSession()
  }, [refreshSession])

  const extendSession = useCallback(() => {
    setSessionExpiresAt(Date.now() + SESSION_DURATION_MS)
    setHasTimedOut(false)
    autoLogoutTriggered.current = false
  }, [])

  useEffect(() => {
    if (role !== 'client') return
    extendSession()
  }, [role, extendSession])

  useEffect(() => {
    if (role !== 'client') return

    const events: Array<keyof WindowEventMap> = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove']
    let lastTouch = Date.now()

    const onActivity = () => {
      const now = Date.now()
      if (now - lastTouch < 1000) return
      lastTouch = now
      setSessionExpiresAt(now + SESSION_DURATION_MS)
      setHasTimedOut(false)
      autoLogoutTriggered.current = false
    }

    events.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }))
    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, onActivity))
    }
  }, [role])

  useEffect(() => {
    if (role !== 'client') return

    const tick = window.setInterval(() => {
      const remainingMs = sessionExpiresAt - Date.now()
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
      setSecondsLeft(remainingSeconds)

      if (remainingMs <= 0 && !autoLogoutTriggered.current) {
        autoLogoutTriggered.current = true
        setHasTimedOut(true)
      }
    }, 1000)

    return () => window.clearInterval(tick)
  }, [role, sessionExpiresAt])

  useEffect(() => {
    if (!hasTimedOut) return
    void handleLogout()
  }, [hasTimedOut, handleLogout])

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedBlock || !newText.trim()) {
      setError('Select a block and provide updated text')
      return
    }

    setError('')
    try {
      const response = await fetch('/api/changes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockId: selectedBlock.id,
          page: selectedBlock.page,
          section: selectedBlock.section,
          currentText: selectedBlock.current_block_text,
          newText,
          notes
        })
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error || 'Unable to submit request')
        return
      }

      setNewText('')
      setNotes('')
      await fetchRequests()
    } catch {
      setError('Unable to submit request')
    }
  }

  if (role !== 'client') {
    return (
      <div className="portal-login-page">
        <div className="portal-login-card">
          <h1>Client Portal</h1>
          <p>Submit content updates directly without editing code or CSV files.</p>

          <form onSubmit={handleLogin} className="portal-login-form">
            <input
              type="text"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              placeholder="Username"
              autoFocus
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="Password"
            />
            {error && <span className="portal-error">{error}</span>}
            <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    )
  }

  const isWarningVisible = secondsLeft > 0 && secondsLeft <= Math.floor(SESSION_WARNING_MS / 1000)

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div>
          <h1>Content Update Portal</h1>
          <p>Logged in as {username}. Submit section updates for review.</p>
          <p className={`portal-session-timer ${isWarningVisible ? 'is-warning' : ''}`}>
            Auto logout in {formatRemaining(secondsLeft)}
          </p>
        </div>
        <button onClick={handleLogout} className="portal-logout-btn">
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <section className="portal-grid">
        <article className="portal-card">
          <h2>
            <FileText size={16} />
            Submit Update
          </h2>

          <form onSubmit={submitRequest} className="portal-form">
            <label>
              Page
              <select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)}>
                {pages.map((page) => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
            </label>

            <label>
              Find section
              <input
                type="text"
                value={sectionSearch}
                onChange={(event) => setSectionSearch(event.target.value)}
                placeholder="Search by section name"
              />
            </label>

            <label>
              Section
              <select
                value={selectedSection}
                onChange={(event) => setSelectedSection(event.target.value)}
              >
                <option value="">Choose a section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {tokenToLabel(section)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Paragraph
              <select
                value={selectedBlockId}
                onChange={(event) => setSelectedBlockId(event.target.value)}
                disabled={!selectedSection}
              >
                <option value="">Choose a paragraph</option>
                {paragraphOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} - {option.preview || 'No preview'}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Current text
              <textarea value={selectedBlock?.current_block_text || ''} readOnly rows={7}></textarea>
            </label>

            <label>
              Updated text
              <textarea
                value={newText}
                onChange={(event) => setNewText(event.target.value)}
                rows={7}
                placeholder="Enter replacement text for this section"
              ></textarea>
            </label>

            <label>
              Notes (optional)
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Any context for admin review"
              ></textarea>
            </label>

            {error && <span className="portal-error">{error}</span>}

            <button type="submit" className="portal-submit-btn">
              <Send size={16} />
              Submit For Review
            </button>
          </form>
        </article>

        <article className="portal-card">
          <h2>Your Requests</h2>
          <div className="portal-request-list">
            {requests.length === 0 && <p>No requests yet.</p>}
            {requests.map((request) => (
              <div key={request.id} className="portal-request-item">
                <div className="portal-request-top">
                  <strong>{request.page} / {request.section}</strong>
                  <span className={`status status-${request.status}`}>{request.status}</span>
                </div>
                <p className="portal-request-id">{request.id} · {new Date(request.submittedAt).toLocaleString()}</p>
                <p>{request.newText}</p>
                {request.reviewNotes && <p className="portal-review-note">Review: {request.reviewNotes}</p>}
              </div>
            ))}
          </div>
        </article>
      </section>

      {isWarningVisible && (
        <div className="portal-timeout-warning" role="alert" aria-live="polite">
          <p>Your session is about to end.</p>
          <div className="portal-timeout-warning-actions">
            <button type="button" onClick={extendSession} className="portal-submit-btn">
              Add 10 Minutes
            </button>
            <button type="button" onClick={handleLogout} className="portal-logout-btn">
              Log Out Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientPortal
