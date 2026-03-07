import { Link } from 'react-router-dom'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js'
import '../styles/courses.css'

function CoursesCardsGrid({
  courses,
  loading,
  emptyMessage = 'No courses available at this time.',
  showHeader = false,
  showDemoUnavailable = false,
}) {
  const demoUnavailableCourse = showDemoUnavailable
    ? {
      slug: 'demo-unavailable',
      title: 'Demo Course (Coming Soon)',
      cardBody: 'Professional, accredited medical course.',
      isAvailable: false,
    }
    : null

  // If we have real courses, we hide the demo one.
  // If we don't have real courses and showDemoUnavailable is true, we show the demo one.
  const hasRealCourses = Array.isArray(courses) && courses.length > 0
  const displayedCourses = hasRealCourses
    ? courses
    : (demoUnavailableCourse ? [demoUnavailableCourse] : [])

  if (loading) {
    return (
      <div className="available-courses" style={{ marginTop: '72px', textAlign: 'center', padding: '40px' }}>
        <p>Loading courses...</p>
      </div>
    )
  }

  if (displayedCourses.length === 0) {
    return (
      <div className="available-courses" style={{ marginTop: '72px', textAlign: 'center', padding: '40px' }}>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="available-courses" dir="rtl">
      {showHeader && (
        <div className="available-courses-header">
          <h3 className="available-courses-title">Courses</h3>
          <p className="available-courses-subtitle">
            Choose the right course and explore full details.
          </p>
        </div>
      )}

      <div className="course-cards-grid">
        {displayedCourses.map((course, index) => {
          const imageUrl = course.imageUrl ? toAbsoluteMediaUrl(course.imageUrl) : ''
          const courseSlug = course.slug || course._id || course.id
          const isComingSoon = course.isAvailable === false

          const CardWrapper = isComingSoon ? 'div' : Link
          const cardProps = isComingSoon
            ? { role: 'article' }
            : { to: `/courses/${courseSlug}`, state: { course } }

          return (
            <CardWrapper
              key={course._id || course.id || course.slug || `demo-${index}`}
              className={`course-card ${isComingSoon ? 'course-card-unavailable' : ''}`}
              aria-label={`View details for ${course.title}`}
              {...cardProps}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="course-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const placeholder = e.target.parentElement.querySelector('.course-card-placeholder')
                    if (placeholder) placeholder.style.display = 'flex'
                  }}
                />
              ) : null}

              <div
                className={`course-card-placeholder ${!imageUrl ? 'is-empty' : ''}`}
                style={{
                  display: imageUrl ? 'none' : 'flex',
                  height: '352px',
                }}
              >
                <span className="course-card-placeholder-text">No Image</span>
                <span className="course-card-placeholder-overlay" aria-hidden="true">
                  Coming Soon
                </span>
              </div>

              <div className="course-card-body">
                <h4 className="course-card-title">{course.title}</h4>

                {isComingSoon ? (
                  <div
                    className="course-card-availability-badge"
                    style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                  >
                    Coming Soon
                  </div>
                ) : (
                  <div
                    className="course-card-availability-badge"
                    style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                  >
                    Available Now
                  </div>
                )}
              </div>

              <div className="course-card-overlay">
                <p className="course-card-desc">
                  {course.cardBody || 'Professional, accredited medical course.'}
                </p>

                <span className="course-card-cta">
                  {isComingSoon ? 'Coming Soon' : 'Available Now →'}
                </span>
              </div>
            </CardWrapper>
          )
        })}
      </div>
    </div>
  )
}

export default CoursesCardsGrid
