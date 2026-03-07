import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/training-programs.css'

// TODO: Replace placeholder with actual image when home-training-main.jpg is added to assets
// import trainingImage from '../assets/home-training-main.jpg'
const trainingImage = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80'

const SLIDES = [
  {
    id: 1,
    label: 'CONTINUING EDUCATION',
    title: 'Opportunity to stay current with advances in medical practice and maintain licensure',
    description:
      'Our continuing education programs offer healthcare professionals the opportunity to stay current with advances in medical practice and maintain licensure.',
    ctaLabel: 'Read More',
  },
  {
    id: 2,
    label: 'WORKSHOPS & SIMULATIONS',
    title: 'Hands-on training for real-world clinical scenarios',
    description:
      'Our interactive workshops and simulations help learners apply theoretical knowledge to realistic clinical situations, building confidence and critical thinking skills.',
    ctaLabel: 'Read More',
  },
  {
    id: 3,
    label: 'CERTIFICATION COURSES',
    title: 'Structured pathways to recognized medical certifications',
    description:
      'We offer structured programs that guide healthcare professionals toward nationally and internationally recognized certifications.',
    ctaLabel: 'Read More',
  },
]

const TrainingProgramsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1))
  }

  const currentSlide = SLIDES[currentIndex]

  return (
    <motion.section
      className="training-programs-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="training-programs-container">
        <motion.h2
          className="training-programs-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Training Programs &amp; Solutions
        </motion.h2>

        <motion.div
          className="training-programs-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {/* LEFT IMAGE CARD */}
          <motion.div
            className="training-programs-image-wrapper"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="training-programs-image-card">
              <img
                src={trainingImage}
                alt="Training Programs"
                className="training-programs-image"
              />

              <div className="training-programs-badge">
                <div className="badge-icon">👍</div>
                <div className="badge-text">
                  <p className="badge-title">We provide quality training to our trainee.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SLIDER CONTENT */}
          <motion.div
            className="training-programs-content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <p className="training-programs-label">{currentSlide.label}</p>
                <h3 className="training-programs-heading">{currentSlide.title}</h3>
                <p className="training-programs-description">
                  {currentSlide.description}
                </p>

                <button className="training-programs-cta">
                  {currentSlide.ctaLabel} <span className="cta-arrow">→</span>
                </button>
              </motion.div>
            </AnimatePresence>

            {/* SLIDER CONTROLS */}
            <div className="training-programs-controls">
              <button
                type="button"
                className="training-programs-control training-programs-control--prev"
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                className="training-programs-control training-programs-control--next"
                onClick={handleNext}
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default TrainingProgramsSection

