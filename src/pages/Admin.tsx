import { useEffect, useMemo, useState } from 'react'
import { FileDown, FileUp, Lock, LogOut, ShieldCheck } from 'lucide-react'
import { cloneSiteContent } from '../content/siteContent'
import type { SiteContent } from '../content/siteContent'
import {
  applyClientCsv,
  buildClientGuide,
  buildImportReport,
  flattenContent,
  parseCsv,
  toClientPackCsv
} from '../admin/contentPack'
import { useAdminSession } from '../admin/AdminSessionContext'
import './Admin.css'

type TabKey = 'docs' | 'builder'

type ImportSummary = {
  updates: number
  skipped: string[]
  appendix: string[]
}

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

function nowIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function downloadTextFile(filename: string, content: string, contentType = 'text/plain') {
  const blob = new Blob([content], { type: `${contentType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function Admin() {
  const { role, username, isCheckingSession, refreshSession } = useAdminSession()

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState<TabKey>('builder')
  const [contentDraft, setContentDraft] = useState<SiteContent>(() => cloneSiteContent())
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null)
  const [newPageRoute, setNewPageRoute] = useState('')
  const [newPageLabel, setNewPageLabel] = useState('')
  const [requests, setRequests] = useState<ChangeRequest[]>([])

  const rows = useMemo(() => flattenContent(contentDraft), [contentDraft])

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
      setError('Unable to load change requests')
    }
  }

  useEffect(() => {
    if (role === 'admin') {
      void fetchRequests()
    }
  }, [role])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          expectedRole: 'admin'
        })
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error || 'Login failed')
        return
      }

      await refreshSession()
      await fetchRequests()
      setLoginPassword('')
    } catch {
      setError('Unable to reach login service')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    await refreshSession()
  }

  const handleExportPack = () => {
    const csv = toClientPackCsv(rows)
    downloadTextFile('builder-content-pack.csv', csv, 'text/csv')
    downloadTextFile('builder-content-pack.md', buildClientGuide(rows.length), 'text/markdown')
  }

  const handleImportCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const csvText = await file.text()
    const csvRows = parseCsv(csvText)
    const nextContent = structuredClone(contentDraft)
    const summary = applyClientCsv(nextContent, csvRows)
    setContentDraft(nextContent)
    setImportSummary(summary)
    event.target.value = ''
  }

  const downloadUpdatedContent = () => {
    downloadTextFile('site-content.updated.json', `${JSON.stringify(contentDraft, null, 2)}\n`, 'application/json')
  }

  const downloadImportReport = () => {
    if (!importSummary) return
    const report = buildImportReport(importSummary.updates, importSummary.skipped, importSummary.appendix)
    downloadTextFile('content-import-report.md', report, 'text/markdown')
  }

  const updateRegistryField = (
    id: string,
    field: 'route' | 'menuLabel' | 'status' | 'owner' | 'notes',
    value: string
  ) => {
    setContentDraft((current) => ({
      ...current,
      pageRegistry: current.pageRegistry.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
              lastUpdated: nowIsoDate()
            }
          : entry
      )
    }))
  }

  const addPageRegistryItem = () => {
    const route = newPageRoute.trim()
    const menuLabel = newPageLabel.trim()
    if (!route || !menuLabel) return

    const maxIdNumber = contentDraft.pageRegistry
      .map((entry) => Number(entry.id.replace('PAGE_', '')))
      .filter((value) => Number.isFinite(value))
      .reduce((max, value) => Math.max(max, value), 0)

    const newEntry = {
      id: `PAGE_${String(maxIdNumber + 1).padStart(2, '0')}`,
      route,
      menuLabel,
      status: 'planned' as const,
      owner: 'Client Request',
      notes: 'New page request',
      lastUpdated: nowIsoDate()
    }

    setContentDraft((current) => ({
      ...current,
      pageRegistry: [...current.pageRegistry, newEntry]
    }))

    setNewPageRoute('')
    setNewPageLabel('')
  }

  const downloadRegistry = () => {
    downloadTextFile('page-registry.updated.json', `${JSON.stringify(contentDraft.pageRegistry, null, 2)}\n`, 'application/json')
  }

  const reviewRequest = async (item: ChangeRequest, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/changes', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status })
      })

      if (!response.ok) {
        setError('Unable to update request status')
        return
      }

      if (status === 'approved') {
        const nextContent = structuredClone(contentDraft)
        applyClientCsv(nextContent, [
          {
            id: item.blockId,
            client_new_block_text: item.newText,
            notes: item.notes
          }
        ])
        setContentDraft(nextContent)
      }

      await fetchRequests()
    } catch {
      setError('Unable to update request status')
    }
  }

  if (isCheckingSession) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h1>Admin Access</h1>
          <p>Checking secure session...</p>
        </div>
      </div>
    )
  }

  if (role !== 'admin') {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="login-icon">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h1>Admin Access</h1>
          <p>Sign in with your admin account.</p>

          <form onSubmit={handleSubmit} className="login-form">
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
            {error && <span className="error-msg">{error}</span>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-toolbar">
        <div>
          <h1>Admin Control Panel</h1>
          <p>Signed in as {username}. Review client requests and manage builder updates.</p>
        </div>

        <div className="admin-toolbar-actions">
          <span className="security-badge">
            <ShieldCheck size={16} />
            Server session active
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button className={activeTab === 'builder' ? 'active' : ''} onClick={() => setActiveTab('builder')}>Builder</button>
        <button className={activeTab === 'docs' ? 'active' : ''} onClick={() => setActiveTab('docs')}>Documentation</button>
      </nav>

      {activeTab === 'builder' && (
        <section className="admin-panel-stack">
          <article className="admin-card">
            <h2>Client Request Queue</h2>
            <p>Review portal-submitted section changes. Approve to stage them in your content draft.</p>
            <div className="inline-actions">
              <button onClick={() => void fetchRequests()}>Refresh Queue</button>
            </div>
            <div className="table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Block</th>
                    <th>Requester</th>
                    <th>Change</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={6}>No submitted requests yet.</td>
                    </tr>
                  )}
                  {requests.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.blockId}</td>
                      <td>{item.requester}</td>
                      <td>{item.newText}</td>
                      <td>{item.status}</td>
                      <td>
                        <div className="inline-actions">
                          <button disabled={item.status !== 'pending'} onClick={() => void reviewRequest(item, 'approved')}>Approve</button>
                          <button disabled={item.status !== 'pending'} onClick={() => void reviewRequest(item, 'rejected')}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="admin-card">
            <h2>Content Builder Pack</h2>
            <p>Optional export/import if you still need offline edits.</p>
            <div className="inline-actions">
              <button onClick={handleExportPack} className="primary-btn">
                <FileDown size={16} />
                Download Builder CSV
              </button>
              <label className="upload-btn">
                <FileUp size={16} />
                Upload Edited CSV
                <input type="file" accept=".csv,text/csv" onChange={handleImportCsv} />
              </label>
            </div>

            {importSummary && (
              <div className="summary-box">
                <p>Updated entries: <strong>{importSummary.updates}</strong></p>
                <p>Skipped entries: <strong>{importSummary.skipped.length}</strong></p>
                <p>Appendix requests: <strong>{importSummary.appendix.length}</strong></p>
              </div>
            )}

            <div className="inline-actions">
              <button onClick={downloadUpdatedContent}>Download Updated Content JSON</button>
              <button onClick={downloadImportReport} disabled={!importSummary}>Download Import Report</button>
            </div>
          </article>

          <article className="admin-card">
            <h2>Page Planner</h2>
            <p>Add planned pages here. Mark pages as removed when they should be retired.</p>
            <div className="new-page-form">
              <input
                value={newPageRoute}
                onChange={(event) => setNewPageRoute(event.target.value)}
                placeholder="Route (example: /case-studies)"
              />
              <input
                value={newPageLabel}
                onChange={(event) => setNewPageLabel(event.target.value)}
                placeholder="Menu label"
              />
              <button onClick={addPageRegistryItem}>Add Page</button>
            </div>

            <div className="table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Route</th>
                    <th>Menu Label</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Notes</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {contentDraft.pageRegistry.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.id}</td>
                      <td>
                        <input
                          value={entry.route}
                          onChange={(event) => updateRegistryField(entry.id, 'route', event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={entry.menuLabel}
                          onChange={(event) => updateRegistryField(entry.id, 'menuLabel', event.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={entry.status}
                          onChange={(event) => updateRegistryField(entry.id, 'status', event.target.value)}
                        >
                          <option value="active">active</option>
                          <option value="planned">planned</option>
                          <option value="removed">removed</option>
                        </select>
                      </td>
                      <td>
                        <input
                          value={entry.owner}
                          onChange={(event) => updateRegistryField(entry.id, 'owner', event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={entry.notes}
                          onChange={(event) => updateRegistryField(entry.id, 'notes', event.target.value)}
                        />
                      </td>
                      <td>{entry.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={downloadRegistry}>Download Updated Page Registry</button>
          </article>
        </section>
      )}

      {activeTab === 'docs' && (
        <section className="admin-docs-wrap">
          <iframe
            src="/admin-docs"
            className="docs-iframe"
            title="Project Documentation"
          />
        </section>
      )}
    </div>
  )
}

export default Admin
