import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from '@mui/icons-material'
import defaultInnerImage from '../assets/inner-about.jpeg'
import '../styles/page-hero.css'

const PageHero = ({ title, subtitle, backgroundImage, breadcrumbs = [] }) => {
  const heroImage = backgroundImage || defaultInnerImage
  const crumbs = breadcrumbs.length > 0 ? breadcrumbs : [{ label: title, path: '#' }]

  return (
    <section className="page-hero">
      <div
        className="page-hero-bg"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="page-hero-overlay" />

      <div className="page-hero-inner">
        {/* Breadcrumbs */}
        <motion.nav
          className="page-hero-breadcrumbs"
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">
                <Home sx={{ fontSize: 18 }} />
                <span>Home</span>
              </Link>
            </li>
            {crumbs.map((crumb, index) => (
                <li key={index} className="breadcrumb-item">
                  <span className="breadcrumb-separator">/</span>
                  {index === crumbs.length - 1 ? (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

        <motion.p
          className="page-hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          sctsinstitute
        </motion.p>

        <motion.h1
          className="page-hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="page-hero-subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default PageHero


