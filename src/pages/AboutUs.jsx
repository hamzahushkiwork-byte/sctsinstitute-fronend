import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import aboutHero from '../assets/about-hero.jpg'
// TODO: Replace placeholder with actual image when about-holistic.jpg is added to assets
// import holisticImage from '../assets/about-holistic.jpg'
// TODO: Replace placeholder with actual image when about-achievements.jpg is added to assets
// import achievementsImage from '../assets/about-achievements.jpg'
import newSectionImage from '../assets/new-section.jpeg'
import '../styles/about.css'

// Placeholder image URLs - replace with actual imports when images are added
const holisticImage = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80'

function AboutUs() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <div className="about-page">
      {/* Hero Section */}
      <PageHero
        title="Who we are"
        subtitle="Learn more about our mission, values, and commitment to excellence"
        backgroundImage={aboutHero}
        breadcrumbs={[
          { label: 'About Us', path: '/about' }
        ]}
      />

      {/* Main Content Section */}
      <main id="about-content" className="about-content">
        <div className="about-content-inner">
          <div className="about-content-grid">
            {/* Left Column - Image */}
            <motion.div
              className="about-image-column"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="about-image-card">
                <img
                  src="/ABOUT-SEC.jpeg"
                  alt="Medical Professional"
                  className="about-doctor-image"
                />
                {/* Floating Card */}
                <div className="about-floating-card">
                  <p className="about-floating-card-text">
                    We provide quality training to our trainee.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Text Content */}
            <motion.div
              className="about-text-column"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <h2 className="about-content-heading">
                Welcome to Saudi-Canadian Training & Simulation Center 
              </h2>
              <p className="about-content-paragraph">
              your premier destination for comprehensive medical training and professional development. Driven by excellence and innovation, we are dedicated to equipping healthcare professionals and individuals with the highest standards of education and hands-on training. Our programs are designed to help you advance your career, sharpen your expertise, and deliver outstanding patient care with confidence.
              </p>
              <p className="about-content-paragraph about-content-tagline">
                Train smarter. Lead stronger. Deliver exceptional care.
              </p>
              <p className="about-content-paragraph">
                For years, we have remained committed to raising the bar in medical education — empowering professionals to grow, lead, and make a meaningful impact in healthcare.
              </p>

              <h3 className="about-content-subheading">Our Mission</h3>
              <p className="about-content-paragraph">
                Our mission is to empower healthcare professionals through world-class training and education that elevates clinical expertise, enhances patient outcomes, and accelerates career growth.
              </p>
              <p className="about-content-paragraph">
                We aspire to be the region's leading provider of medical education and professional development — championing innovation, inspiring continuous learning, and cultivating a culture of excellence that shapes the future of healthcare.
              </p>
            </motion.div>
          </div>

          {/* Our Values Section */}
          <motion.section
            className="about-values-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="about-values-title">Our Values</h2>
            <div className="about-values-grid">
              <motion.div
                className="about-value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              >
                <h3 className="about-value-card-title">Excellence</h3>
                <p className="about-value-card-text">
                  We are committed to delivering the highest standards of quality in all our training programs and services, ensuring that every healthcare professional receives exceptional education and support.
                </p>
              </motion.div>

              <motion.div
                className="about-value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              >
                <h3 className="about-value-card-title">Integrity</h3>
                <p className="about-value-card-text">
                  We conduct our operations with honesty, transparency, and ethical principles, building trust with our partners, trainees, and the healthcare community.
                </p>
              </motion.div>

              <motion.div
                className="about-value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              >
                <h3 className="about-value-card-title">Innovation</h3>
                <p className="about-value-card-text">
                  We embrace cutting-edge technologies and methodologies to continuously improve our training programs and stay at the forefront of medical education.
                </p>
              </motion.div>

              <motion.div
                className="about-value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              >
                <h3 className="about-value-card-title">Collaboration</h3>
                <p className="about-value-card-text">
                  We believe in the power of working together with healthcare institutions, professionals, and partners to create a stronger, more connected medical community.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Our Holistic Approach Section */}
          <motion.section
            className="about-holistic-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="about-holistic-grid">
              <motion.div
                className="about-holistic-image-column"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <img
                  src={holisticImage}
                  alt="Holistic Learning Approach"
                  className="about-holistic-image"
                />
              </motion.div>

              <motion.div
                className="about-holistic-content-column"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <h2 className="about-holistic-title">Our Holistic Approach to Learning</h2>
                <p className="about-holistic-text">
                  At Saudi-Canadian Training & Simulation Center, we believe in a comprehensive approach to medical education that goes beyond traditional training methods. Our holistic learning model integrates theoretical knowledge with practical application, fostering critical thinking, clinical reasoning, and compassionate patient care.
                </p>
                <p className="about-holistic-text">
                  We combine interactive workshops, hands-on simulations, real-world case studies, and continuous assessment to ensure that every healthcare professional develops the skills, confidence, and expertise needed to excel in their field and make a meaningful impact on patient outcomes.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Our Achievements Section */}
          <motion.section
            className="about-achievements-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="about-achievements-grid">
              <motion.div
                className="about-achievements-image-column"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="about-achievements-image-card">
                  <img
                    src={newSectionImage}
                    alt="Our Achievements"
                    className="about-achievements-image"
                  />
                </div>
              </motion.div>

              <motion.div
                className="about-achievements-content-column"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <p className="about-achievements-label">Our Achievements</p>
                <h2 className="about-achievements-title">Celebrating Our Milestones</h2>
                <p className="about-achievements-text">
                  Over the years, SAUDI-CANADIAN TRAINING & SIMULATION CENTER has achieved significant milestones in medical education and training. We have successfully trained thousands of healthcare professionals, partnered with leading medical institutions, and continuously expanded our course offerings to meet the evolving needs of the healthcare industry.
                </p>
                <p className="about-achievements-text">
                  Our commitment to excellence has been recognized through various accreditations and certifications, and we take pride in the success stories of our graduates who are making a positive impact in healthcare settings across the region. These achievements reflect our dedication to providing world-class medical education and professional development.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

export default AboutUs
