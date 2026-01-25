import { useLocation, Link } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Sectors from './pages/Sectors'
import Contact from './pages/Contact'
import './App.css'

function App() {
  const location = useLocation()
  const path = location.pathname
  const showContact = path === '/contact'

  const renderPage = () => {
    switch (path) {
      case '/about':
        return <About />
      case '/services':
        return <Services />
      case '/sectors':
        return <Sectors />
      default:
        return <Home />
    }
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
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/sectors">Sectors</a>
            <a href="/contact">Contact</a>
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
