import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { getCourseBySlug } from '../api/courses.api.js'
import { normalizeCourse } from '../utils/apiDefaults.js'
import { registerForCourse, getUserCourseRegistration } from '../api/courseRegistration.api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js'
import PageHero from '../components/PageHero'
import PageLoader from '../components/PageLoader'
import PaymentComingSoonModal from '../components/modals/PaymentComingSoonModal'
import aprilImage from '../assets/APRIL.jpeg'
import marchImage from '../assets/MARCH.jpeg'
import '../styles/course-details.css'

function CourseDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const [activePayment, setActivePayment] = useState('visit')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState('')
  const [registration, setRegistration] = useState(null)
  const [checkingRegistration, setCheckingRegistration] = useState(false)
  const [scheduleLightbox, setScheduleLightbox] = useState(null) // 'april' | 'march' | null

  const checkRegistrationStatus = useCallback(async (courseId) => {
    if (!isAuthenticated || !courseId) {
      setRegistration(null)
      setCheckingRegistration(false)
      return
    }

    // Set a timeout to ensure checkingRegistration always resets
    const timeoutId = setTimeout(() => {
      setCheckingRegistration(false)
    }, 10000) // 10 second timeout

    try {
      setCheckingRegistration(true)
      const reg = await getUserCourseRegistration(courseId)
      clearTimeout(timeoutId)
      // Set registration (null means not registered, object means registered)
      setRegistration(reg || null)
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Failed to check registration status:', err)
      // On any error, assume not registered
      setRegistration(null)
    } finally {
      // Always set checking to false
      setCheckingRegistration(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [slug])

  useEffect(() => {
    async function loadCourse() {
      if (!slug) {
        navigate('/courses')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getCourseBySlug(slug)
        setCourse(data)

        // Check registration status if user is authenticated
        if (isAuthenticated && data?._id) {
          checkRegistrationStatus(data._id)
        }
      } catch (err) {
        console.error('Failed to load course:', err)
        // Fix: fallback to safe defaults if API fails or returns missing data.
        const fallback = normalizeCourse(location.state?.course || null)
        setCourse(fallback)
        // When we have a fallback, avoid blocking render with error UI.
        setError(fallback ? null : (err.response?.status === 404 ? 'Course not found' : 'Failed to load course'))
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [slug, navigate, isAuthenticated, checkRegistrationStatus, location.state])

  // Refresh registration status when user authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setRegistration(null)
      setCheckingRegistration(false)
      return
    }

    if (course?._id && !checkingRegistration) {
      checkRegistrationStatus(course._id)
    }
  }, [isAuthenticated, course?._id, checkRegistrationStatus])

  const handlePaymentClick = (type) => {
    if (type === 'mastercard') {
      setIsPaymentModalOpen(true)
      return
    }
    setActivePayment(type)
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${slug}` } })
      return
    }

    if (!course?._id) {
      setRegistrationMessage('Course information is missing')
      return
    }

    setRegistering(true)
    setRegistrationMessage('')

    try {
      const newRegistration = await registerForCourse(course._id)
      // Ensure registration has status field and proper structure
      if (newRegistration) {
        if (!newRegistration.status) {
          newRegistration.status = 'pending'
        }
        setRegistration(newRegistration)
        setRegistrationMessage('Successfully registered for this course! Status: Pending')
      } else {
        // If registration failed but no error thrown, refresh status
        await checkRegistrationStatus(course._id)
        setRegistrationMessage('Registration completed. Checking status...')
      }
      // Clear message after 5 seconds
      setTimeout(() => setRegistrationMessage(''), 5000)
    } catch (err) {
      if (err.message.includes('already registered')) {
        // Refresh registration status
        await checkRegistrationStatus(course._id)
        setRegistrationMessage('You are already registered for this course')
        setTimeout(() => setRegistrationMessage(''), 5000)
      } else {
        setRegistrationMessage(err.message || 'Failed to register. Please try again.')
      }
    } finally {
      setRegistering(false)
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid ✓', color: '#10b981', bgColor: '#d1fae5', textColor: '#065f46' }
      case 'pending':
        return { text: 'Pending', color: '#f59e0b', bgColor: '#fef3c7', textColor: '#92400e' }
      case 'rejected':
        return { text: 'Rejected', color: '#ef4444', bgColor: '#fee2e2', textColor: '#991b1b' }
      default:
        return { text: 'Unknown', color: '#6b7280', bgColor: '#f3f4f6', textColor: '#374151' }
    }
  }

  if (loading) {
    return <PageLoader isVisible={true} />
  }

  if (error || !course) {
    return (
      <section className="course-detail-page" dir="rtl">
        <div className="course-detail-container">
          <h1 className="course-detail-title">Course not found</h1>
          <p className="course-detail-lead">
            {error || 'Course details not found. Please return to the course catalog.'}
          </p>
          <Link className="course-back-button" to="/courses">
            Back to Course Catalog
          </Link>
        </div>
      </section>
    )
  }

  const imageUrl = course.imageUrl ? toAbsoluteMediaUrl(course.imageUrl) : ''

  return (
    <section className="course-detail-page" dir="rtl">
      <PageHero
        title={course.title}
        subtitle={course.shortDescription || undefined}
        backgroundImage={imageUrl}
        breadcrumbs={[
          { label: 'Courses', path: '/courses' },
          { label: course.title, path: '#' }
        ]}
      />
      <div className="course-detail-container">
        <div className="course-detail-layout">
          <div className="course-detail-main">
        {/* Registration Status Section */}
        <div style={{ marginBottom: '24px' }}>
          {isAuthenticated ? (
            <>
              {checkingRegistration ? (
                <div style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                  Checking registration status...
                </div>
              ) : registration ? (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      backgroundColor: getStatusDisplay(registration.status || 'pending').bgColor,
                      color: getStatusDisplay(registration.status || 'pending').textColor,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    <span>Registration Status:</span>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: getStatusDisplay(registration.status || 'pending').color,
                        color: '#ffffff',
                        fontSize: '14px',
                      }}
                    >
                      {getStatusDisplay(registration.status || 'pending').text}
                    </span>
                  </div>
                  {registration.notes && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '6px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '13px',
                      }}
                    >
                      <strong>Note:</strong> {registration.notes}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: '#667eea',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: registering ? 'not-allowed' : 'pointer',
                    opacity: registering ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {registering ? 'Registering...' : 'Register for Course'}
                </button>
              )}
              {registrationMessage && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: registration ? '#d1fae5' : '#fee2e2',
                    color: registration ? '#065f46' : '#991b1b',
                    fontSize: '14px',
                  }}
                >
                  {registrationMessage}
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: `/courses/${slug}` } })}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Login to Register
            </button>
          )}
        </div>

        {course.description && (
          <div className="course-detail-content">
            <div
              className="course-detail-paragraph"
              style={{ whiteSpace: 'pre-line' }}
            >
              {course.description}
            </div>
          </div>
        )}

        <div className="course-payments">
          <h2 className="course-detail-heading">Payment Methods</h2>
          <div className="course-payment-grid">
            <button
              type="button"
              className="payment-card"
              onClick={() => handlePaymentClick('mastercard')}
              aria-label="Pay with MasterCard"
            >
              <span className="payment-icon" aria-hidden="true">
                MC
              </span>
              <span className="payment-title">MasterCard</span>
              <span className="payment-subtitle">Go to the payment page</span>
            </button>
            <button
              type="button"
              className={`payment-card ${activePayment === 'visit' ? 'is-active' : ''
                }`}
              onClick={() => handlePaymentClick('visit')}
              aria-label="Pay by visiting the center"
              aria-pressed={activePayment === 'visit'}
            >
              <span className="payment-icon" aria-hidden="true">
                VC
              </span>
              <span className="payment-title">Pay by visiting the center</span>
              <span className="payment-subtitle">Address and contact details</span>
            </button>
            <button
              type="button"
              className={`payment-card ${activePayment === 'bank' ? 'is-active' : ''
                }`}
              onClick={() => handlePaymentClick('bank')}
              aria-label="Bank transfer"
              aria-pressed={activePayment === 'bank'}
            >
              <span className="payment-icon" aria-hidden="true">
                BT
              </span>
              <span className="payment-title">Bank transfer</span>
              <span className="payment-subtitle">Bank account details</span>
            </button>
          </div>

          {activePayment === 'visit' && (
            <div className="payment-details" role="status">
              <h3>Visit the center</h3>
              <p>King Fahad Ibn Abdulaziz Road</p>
              <p>Alkhobar</p>
              <p>Postal code: 34627</p>
              <p>Building no: 7722</p>
              <p>Phone: +966 55 724 5777</p>
            </div>
          )}

          {activePayment === 'bank' && (
            <div className="payment-details" role="status">
              <h3>Bank transfer</h3>
              <p>Bank name: Bank AlJazira</p>
              <p>Account number: 021282149993001</p>
              <p>IBAN: SA8760100021282149993001</p>
              <p>Account currency: SAR</p>
            </div>
          )}
        </div>
          </div>

          {/* Right Sidebar - March & April */}
          <aside className="course-detail-sidebar">
            <div className="course-sidebar-card">
              <h3 className="course-sidebar-title">Schedule</h3>
              <div className="course-sidebar-months">
                <div className="course-sidebar-month">
                  <span className="course-sidebar-month-label">APRIL</span>
                  <button
                    type="button"
                    className="course-sidebar-img-wrap"
                    onClick={() => setScheduleLightbox('april')}
                    aria-label="View April schedule full size"
                  >
                    <img src={aprilImage} alt="Course schedule April" className="course-sidebar-month-img" />
                  </button>
                </div>
                <div className="course-sidebar-month">
                  <span className="course-sidebar-month-label">MARCH</span>
                  <button
                    type="button"
                    className="course-sidebar-img-wrap"
                    onClick={() => setScheduleLightbox('march')}
                    aria-label="View March schedule full size"
                  >
                    <img src={marchImage} alt="Course schedule March" className="course-sidebar-month-img" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Schedule image lightbox */}
      {scheduleLightbox && (
        <div
          className="course-schedule-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule image full size"
          onClick={() => setScheduleLightbox(null)}
        >
          <button
            type="button"
            className="course-schedule-lightbox-close"
            onClick={(e) => { e.stopPropagation(); setScheduleLightbox(null); }}
            aria-label="Close"
          >
            ×
          </button>
          <div className="course-schedule-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={scheduleLightbox === 'april' ? aprilImage : marchImage}
              alt={scheduleLightbox === 'april' ? 'Course schedule April' : 'Course schedule March'}
              className="course-schedule-lightbox-img"
            />
          </div>
        </div>
      )}

      <PaymentComingSoonModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        courseName={course.slug}
      />
    </section>
  )
}

export default CourseDetails
