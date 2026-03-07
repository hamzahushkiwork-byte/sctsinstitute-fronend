import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import contactHero from '../assets/contact-hero.jpg'
import '../styles/contact.css'
import { submitContactMessage } from '../api/contact.api.js'

function Contact() {
  const [selectedBranch, setSelectedBranch] = useState('khobar')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error'

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const branches = [
    {
      id: 'khobar',
      name: 'Khobar',
      address: 'Khobar, Saudi Arabia',
      phone: '+966 55 724 5777',
      email: 'info@sctsinstitute.com',
      iframeUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3650216.4622765905!2d52.927687237754704!3d25.60034707077035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDE1JzAyLjYiTiA1MMKwMTInNTUuMSJF!5e1!3m2!1sar!2sjo!4v1769634899774!5m2!1sar!2sjo',
    },
  ]

  const selectedBranchData = branches.find((b) => b.id === selectedBranch) || branches[0]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await submitContactMessage(formData)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        message: '',
      })
      setErrors({})
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with us. We're here to help."
        backgroundImage={contactHero}
        breadcrumbs={[{ label: 'Contact', path: '/contact' }]}
      />
      <section className="contact-section">
        <div className="contact-container">
          {submitStatus === 'success' && (
            <div className="contact-status-message success">
              Thank you for your message! We will get back to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="contact-status-message error">
              Failed to send message. Please try again later.
            </div>
          )}

          <div className="contact-main-grid">
            <div className="contact-map-section">
              <div className="branch-tabs">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    className={`branch-tab ${selectedBranch === branch.id ? 'active' : ''}`}
                    onClick={() => setSelectedBranch(branch.id)}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
              <div className="map-container">
                <iframe
                  title={`Map for ${selectedBranchData.name}`}
                  src={selectedBranchData.iframeUrl}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="contact-form-section">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message..."
                    rows={5}
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send now'}
                </button>
              </form>
            </div>
          </div>

          <div className="contact-info-row">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C8.95 21 0 12.05 0 1C0 0.45 0.45 0 1 0H4.5C5.05 0 5.5 0.45 5.5 1C5.5 2.25 5.7 3.45 6.07 4.57C6.18 4.92 6.1 5.31 5.82 5.59L3.62 7.79H6.62Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-label">Call</div>
              <div className="contact-info-value">
                <a href={`tel:${selectedBranchData.phone}`}>{selectedBranchData.phone}</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">
                <a href={`mailto:${selectedBranchData.email}`}>{selectedBranchData.email}</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-label">Location</div>
              <div className="contact-info-value">{selectedBranchData.address}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
