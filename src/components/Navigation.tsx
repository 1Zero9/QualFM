import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/sectors', label: 'Sectors' },
  ]

  return (
    <>
      <header className="nav-header">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" />
        </Link>

        <button
          className={`nav-hamburger ${isOpen ? 'is-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>

      <nav className={`nav-mobile ${isOpen ? 'is-open' : ''}`}>
        <div className="nav-mobile-content">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-mobile-link ${location.pathname === link.path ? 'is-active' : ''}`}
              onClick={closeMenu}
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
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="nav-desktop">
        <div className="nav-desktop-inner">
          <Link to="/" className="nav-desktop-logo">
            <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" />
          </Link>

          <div className="nav-desktop-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-desktop-link ${location.pathname === link.path ? 'is-active' : ''}`}
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
