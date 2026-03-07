import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { coursesList } from '../data/coursesCatalog'
import '../styles/courses.css'

function Courses() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const courses = [
    { id: 1, name: 'Advanced Trauma Life Support (ATLS)', duration: '2 Days' },
    { id: 2, name: 'Basic Life Support (BLS)', duration: '1 Day' },
    { id: 3, name: 'Advanced Cardiac Life Support (ACLS)', duration: '2 Days' },
    { id: 4, name: 'Pediatric Advanced Life Support (PALS)', duration: '2 Days' },
    { id: 5, name: 'Neonatal Resuscitation Program (NRP)', duration: '1 Day' },
    { id: 6, name: 'First Aid & Heart Saver', duration: '1 Day' },
    { id: 7, name: 'Infection Control', duration: '1 Day' },
    { id: 8, name: 'Disaster Management', duration: '2 Days' },
    { id: 9, name: 'Continuous Medical Education (CME)', duration: '1 Day' },
  ]

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
          
          <div className="courses-table-wrapper">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Course</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="available-courses" dir="rtl">
            <div className="available-courses-header">
              <h3 className="available-courses-title">الدورات المتاحة</h3>
              <p className="available-courses-subtitle">
                اختر الدورة المناسبة لك واستعرض التفاصيل الكاملة.
              </p>
            </div>
            <div className="course-cards-grid">
              {coursesList.map((course) => (
                <Link
                  key={course.slug}
                  to={`/courses/${course.slug}`}
                  className="course-card"
                  aria-label={`عرض تفاصيل ${course.title}`}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-card-image"
                    loading="lazy"
                  />
                  <div className="course-card-body">
                    <h4 className="course-card-title">{course.title}</h4>
                  </div>
                  <div className="course-card-overlay">
                    <p className="course-card-desc">{course.shortDesc}</p>
                    <span className="course-card-cta">عرض التفاصيل</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses
