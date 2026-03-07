import { useState, useEffect } from 'react';
import { getCertificationList } from '../api/certification.api.js';
import { normalizeCertifications } from '../utils/apiDefaults.js';
import PageHero from '../components/PageHero.jsx';
import CertificationCardsGrid from '../components/CertificationCardsGrid.jsx';
import '../styles/certification.css';

function CertificationPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    async function loadCertifications() {
      try {
        setLoading(true);
        const data = await getCertificationList();
        setCertifications(Array.isArray(data) ? data : normalizeCertifications([]));
      } catch (err) {
        console.error('Failed to load certifications:', err);
        // Fallback: ensure dummy certifications render when API fails or returns empty.
        setCertifications(normalizeCertifications([]));
      } finally {
        setLoading(false);
      }
    }

    loadCertifications();
  }, []);

  return (
    <div>
      <PageHero
        title="Certification"
        subtitle="Comprehensive training and certification programs"
        backgroundImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80"
        breadcrumbs={[
          { label: 'Certification', path: '/certification' }
        ]}
      />
      
      <section className="certification-intro">
        <div className="certification-intro-inner">
          <h2>We provide medical training solutions</h2>
          <p>
            Our comprehensive certification programs are designed to enhance your medical expertise 
            and advance your career. Each program is carefully crafted to meet industry standards 
            and provide you with the knowledge and skills needed to excel in your field.
          </p>
        </div>
      </section>

      <CertificationCardsGrid
        certifications={certifications}
        loading={loading}
      />
    </div>
  );
}

export default CertificationPage;
