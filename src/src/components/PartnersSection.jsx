import { useState, useEffect } from 'react'
import { fetchPartners } from '../api/endpoints.js'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js'
import '../styles/partners-section.css'

const PartnersSection = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPartners() {
      try {
        const data = await fetchPartners()
        setPartners(data || [])
      } catch (error) {
        console.error('Failed to load partners:', error)
        // Keep empty array on error
      } finally {
        setLoading(false)
      }
    }

    loadPartners()
  }, [])

  if (loading) {
    return (
      <section className="partners-section">
        <div className="partners-inner">
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Loading partners...
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return null // Don't render section if no partners
  }

  return (
    <section className="partners-section">
      <div className="partners-inner">
        {partners.map((partner) => {
          const logoUrl = partner.logoUrl ? toAbsoluteMediaUrl(partner.logoUrl) : ''
          return (
            <div key={partner._id || partner.id} className="partner-col">
              <a
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                <img
                  src={logoUrl}
                  alt={partner.name || 'Partner'}
                  className="partner-logo"
                  onError={(e) => {
                    console.error('Failed to load partner logo:', logoUrl)
                    e.target.style.display = 'none'
                  }}
                />
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PartnersSection

