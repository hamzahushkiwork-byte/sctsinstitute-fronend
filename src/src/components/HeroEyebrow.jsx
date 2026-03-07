import { motion } from 'framer-motion'
import '../styles/hero-eyebrow.css'

const HeroEyebrow = ({ text = 'sctsinstitute' }) => {
  return (
    <motion.p
      className="hero-eyebrow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {text}
    </motion.p>
  )
}

export default HeroEyebrow


