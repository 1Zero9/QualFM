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

type TabKey = 'overview' | 'docs' | 'builder' | 'worklist'

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

type WorkItemStatus = 'todo' | 'in_progress' | 'blocked' | 'done'
type WorkItemPriority = 'low' | 'medium' | 'high' | 'critical'

type WorkItem = {
  id: string
  title: string
  description: string
  status: WorkItemStatus
  priority: WorkItemPriority
  category: string
  owner: string
  dueDate: string | null
  progress: number
  tags: string[]
  clientVisible: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

type WorkItemsReport = {
  generatedAt: string
  summary: {
    total: number
    done: number
    completionRate: number
    overdue: number
  }
  byStatus: Array<{ status: WorkItemStatus; count: number }>
  byPriority: Array<{ priority: WorkItemPriority; count: number }>
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
  const { role, username, isCheckingSession, refreshSession, hasPermission } = useAdminSession()

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [contentDraft, setContentDraft] = useState<SiteContent>(() => cloneSiteContent())
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null)
  const [newPageRoute, setNewPageRoute] = useState('')
  const [newPageLabel, setNewPageLabel] = useState('')
  const [requests, setRequests] = useState<ChangeRequest[]>([])
  const [workItems, setWorkItems] = useState<WorkItem[]>([])
  const [workReport, setWorkReport] = useState<WorkItemsReport | null>(null)
  const [newWorkItem, setNewWorkItem] = useState({
    title: '',
    owner: '',
    dueDate: '',
    priority: 'medium' as WorkItemPriority,
    category: 'delivery',
    description: ''
  })

  const rows = useMemo(() => flattenContent(contentDraft), [contentDraft])
  const pendingRequests = useMemo(() => requests.filter((item) => item.status === 'pending').length, [requests])
  const blockedWorkItems = useMemo(() => workItems.filter((item) => item.status === 'blocked').length, [workItems])
  const inProgressWorkItems = useMemo(
    () => workItems.filter((item) => item.status === 'in_progress').length,
    [workItems]
  )
  const doneWorkItems = useMemo(() => workItems.filter((item) => item.status === 'done').length, [workItems])
  const overdueWorkItems = useMemo(
    () =>
      workItems.filter((item) => {
        if (!item.dueDate || item.status === 'done') return false
        return new Date(item.dueDate).getTime() < Date.now()
      }).length,
    [workItems]
  )

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

  const fetchWorkItems = async () => {
    try {
      const response = await fetch('/api/work-items', {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) return
      const payload = (await response.json()) as { items: WorkItem[] }
      setWorkItems(payload.items || [])
    } catch {
      setError('Unable to load work items')
    }
  }

  const fetchWorkReport = async () => {
    try {
      const response = await fetch('/api/work-items-report', {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        setError('Unable to generate report')
        return
      }
      const payload = (await response.json()) as WorkItemsReport
      setWorkReport(payload)
    } catch {
      setError('Unable to generate report')
    }
  }

  useEffect(() => {
    if (role === 'owner') {
      void fetchRequests()
      void fetchWorkItems()
      void fetchWorkReport()
    }
  }, [role])

  useEffect(() => {
    if (role === 'owner' && activeTab === 'worklist') {
      void fetchWorkItems()
    }
  }, [role, activeTab])

  useEffect(() => {
    if (activeTab === 'overview') {
      void fetchRequests()
      void fetchWorkItems()
      void fetchWorkReport()
    }
  }, [activeTab])

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
          expectedRole: 'owner'
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

  const createWorkItem = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newWorkItem.title.trim()) {
      setError('Work item title is required')
      return
    }

    try {
      const response = await fetch('/api/work-items', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newWorkItem.title,
          description: newWorkItem.description,
          owner: newWorkItem.owner,
          dueDate: newWorkItem.dueDate || null,
          priority: newWorkItem.priority,
          category: newWorkItem.category,
          status: 'todo',
          progress: 0,
          clientVisible: true
        })
      })

      if (!response.ok) {
        setError('Unable to create work item')
        return
      }

      setNewWorkItem({
        title: '',
        owner: '',
        dueDate: '',
        priority: 'medium',
        category: 'delivery',
        description: ''
      })
      await fetchWorkItems()
    } catch {
      setError('Unable to create work item')
    }
  }

  const saveWorkItem = async (item: WorkItem) => {
    try {
      const response = await fetch('/api/work-items', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      if (!response.ok) {
        setError('Unable to save work item')
        return
      }
      await fetchWorkItems()
    } catch {
      setError('Unable to save work item')
    }
  }

  const updateLocalWorkItem = (id: string, field: keyof WorkItem, value: string | number | boolean) => {
    setWorkItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          [field]: value
        }
      })
    )
  }

  const downloadWorkReport = () => {
    if (!workReport) return
    const lines = [
      '# Progress Report',
      '',
      `Generated: ${new Date(workReport.generatedAt).toLocaleString()}`,
      `Total work items: ${workReport.summary.total}`,
      `Completed: ${workReport.summary.done}`,
      `Completion rate: ${workReport.summary.completionRate}%`,
      `Overdue: ${workReport.summary.overdue}`,
      '',
      '## By Status'
    ]

    workReport.byStatus.forEach((item) => {
      lines.push(`- ${item.status}: ${item.count}`)
    })
    lines.push('', '## By Priority')
    workReport.byPriority.forEach((item) => {
      lines.push(`- ${item.priority}: ${item.count}`)
    })

    downloadTextFile('progress-report.md', `${lines.join('\n')}\n`, 'text/markdown')
  }

  if (isCheckingSession) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h1>Owner Access</h1>
          <p>Checking secure session...</p>
        </div>
      </div>
    )
  }

  if (role !== 'owner') {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="login-icon">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h1>Owner Access</h1>
          <p>Sign in with your owner account.</p>

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
          <h1>Owner Control Panel</h1>
          <p>Signed in as {username}. Review client-admin requests and manage builder updates.</p>
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
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        {hasPermission('content.manage') && (
          <button className={activeTab === 'builder' ? 'active' : ''} onClick={() => setActiveTab('builder')}>
            Builder
          </button>
        )}
        {hasPermission('work_items.view') && (
          <button className={activeTab === 'worklist' ? 'active' : ''} onClick={() => setActiveTab('worklist')}>
            Worklist
          </button>
        )}
        {hasPermission('docs.view') && (
          <button className={activeTab === 'docs' ? 'active' : ''} onClick={() => setActiveTab('docs')}>
            Documentation
          </button>
        )}
      </nav>

      {activeTab === 'overview' && (
        <section className="admin-panel-stack">
          <article className="admin-card">
            <h2>Today At A Glance</h2>
            <p>Use this dashboard for fast triage before moving into detailed workflows.</p>
            <div className="owner-kpi-grid">
              <div className="owner-kpi-card">
                <span>Pending requests</span>
                <strong>{pendingRequests}</strong>
              </div>
              <div className="owner-kpi-card">
                <span>In-progress jobs</span>
                <strong>{inProgressWorkItems}</strong>
              </div>
              <div className="owner-kpi-card">
                <span>Blocked jobs</span>
                <strong>{blockedWorkItems}</strong>
              </div>
              <div className="owner-kpi-card">
                <span>Completed jobs</span>
                <strong>{doneWorkItems}</strong>
              </div>
              <div className="owner-kpi-card">
                <span>Overdue jobs</span>
                <strong>{overdueWorkItems}</strong>
              </div>
              <div className="owner-kpi-card">
                <span>Report completion</span>
                <strong>{workReport?.summary.completionRate ?? 0}%</strong>
              </div>
            </div>
          </article>

          <article className="admin-card">
            <h2>Quick Actions</h2>
            <p>Jump directly into the next best action.</p>
            <div className="inline-actions">
              <button onClick={() => setActiveTab('builder')}>Review Request Queue</button>
              <button onClick={() => setActiveTab('worklist')}>Open Worklist</button>
              <button onClick={() => void fetchWorkReport()}>Refresh Progress Report</button>
              <button onClick={downloadWorkReport} disabled={!workReport}>Download Client Report</button>
            </div>
          </article>

          <article className="admin-card">
            <h2>Attention Required</h2>
            <p>Items needing immediate follow-up.</p>
            <div className="table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests === 0 && blockedWorkItems === 0 && overdueWorkItems === 0 && (
                    <tr>
                      <td colSpan={4}>No urgent items right now.</td>
                    </tr>
                  )}
                  {requests
                    .filter((item) => item.status === 'pending')
                    .slice(0, 4)
                    .map((item) => (
                      <tr key={`pending-${item.id}`}>
                        <td>Request</td>
                        <td>{item.id}</td>
                        <td>{item.requester} pending review for {item.blockId}</td>
                        <td><button onClick={() => setActiveTab('builder')}>Open Queue</button></td>
                      </tr>
                    ))}
                  {workItems
                    .filter((item) => item.status === 'blocked')
                    .slice(0, 4)
                    .map((item) => (
                      <tr key={`blocked-${item.id}`}>
                        <td>Work Item</td>
                        <td>{item.id}</td>
                        <td>{item.title} is blocked</td>
                        <td><button onClick={() => setActiveTab('worklist')}>Open Worklist</button></td>
                      </tr>
                    ))}
                  {workItems
                    .filter((item) => {
                      if (!item.dueDate || item.status === 'done') return false
                      return new Date(item.dueDate).getTime() < Date.now()
                    })
                    .slice(0, 4)
                    .map((item) => (
                      <tr key={`overdue-${item.id}`}>
                        <td>Overdue</td>
                        <td>{item.id}</td>
                        <td>{item.title} due {new Date(item.dueDate as string).toLocaleDateString()}</td>
                        <td><button onClick={() => setActiveTab('worklist')}>Open Worklist</button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      )}

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

      {activeTab === 'worklist' && (
        <section className="admin-panel-stack">
          <article className="admin-card">
            <h2>Worklist</h2>
            <p>Track portal build jobs, priorities, and delivery progress.</p>
            <form className="new-page-form" onSubmit={createWorkItem}>
              <input
                value={newWorkItem.title}
                onChange={(event) => setNewWorkItem((current) => ({ ...current, title: event.target.value }))}
                placeholder="Job title"
              />
              <input
                value={newWorkItem.owner}
                onChange={(event) => setNewWorkItem((current) => ({ ...current, owner: event.target.value }))}
                placeholder="Owner"
              />
              <input
                type="date"
                value={newWorkItem.dueDate}
                onChange={(event) => setNewWorkItem((current) => ({ ...current, dueDate: event.target.value }))}
              />
              <select
                value={newWorkItem.priority}
                onChange={(event) =>
                  setNewWorkItem((current) => ({ ...current, priority: event.target.value as WorkItemPriority }))
                }
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
              <button type="submit">Add Job</button>
            </form>

            <div className="table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Owner</th>
                    <th>Due</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workItems.length === 0 && (
                    <tr>
                      <td colSpan={7}>No jobs yet.</td>
                    </tr>
                  )}
                  {workItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          value={item.title}
                          onChange={(event) => updateLocalWorkItem(item.id, 'title', event.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(event) =>
                            updateLocalWorkItem(item.id, 'status', event.target.value as WorkItemStatus)
                          }
                        >
                          <option value="todo">todo</option>
                          <option value="in_progress">in_progress</option>
                          <option value="blocked">blocked</option>
                          <option value="done">done</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={item.priority}
                          onChange={(event) =>
                            updateLocalWorkItem(item.id, 'priority', event.target.value as WorkItemPriority)
                          }
                        >
                          <option value="low">low</option>
                          <option value="medium">medium</option>
                          <option value="high">high</option>
                          <option value="critical">critical</option>
                        </select>
                      </td>
                      <td>
                        <input
                          value={item.owner}
                          onChange={(event) => updateLocalWorkItem(item.id, 'owner', event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={item.dueDate || ''}
                          onChange={(event) => updateLocalWorkItem(item.id, 'dueDate', event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.progress}
                          onChange={(event) => updateLocalWorkItem(item.id, 'progress', Number(event.target.value))}
                        />
                      </td>
                      <td>
                        <button onClick={() => void saveWorkItem(item)}>Save</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="admin-card">
            <h2>Progress Reports</h2>
            <p>Generate a current progress snapshot for client updates.</p>
            <div className="inline-actions">
              <button onClick={() => void fetchWorkReport()}>Run Report</button>
              <button onClick={downloadWorkReport} disabled={!workReport}>
                Download Report
              </button>
            </div>

            {workReport && (
              <div className="summary-box">
                <p>Total jobs: <strong>{workReport.summary.total}</strong></p>
                <p>Completed: <strong>{workReport.summary.done}</strong></p>
                <p>Completion rate: <strong>{workReport.summary.completionRate}%</strong></p>
                <p>Overdue: <strong>{workReport.summary.overdue}</strong></p>
              </div>
            )}
          </article>
        </section>
      )}

      {activeTab === 'docs' && (
        <section className="admin-docs-wrap">
          <iframe
            src="/admin-docs/"
            className="docs-iframe"
            title="Project Documentation"
          />
        </section>
      )}
    </div>
  )
}

export default Admin
