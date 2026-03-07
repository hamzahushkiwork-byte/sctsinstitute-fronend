import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import { normalizeServices } from '../utils/apiDefaults.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';
import '../styles/services-section.css';

function ServicesSection({ 
  title = "Explore our services", 
  subtitle = "Discover comprehensive training programs designed to elevate your medical expertise and advance your career." 
}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const response = await apiClient.get('/services');
        // Debug: log full API response so we can verify the correct data path.
        console.debug('[ServicesSection] Raw API response:', response?.data);

        // Fix: normalize the API envelope to a safe array before rendering.
        const normalized = normalizeApiResponse(response?.data);
        console.debug('[ServicesSection] Normalized services:', normalized);
        setServices(normalized);
      } catch (err) {
        console.error('Failed to load services from API:', err);
        // Fix: if API fails or returns empty, render default services.
        setServices(normalizeServices([]));
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  useEffect(() => {
    // Debug: confirm render conditions after data arrives.
    console.debug('[ServicesSection] Render check:', {
      loading,
      isArray: Array.isArray(services),
      length: Array.isArray(services) ? services.length : null,
    });
  }, [loading, services]);

  // Normalization layer: keeps API shape intact but guarantees an array for UI usage.
  const normalizeApiResponse = (rawApiResponse) => {
    const candidate = rawApiResponse?.data ?? rawApiResponse?.result ?? rawApiResponse;
    const list = Array.isArray(candidate) ? candidate : [];
    return normalizeServices(list);
  };

  if (loading) {
    return (
      <section className="services-section">
        <div className="services-section-inner">
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(services) || services.length === 0) {
    return null; // Don't render section if no services
  }

  const getImageUrl = (imageUrl) => toAbsoluteMediaUrl(imageUrl);

  return (
    <section className="services-section">
      <div className="services-section-inner">
        <div className="services-header">
          <h2 className="services-title">{title}</h2>
          <p className="services-subtitle">{subtitle}</p>
        </div>
        <div className="services-grid">
          {services.map((service) => {
            const imageUrl = getImageUrl(service.imageUrl);
            const cardContent = (
              <>
                <div className="service-card-image-container">
                  <img 
                    className="service-card-image" 
                    src={imageUrl} 
                    alt={service.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="service-card-overlay"></div>
                </div>
                <div className="service-card-content">
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-description">{service.description}</p>
                  <div className="service-card-link">Learn more →</div>
                </div>
              </>
            );
            
            return service.slug ? (
              <Link 
                key={service._id || service.id} 
                to={`/services/${service.slug}`} 
                state={{ service }}
                className="service-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={service._id || service.id} className="service-card">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
