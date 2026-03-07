import { useEffect, useState } from 'react'
import { getCoursesList } from '../api/courses.api.js'
import { getCertificationList } from '../api/certification.api.js'
import { normalizeCourses, normalizeCertifications } from '../utils/apiDefaults.js'
import CoursesCardsGrid from './CoursesCardsGrid'
import CertificationCardsGrid from './CertificationCardsGrid'
import '../styles/home-highlights.css'

function HomeHighlights() {
  const [courses, setCourses] = useState([])
  const [certifications, setCertifications] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [certsLoading, setCertsLoading] = useState(true)

  useEffect(() => {
    async function loadCourses() {
      try {
        setCoursesLoading(true)
        const data = await getCoursesList()
        setCourses(normalizeCourses(Array.isArray(data) ? data : []))
      } catch (err) {
        console.error('Failed to load courses:', err)
        setCourses(normalizeCourses([]))
      } finally {
        setCoursesLoading(false)
      }
    }

    loadCourses()
  }, [])

  useEffect(() => {
    async function loadCertifications() {
      try {
        setCertsLoading(true)
        const data = await getCertificationList()
        setCertifications(Array.isArray(data) ? data : normalizeCertifications([]))
      } catch (err) {
        console.error('Failed to load certifications:', err)
        setCertifications(normalizeCertifications([]))
      } finally {
        setCertsLoading(false)
      }
    }

    loadCertifications()
  }, [])

  const homeCourses = courses.slice(0, 4)
  const homeCertifications = certifications.slice(0, 3)

  return (
    <div className="home-highlights" dir="rtl">
      <section className="home-highlight-section">
        <div className="home-highlight-header">
          <p className="home-highlight-eyebrow">Available courses</p>
          <h2 className="home-highlight-title">Choose the right course for you</h2>
        </div>

        <CoursesCardsGrid
          courses={homeCourses}
          loading={coursesLoading}
          emptyMessage="No courses available right now."
          showDemoUnavailable
        />
      </section>

      <section className="home-highlight-section is-light">
        <div className="home-highlight-header">
          <p className="home-highlight-eyebrow">Accredited certifications</p>
          <h2 className="home-highlight-title">Credentials that strengthen your career</h2>
          <p className="home-highlight-subtitle">
            Globally recognized certifications that boost your opportunities.
          </p>
        </div>

        <CertificationCardsGrid
          certifications={homeCertifications}
          loading={certsLoading}
          emptyMessage="No certifications available right now."
        />
      </section>
    </div>
  )
}

export default HomeHighlights
