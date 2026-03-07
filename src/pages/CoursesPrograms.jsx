import { useEffect } from 'react'
import PageHero from '../components/PageHero'

function CoursesPrograms() {
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
        title="Courses & Programs"
        subtitle="Explore our diverse range of medical training programs"
        backgroundImage="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1920&q=80"
        breadcrumbs={[{ label: 'Courses & Programs', path: '/courses-programs' }]}
      />
      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Courses & Programs</h1>
      </div>
    </div>
  )
}

export default CoursesPrograms

