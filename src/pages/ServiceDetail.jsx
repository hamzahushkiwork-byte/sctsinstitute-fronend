import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getServiceBySlug } from '../services/services.api.js'
import PageHero from '../components/PageHero'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js'
import { normalizeService } from '../utils/apiDefaults.js'
import '../styles/service-detail.css'

function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch service by slug from API
  useEffect(() => {
    async function loadService() {
      if (!slug) {
        navigate('/services')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getServiceBySlug(slug)
        // Fix: always normalize to a safe object for the inner view.
        setService(normalizeService(data))
      } catch (err) {
        console.error('Failed to load service:', err)
        // Fallback: use state data or defaults when API fails/returns empty.
        const fallback = normalizeService(location.state?.service || null)
        setService(fallback)
        setError(fallback ? null : (err.response?.status === 404 ? 'Service not found' : 'Failed to load service'))
      } finally {
        setLoading(false)
      }
    }

    loadService()
  }, [slug, navigate, location.state])

  // Scroll to top when entering this page / changing slug
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <section className="service-details">
        <div className="service-details-content" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error || !service) {
    return (
      <section className="service-details">
        <div className="service-details-content" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <p>{error || 'Service not found'}</p>
        </div>
      </section>
    )
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? imageUrl
      : toAbsoluteMediaUrl(imageUrl);
  };

  const heroImageUrl = service.innerImageUrl
    ? getImageUrl(service.innerImageUrl)
    : (service.imageUrl ? getImageUrl(service.imageUrl) : '')

  return (
    <section className="service-details">
      <PageHero
        title={service.title}
        subtitle={service.shortDescription || undefined}
        backgroundImage={heroImageUrl}
        breadcrumbs={[
          { label: 'Services', path: '/services' },
          { label: service.title, path: '#' }
        ]}
      />
      <div className="service-details-content">
        <p>{service.description}</p>
      </div>
    </section>
  )
}

export default ServiceDetail

