import { Link } from 'react-router-dom'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js'
import '../styles/certification.css'

function CertificationCardsGrid({
  certifications,
  loading,
  emptyMessage = 'No certifications available at this time.',
}) {
  if (loading) {
    return (
      <section className="certification-list">
        <div className="certification-list-inner">
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p>Loading certifications...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!Array.isArray(certifications) || certifications.length === 0) {
    return (
      <section className="certification-list">
        <div className="certification-list-inner">
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p>{emptyMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="certification-list">
      <div className="certification-list-inner">
        {certifications.map((cert) => {
          const imageUrl = cert.cardImageUrl ? toAbsoluteMediaUrl(cert.cardImageUrl) : ''

          return (
            <Link
              key={cert._id || cert.id || cert.slug}
              to={`/certification/${cert.slug}`}
              state={{ certification: cert }}
              className="certification-card"
            >
              <div className="certification-card-image-container">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={cert.title}
                    className="certification-card-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                <div className="certification-card-placeholder" style={{ display: imageUrl ? 'none' : 'block' }}>
                  <span>No Image</span>
                </div>
              </div>
              <div className="certification-card-content">
                <h3 className="certification-card-title">{cert.title}</h3>
                <p className="certification-card-description">{cert.shortDescription || ''}</p>
                <div className="certification-card-link">Learn more →</div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CertificationCardsGrid
