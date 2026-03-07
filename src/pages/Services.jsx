import { useEffect } from 'react'
import PageHero from '../components/PageHero'
import ServicesSection from '../components/ServicesSection'
import heroAbout from '../assets/inner-about.jpeg'

function Services() {
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
        title="Our Services"
        subtitle="Comprehensive medical training and professional development programs"
        backgroundImage={heroAbout}
        breadcrumbs={[
          { label: 'Services', path: '/services' }
        ]}
      />
      <ServicesSection />
    </div>
  )
}

export default Services

