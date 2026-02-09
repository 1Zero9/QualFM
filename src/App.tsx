import { useLocation, Link } from 'react-router-dom'
import Navigation from './components/Navigation'
import SeoManager from './components/SeoManager'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import { useAdminSession } from './admin/AdminSessionContext'
import './App.css'

function App() {
  const location = useLocation()
  const path = location.pathname.replace(/\/+$/, '') || '/'
  const { isAdminSession } = useAdminSession()

  const renderPage = () => {
    if (path === '/admin') return <Admin />
    if (path === '/about') return <About />
    if (path === '/services') return <Services />
    if (path === '/privacy-policy') return <PrivacyPolicy />
    if (path === '/privacy') return <PrivacyPolicy />
    if (path === '/policy') return <PrivacyPolicy />
    if (path === '/terms') return <TermsConditions />
    if (path === '/terms-conditions') return <TermsConditions />
    if (path === '/terms-and-conditions') return <TermsConditions />
    if (path === '/termsconditions') return <TermsConditions />
    // Legacy deep service routes currently resolve to the consolidated services page.
    if (path.startsWith('/services/')) return <Services />
    // Legacy sector routes currently resolve to About until sector pages are retired or reused.
    if (path === '/sectors') return <About />
    if (path.startsWith('/sectors/')) return <About />
    if (path === '/contact') return <Contact />
    return <Home />
  }

  // Admin page has its own layout
  if (path === '/admin') {
    return <Admin />
  }

  return (
    <div className="app">
      <SeoManager />
      <ScrollToTop />
      {isAdminSession && <div className="builder-session-indicator">Builder Mode Active</div>}
      <Navigation />

      <main className="main">
        {renderPage()}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <p>Quality, compliance and value across integrated facilities and maintenance services nationwide.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>richard@qualfm.ie</p>
            <p>service@qualfm.ie</p>
            <p>+353 86 821 6215</p>
            <p>Dublin, Ireland</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 QualFM. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <span>•</span>
            <a
              href="https://1zero9.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-built-by"
              aria-label="Built by 1Zero9 Studio"
            >
              <img src="/images/109-logo-circle1.png" alt="1Zero9 Studio" />
              <span>Built by 1Zero9 Studio</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
