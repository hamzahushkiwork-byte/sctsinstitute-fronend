import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../styles/header.css'
import logoImage from '../assets/logo-su.jpeg'

function Header() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isCoursesOpen, setIsCoursesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const sideMenuRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen)
  }

  const closeMenu = () => {
    setIsSideMenuOpen(false)
  }

  const handleCoursesMouseEnter = () => {
    setIsCoursesOpen(true)
  }

  const handleCoursesMouseLeave = () => {
    setIsCoursesOpen(false)
  }

  const handleCoursesClick = () => {
    setIsCoursesOpen(!isCoursesOpen)
  }

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSideMenuOpen])

  // Accessibility: focus trap + ESC close when menu is open
  useEffect(() => {
    if (!isSideMenuOpen) return

    const panel = sideMenuRef.current
    if (!panel) return

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const focusableElements = Array.from(panel.querySelectorAll(focusableSelector))
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
        return
      }

      if (event.key === 'Tab' && focusableElements.length > 0) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const focusTarget = closeButtonRef.current || firstElement
    if (focusTarget) {
      focusTarget.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSideMenuOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    closeMenu()
  }

  const handleLoginClick = () => {
    navigate('/login')
    closeMenu()
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-inner">
          <div className="logo-container">
            <Link to="/" aria-label="Go to home page">
              <img src={logoImage} alt="SAUDI-CANADIAN TRAINING & SIMULATION CENTER" className="header-logo" />
            </Link>
          </div>

          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              About us
            </NavLink>
            <div
              className={`nav-item-with-dropdown ${isCoursesOpen ? 'open' : ''}`}
              onMouseEnter={handleCoursesMouseEnter}
              onMouseLeave={handleCoursesMouseLeave}
              onClick={handleCoursesClick}
            >
              <span className="nav-link courses-nav-link">Courses & Programs</span>
              <div className="courses-dropdown">
                <NavLink
                  to="/courses"
                  className={({ isActive }) => isActive ? 'dropdown-link dropdown-link-active' : 'dropdown-link'}
                  onClick={() => setIsCoursesOpen(false)}
                >
                  <div className="courses-dropdown-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1L10.09 5.26L15 6.27L11 9.14L11.82 14.02L8 11.77L4.18 14.02L5 9.14L1 6.27L5.91 5.26L8 1Z" fill="white" />
                    </svg>
                  </div>
                  <div className="courses-dropdown-content">
                    <div className="courses-dropdown-title">Course Catalog</div>
                    <div className="courses-dropdown-subtitle">Courses List</div>
                  </div>
                </NavLink>
                <hr className="courses-dropdown-divider" />
                <NavLink
                  to="/certification"
                  className={({ isActive }) => isActive ? 'dropdown-link dropdown-link-active' : 'dropdown-link'}
                  onClick={() => setIsCoursesOpen(false)}
                >
                  <div className="courses-dropdown-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 1L10.09 5.26L15 6.27L11 9.14L11.82 14.02L8 11.77L4.18 14.02L5 9.14L1 6.27L5.91 5.26L8 1Z" fill="white" />
                    </svg>
                  </div>
                  <div className="courses-dropdown-content">
                    <div className="courses-dropdown-title">Certification</div>
                    <div className="courses-dropdown-subtitle">Comprehensive Training</div>
                  </div>
                </NavLink>
              </div>
            </div>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Contact
            </NavLink>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <button className="auth-button logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="auth-button login-button" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isSideMenuOpen}
            aria-controls="side-menu-panel"
          >
            <span className="menu-icon">≡</span>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div className={`side-menu-overlay ${isSideMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      {/* Side Menu Panel */}
      <div
        id="side-menu-panel"
        ref={sideMenuRef}
        className={`side-menu-panel ${isSideMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Side menu"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="close-btn"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <span className="close-icon">×</span>
        </button>

        {/* Side Menu Header */}
        <div className="side-menu-header">
          <div className="side-menu-brand">
            <img src={logoImage} alt="SAUDI-CANADIAN TRAINING & SIMULATION CENTER" className="circle-logo" />
            <div className="side-menu-brand-text">
              <div className="side-menu-title">SAUDI-CANADIAN TRAINING & SIMULATION CENTER</div>
          
            </div>
          </div>
        </div>

        {/* Auth Button */}
        {isAuthenticated ? (
          <button className="eto-login-btn" onClick={handleLogout}>
            Logout →
          </button>
        ) : (
          <button className="eto-login-btn" onClick={handleLoginClick}>
            Login →
          </button>
        )}

        {/* Divider */}
        <div className="divider"></div>

        {/* Contact Information */}
        <div className="contact-section">
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div className="contact-text">
              <div>info@sctsinstitute.com</div>
            </div>
          </div>

      
        </div>

        {/* Navigation Links */}
        <nav className="side-menu-nav">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-house" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Home</span>
            </span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-circle-info" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">About us</span>
            </span>
          </NavLink>
          {/* <NavLink 
            to="/services" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-handshake" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Services</span>
            </span>
          </NavLink> */}
          <NavLink
            to="/courses"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-book-open" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Courses</span>
            </span>
          </NavLink>
          <NavLink
            to="/certification"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-certificate" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Certification</span>
            </span>
          </NavLink>
          {/* <NavLink
            to="/courses-programs"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-graduation-cap" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Courses & Programs</span>
            </span>
          </NavLink> */}
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            <span className="side-nav-icon fa-solid fa-envelope" aria-hidden="true"></span>
            <span className="side-nav-text">
              <span className="side-nav-title">Contact</span>
            </span>
          </NavLink>
        </nav>

        <div className="side-menu-footer">
          <div className="side-menu-social">
            <a
              href="https://www.snapchat.com/add/scts_institute?share_id=dsdjOuZO-g8&locale=ar-JO"
              target="_blank"
              rel="noopener noreferrer"
              className="side-social-link"
              aria-label="Snapchat"
            >
              <i className="fa-brands fa-snapchat-ghost" aria-hidden="true"></i>
            </a>
            <a
              href="http://tiktok.com/@sctc_institute"
              target="_blank"
              rel="noopener noreferrer"
              className="side-social-link"
              aria-label="TikTok"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com/scts.institute"
              target="_blank"
              rel="noopener noreferrer"
              className="side-social-link"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/scts.institute/"
              target="_blank"
              rel="noopener noreferrer"
              className="side-social-link"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header

