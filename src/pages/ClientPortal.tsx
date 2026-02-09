import { useEffect, useMemo, useState } from 'react'
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

function ClientPortal() {
  const { role, username, refreshSession } = useAdminSession()
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState<ChangeRequest[]>([])

  const [selectedPage, setSelectedPage] = useState('ALL')
  const [selectedBlockId, setSelectedBlockId] = useState('')
  const [newText, setNewText] = useState('')
  const [notes, setNotes] = useState('')

  const blocks = useMemo(() => getEditableBlocks(flattenContent(cloneSiteContent())), [])

  const visibleBlocks = useMemo(
    () => blocks.filter((block) => selectedPage === 'ALL' || block.page === selectedPage),
    [blocks, selectedPage]
  )

  const selectedBlock = useMemo(
    () => visibleBlocks.find((block) => block.id === selectedBlockId) || null,
    [visibleBlocks, selectedBlockId]
  )

  const pages = useMemo(() => ['ALL', ...Array.from(new Set(blocks.map((block) => block.page)))], [blocks])

  const fetchRequests = async () => {
    const response = await fetch('/api/changes', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) return
    const payload = (await response.json()) as { items: ChangeRequest[] }
    setRequests(payload.items || [])
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    await refreshSession()
  }

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedBlock || !newText.trim()) {
      setError('Select a block and provide updated text')
      return
    }

    setError('')
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

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div>
          <h1>Content Update Portal</h1>
          <p>Logged in as {username}. Submit section updates for review.</p>
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
              Section
              <select
                value={selectedBlockId}
                onChange={(event) => setSelectedBlockId(event.target.value)}
              >
                <option value="">Choose a section</option>
                {visibleBlocks.map((block) => (
                  <option key={block.id} value={block.id}>{block.block}</option>
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
    </div>
  )
}

export default ClientPortal
