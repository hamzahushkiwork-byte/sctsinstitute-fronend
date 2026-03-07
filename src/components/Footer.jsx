import { NavLink } from 'react-router-dom'
import logoImage from '../assets/logo-su.jpeg'
import '../styles/footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Top Row */}
        <div className="footer-top">
          <div className="footer-logo-container">
            <img src={logoImage} alt="SAUDI-CANADIAN TRAINING & SIMULATION CENTER" className="footer-logo" />
          </div>
          <p className="footer-text">
          King Fahad Road,
          Khobar, Saudi Arabia ,+966 55 724 5777, info@sctsinstitute.com          </p>
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
            {/* <NavLink
              to="/services"
              className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'}
            >
              Services
            </NavLink> */}
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
          <div className="footer-social">
            <a
              href="https://www.snapchat.com/add/scts_institute?share_id=dsdjOuZO-g8&locale=ar-JO"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Snapchat"
            >
              <i className="fa-brands fa-snapchat-ghost" aria-hidden="true"></i>
            </a>
            <a
              href="http://tiktok.com/@sctc_institute"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="TikTok"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com/scts.institute"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/scts.institute/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
          <div className="footer-copy">
            © 2026 SAUDI-CANADIAN TRAINING & SIMULATION CENTER by{' '}
            <a href="http://wa.me/+962791135684" target="_blank" rel="noopener noreferrer">
              MTD Graphic Design & Marketing
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

