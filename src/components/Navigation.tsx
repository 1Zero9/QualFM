import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false)
    }

    if (mediaQuery.matches) setIsOpen(false)
    mediaQuery.addEventListener('change', handleViewportChange)
    return () => mediaQuery.removeEventListener('change', handleViewportChange)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' }
  ]

  return (
    <>
      <header className={`nav-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" />
        </Link>

        <button
          className={`nav-hamburger ${isOpen ? 'is-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>

      <nav
        id="mobile-navigation"
        className={`nav-mobile ${isOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="nav-mobile-content" onClick={(event) => event.stopPropagation()}>
          <p className="nav-mobile-kicker">Navigation</p>
          <p className="nav-mobile-subtitle">Choose a page or contact us directly.</p>

          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-mobile-link ${isLinkActive(link.path) ? 'is-active' : ''}`}
              onClick={closeMenu}
              aria-current={isLinkActive(link.path) ? 'page' : undefined}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/contact"
            className="nav-mobile-cta"
            onClick={closeMenu}
            style={{ animationDelay: '0.35s' }}
          >
            Contact Us
          </Link>

          <div className="nav-mobile-meta">
            <a href="tel:+353868216215" className="nav-mobile-meta-link">Call +353 86 821 6215</a>
            <a href="mailto:service@qualfm.ie" className="nav-mobile-meta-link">service@qualfm.ie</a>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className={`nav-desktop ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-desktop-inner">
          <Link to="/" className="nav-desktop-logo">
            <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" />
          </Link>

          <div className="nav-desktop-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-desktop-link ${isLinkActive(link.path) ? 'is-active' : ''}`}
                aria-current={isLinkActive(link.path) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/contact" className="nav-desktop-cta">
            Contact Us
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navigation
