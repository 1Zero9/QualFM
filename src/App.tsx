import { useLocation, Link } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Sectors from './pages/Sectors'
import SectorDetail from './pages/SectorDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const location = useLocation()
  const path = location.pathname
  const showContact = path === '/contact'

  const renderPage = () => {
    if (path === '/admin') return <Admin />
    if (path === '/about') return <About />
    if (path === '/services') return <Services />
    if (path.startsWith('/services/')) return <ServiceDetail />
    if (path === '/sectors') return <Sectors />
    if (path.startsWith('/sectors/')) return <SectorDetail />
    if (path === '/contact') return <Home />
    return <Home />
  }

  // Admin page has its own layout
  if (path === '/admin') {
    return <Admin />
  }

  return (
    <div className="app">
      <Navigation />

      <main className="main">
        {renderPage()}
        {showContact && <Contact />}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="footer-logo" />
            <p>Quality Facilities Management solutions for businesses across Ireland.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/sectors">Sectors</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Dublin, Ireland</p>
            <p>info@qualfm.ie</p>
            <p>+353 1 234 5678</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 QualFM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
