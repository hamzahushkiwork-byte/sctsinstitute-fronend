import { NavLink } from 'react-router-dom'
import logoImage from '../assets/logo.jpeg'
import '../styles/footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Top Row */}
        <div className="footer-top">
          <div className="footer-logo-container">
            <img src={logoImage} alt="Kingdom of Doctors" className="footer-logo" />
          </div>
          <p className="footer-text">
            Over the years, our commitment to excellence and innovation drives everything we do, ensuring that healthcare professionals and individuals receive the highest quality education and training to excel in their careers and deliver exceptional patient care.
          </p>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Row */}
        <div className="footer-bottom">
          <nav className="footer-nav">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Services
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Course Catalog
            </NavLink>
            <NavLink
              to="/certification"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Certification
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Contact
            </NavLink>
          </nav>
          <div className="footer-copy">
            © 2026 Kingdom of Doctors is Powered by{' '}
            <a href="https://toqxcel.com" target="_blank" rel="noopener noreferrer">
              TOQXCEL
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

