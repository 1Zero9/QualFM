import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, UsersRound } from 'lucide-react'
import './Access.css'

function Access() {
  return (
    <div className="access-page">
      <section className="access-shell">
        <p className="access-kicker">Portal Access</p>
        <h1>Choose Your Workspace</h1>
        <p className="access-intro">
          Select the portal that matches your role. Admin handles full site operations. Client Admin manages
          content requests and progress.
        </p>

        <div className="access-grid">
          <article className="access-card owner">
            <div className="access-icon">
              <ShieldCheck size={20} />
            </div>
            <h2>Admin Portal</h2>
            <p>Full control over approvals, builder tools, workload management, reports, and documentation.</p>
            <ul>
              <li>Review and approve all requests</li>
              <li>Manage worklist and status reporting</li>
              <li>Access internal documentation</li>
            </ul>
            <Link to="/admin" className="access-btn">Open Admin Portal</Link>
          </article>

          <article className="access-card client-admin">
            <div className="access-icon">
              <UsersRound size={20} />
            </div>
            <h2>Client Admin Portal</h2>
            <p>Submit content updates, track request progress, and collaborate with admin-reviewed updates.</p>
            <ul>
              <li>Submit section updates</li>
              <li>Track statuses and feedback</li>
              <li>Stay aligned on delivery progress</li>
            </ul>
            <Link to="/client-admin" className="access-btn">Open Client Admin Portal</Link>
          </article>
        </div>

        <div className="access-footer-note">
          <Building2 size={15} />
          <span>QualFM secure role-based access</span>
        </div>
      </section>
    </div>
  )
}

export default Access
