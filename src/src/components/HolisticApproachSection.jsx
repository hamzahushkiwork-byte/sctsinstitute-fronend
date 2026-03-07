import { motion } from 'framer-motion'
import '../styles/holistic-approach.css'

// TODO: Replace placeholder with actual image when home-holistic-bg.jpg is added to assets
// import heroBg from '../assets/home-holistic-bg.jpg'
const heroBg = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80'

const HolisticApproachSection = () => {
  return (
    <motion.section
      className="holistic-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div
        className="holistic-bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="holistic-overlay" />

      <div className="holistic-inner">
        {/* LEFT CONTENT */}
        <motion.div
          className="holistic-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <p className="holistic-eyebrow">Holistic Approach to Learning</p>

          <h2 className="holistic-title">
            We here for provide high quality{' '}
            <span>healthcare professional training.</span>
          </h2>

          <p className="holistic-text">
            At sctsinstitute, we take a holistic approach to medical education,
            recognizing that effective learning goes beyond the acquisition of
            knowledge.
          </p>

          <button className="holistic-cta">
            Read More <span className="holistic-cta-arrow">→</span>
          </button>
        </motion.div>

        {/* RIGHT FLOATING CARD */}
        <motion.div
          className="holistic-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="holistic-card">
            <p>
              Over the years, sctsinstitute has achieved numerous milestones and
              accolades, reflecting our dedication to excellence and the impact
              of our training programs on the healthcare community.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default HolisticApproachSection


