import { useEffect } from 'react'
import PageHero from '../components/PageHero'

function Certification() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <div>
      <PageHero
        title="Certification"
        subtitle="Comprehensive training and certification programs"
        backgroundImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80"
        breadcrumbs={[{ label: 'Certification', path: '/certification' }]}
      />
      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Certification</h1>
        <p>Comprehensive training and certification programs.</p>
      </div>
    </div>
  )
}

export default Certification

