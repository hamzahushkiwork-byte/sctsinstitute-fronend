import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/payment-modal.css'

function PaymentComingSoonModal({ open, onClose, courseName }) {
  // Handle ESC key press
  useEffect(() => {
    if (!open) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        // Close when clicking on backdrop (not the card)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Test Payment Page</h2>
        <p className="modal-subtitle">Selected course: {courseName}</p>
        <p className="modal-text">
          The payment gateway will be added here later. You can contact us to
          complete the payment or return to the course catalog.
        </p>
        <Link to="/courses" className="modal-btn" onClick={onClose}>
          Back to Course Catalog
        </Link>
      </div>
    </div>
  )
}

export default PaymentComingSoonModal
