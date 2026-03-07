import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../styles/header.css'
import logoImage from '../assets/logo.jpeg'

function Header() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isCoursesOpen, setIsCoursesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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
            <img src={logoImage} alt="KOD Logo" className="header-logo" />
          </div>

          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              About us
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Services
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Courses
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
                      <path d="M8 1L10.09 5.26L15 6.27L11 9.14L11.82 14.02L8 11.77L4.18 14.02L5 9.14L1 6.27L5.91 5.26L8 1Z" fill="white"/>
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
                      <path d="M8 1L10.09 5.26L15 6.27L11 9.14L11.82 14.02L8 11.77L4.18 14.02L5 9.14L1 6.27L5.91 5.26L8 1Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="courses-dropdown-content">
                    <div className="courses-dropdown-title">Certification</div>
                    <div className="courses-dropdown-subtitle">Comprehensive Training</div>
                  </div>
                </NavLink>
              </div>
            </div>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
              Services
            </NavLink>
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

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <span className="menu-icon">≡</span>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div className={`side-menu-overlay ${isSideMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      {/* Side Menu Panel */}
      <div className={`side-menu-panel ${isSideMenuOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button className="close-btn" onClick={closeMenu} aria-label="Close menu">
          <span className="close-icon">×</span>
        </button>

        {/* Gradient Circle with Logo */}
        <div className="gradient-circle">
          <img src={logoImage} alt="KOD Logo" className="circle-logo" />
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
              <div>admin-2@kod.sa.com</div>
              <div>op-kbr-1@kod.sa.com</div>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div className="contact-text">
              <div className="phone-number">+966-536701246</div>
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
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            About us
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            Services
          </NavLink>
          <NavLink 
            to="/courses" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            Courses
          </NavLink>
          <NavLink 
            to="/certification" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            Certification
          </NavLink>
          <NavLink 
            to="/courses-programs" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            Courses & Programs
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? 'side-nav-link active' : 'side-nav-link'}
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </>
  )
}

export default Header

