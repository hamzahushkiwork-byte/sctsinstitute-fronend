import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCertificationBySlug } from '../api/certification.api.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';
import PageHero from '../components/PageHero';
import { normalizeCertification } from '../utils/apiDefaults.js';
import '../styles/certification-detail.css';

function CertificationDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: always return a safe object for inner rendering.
  const normalizeCertificationDetails = (data) => normalizeCertification(data);

  useEffect(() => {
    async function loadCertification() {
      if (!slug) {
        navigate('/certification');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCertificationBySlug(slug);
        setCertification(normalizeCertificationDetails(data));
      } catch (err) {
        console.error('Failed to load certification:', err);
        // Fallback: use state data or defaults when API fails/returns empty.
        const fallback = normalizeCertificationDetails(location.state?.certification || null);
        setCertification(fallback);
        setError(fallback ? null : (err.response?.status === 404 ? 'Certification not found' : 'Failed to load certification'));
      } finally {
        setLoading(false);
      }
    }

    loadCertification();
  }, [slug, navigate, location.state]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [slug]);

  if (loading) {
    return (
      <section className="certification-details">
        <div className="certification-details-content" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !certification) {
    return (
      <section className="certification-details">
        <div className="certification-details-content" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <p>{error || 'Certification not found'}</p>
          <button onClick={() => navigate('/certification')} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Back to Certifications
          </button>
        </div>
      </section>
    );
  }

  const heroImageUrl = certification.heroImageUrl
    ? toAbsoluteMediaUrl(certification.heroImageUrl)
    : (certification.cardImageUrl ? toAbsoluteMediaUrl(certification.cardImageUrl) : '');
  const innerImageUrl = certification.innerImageUrl
    ? toAbsoluteMediaUrl(certification.innerImageUrl)
    : (certification.cardImageUrl ? toAbsoluteMediaUrl(certification.cardImageUrl) : '');
  const benefits = Array.isArray(certification.benefits) ? certification.benefits : [];

  return (
    <section className="certification-details">
      <PageHero
        title={certification.title}
        subtitle={certification.heroSubtitle || undefined}
        backgroundImage={heroImageUrl}
        breadcrumbs={[
          { label: 'Certification', path: '/certification' },
          { label: certification.title, path: '#' }
        ]}
      />

      {/* Content Section */}
      <div className="certification-details-content">
        <div className="certification-details-content-inner">
          {innerImageUrl && (
            <div className="certification-details-image-container">
              <img
                src={innerImageUrl}
                alt={certification.title}
                className="certification-details-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="certification-details-text">
            <div className="certification-details-meta">
              {certification.issuer ? (
                <div className="certification-meta-item">
                  <span className="certification-meta-label">Issuer</span>
                  <span className="certification-meta-value">{certification.issuer}</span>
                </div>
              ) : null}
              {certification.validityDate ? (
                <div className="certification-meta-item">
                  <span className="certification-meta-label">Validity</span>
                  <span className="certification-meta-value">{certification.validityDate}</span>
                </div>
              ) : null}
            </div>
            {certification.description ? (
              <div 
                className="certification-details-description"
                style={{ whiteSpace: 'pre-line' }}
              >
                {certification.description}
              </div>
            ) : (
              <p>No description available.</p>
            )}

            {benefits.length > 0 ? (
              <div className="certification-benefits">
                <h4 className="certification-benefits-title">Benefits</h4>
                <ul className="certification-benefits-list">
                  {benefits.map((benefit, index) => (
                    <li key={`${benefit}-${index}`}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificationDetails;
