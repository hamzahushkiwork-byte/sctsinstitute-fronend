import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/welcome-section.css'

function WelcomeSection() {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('/about')
  }

  // Placeholder images - replace with actual images from assets or public folder
  const imgDoctor1 = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80'
  const imgDoctor2 = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'

  return (
    <section className="welcome-section">
      <div className="welcome-section-inner">
        {/* Left Column - Images */}
        <motion.div
          className="welcome-media"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="welcome-media-gradient" />
          <div className="welcome-card welcome-card-large">
            <img src={imgDoctor1} alt="Medical Professional" />
          </div>
          <div className="welcome-card welcome-card-small">
            <img src={imgDoctor2} alt="Medical Training" />
          </div>
        </motion.div>

        {/* Right Column - Content */}
        <motion.div
          className="welcome-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <motion.h2
            className="welcome-content-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Welcome to Saudi-Canadian Training & Simulation Center — Where Excellence In Medical Training Begins.
          </motion.h2>
          <motion.p
            className="welcome-content-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            As a premier hub for advanced healthcare education and professional development, we combine innovation, expertise, and real-world simulation to shape confident, competent professionals. Our passion for excellence fuels everything we do, empowering healthcare providers and individuals with world-class training that elevates careers and transforms patient care.
          </motion.p>
          <motion.p
            className="welcome-content-text welcome-content-tagline"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            Train smarter. Lead stronger. Deliver exceptional care.
          </motion.p>
          <motion.button
            className="welcome-content-button"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            onClick={handleButtonClick}
          >
            About Saudi-Canadian Training & Simulation Center
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default WelcomeSection

