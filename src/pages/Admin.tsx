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
import './Admin.css'

type TabKey = 'docs' | 'pack' | 'pages'

type ImportSummary = {
  updates: number
  skipped: string[]
  appendix: string[]
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
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('pack')
  const [contentDraft, setContentDraft] = useState<SiteContent>(() => cloneSiteContent())
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null)
  const [newPageRoute, setNewPageRoute] = useState('')
  const [newPageLabel, setNewPageLabel] = useState('')

  const rows = useMemo(() => flattenContent(contentDraft), [contentDraft])

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session', {
          method: 'GET',
          credentials: 'include'
        })

        if (!active) return
        setIsAuthenticated(response.ok)
      } catch {
        if (!active) return
        setIsAuthenticated(false)
      } finally {
        if (active) setIsCheckingSession(false)
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error || 'Login failed')
        return
      }

      setIsAuthenticated(true)
      setPassword('')
    } catch {
      setError('Unable to reach login service')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      setIsAuthenticated(false)
    }
  }

  const handleExportPack = () => {
    const csv = toClientPackCsv(rows)
    downloadTextFile('client-content-pack.csv', csv, 'text/csv')
    downloadTextFile('client-content-pack.md', buildClientGuide(rows.length), 'text/markdown')
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

  if (isAuthenticated) {
    return (
      <div className="admin-shell">
        <header className="admin-toolbar">
          <div>
            <h1>Admin Control Panel</h1>
            <p>Server-authenticated content operations for copy updates and page lifecycle planning.</p>
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
          <button className={activeTab === 'pack' ? 'active' : ''} onClick={() => setActiveTab('pack')}>Content Pack</button>
          <button className={activeTab === 'pages' ? 'active' : ''} onClick={() => setActiveTab('pages')}>Page Registry</button>
          <button className={activeTab === 'docs' ? 'active' : ''} onClick={() => setActiveTab('docs')}>Documentation</button>
        </nav>

        {activeTab === 'pack' && (
          <section className="admin-panel-grid">
            <article className="admin-card">
              <h2>Export Client Pack</h2>
              <p>Generates a plain CSV + guide. Clients edit text only and return the file.</p>
              <button onClick={handleExportPack} className="primary-btn">
                <FileDown size={16} />
                Download Client Pack
              </button>
            </article>

            <article className="admin-card">
              <h2>Import Returned CSV</h2>
              <p>Applies approved text edits to a content draft and creates an import report.</p>
              <label className="upload-btn">
                <FileUp size={16} />
                Upload Edited CSV
                <input type="file" accept=".csv,text/csv" onChange={handleImportCsv} />
              </label>

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
          </section>
        )}

        {activeTab === 'pages' && (
          <section className="admin-panel-stack">
            <article className="admin-card">
              <h2>New Page Request</h2>
              <p>Add planned pages here. Set a page to removed by changing status in the table.</p>
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
            </article>

            <article className="admin-card">
              <h2>Page Lifecycle Registry</h2>
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
              src="/admin-docs/index.html"
              className="docs-iframe"
              title="Project Documentation"
            />
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-icon">
          <Lock size={32} strokeWidth={1.5} />
        </div>
        <h1>Admin Access</h1>
        <p>Server-validated login with signed, HttpOnly session cookie.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoFocus
          />
          {error && <span className="error-msg">{error}</span>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Admin
