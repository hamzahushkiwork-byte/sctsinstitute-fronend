import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { getCoursesList } from '../api/courses.api.js'
import { normalizeCourses } from '../utils/apiDefaults.js'
import CoursesCardsGrid from '../components/CoursesCardsGrid'
import '../styles/courses.css'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true)
        const data = await getCoursesList()
        // Normalize to ensure isAvailable exists (default true) and fields are consistent.
        setCourses(normalizeCourses(Array.isArray(data) ? data : []))
      } catch (err) {
        console.error('Failed to load courses:', err)
        // Keep UI stable: show empty list but still normalized shape.
        setCourses(normalizeCourses([]))
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <div>
      <PageHero
        title="Course Catalog"
        subtitle="Browse our comprehensive list of courses"
        backgroundImage="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1920&q=80"
        breadcrumbs={[{ label: 'Courses', path: '/courses' }]}
      />

      <section className="courses-section">
        <div className="courses-container">
          <h2 className="courses-title">Courses List</h2>
          <CoursesCardsGrid
            courses={courses}
            loading={loading}
            showHeader
            showDemoUnavailable={courses.length === 0}
          />
        </div>
      </section>
    </div>
  )
}

export default CoursesPage
