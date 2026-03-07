import '../styles/heart-section.css'
import newSectionImage from '../assets/new-section.jpeg'

const HeartSection = () => {
  return (
    <section className="heart-section">
      <div className="heart-section-inner">
        <div className="heart-section-content">
          <p className="heart-section-brand">
            <span className="heart-section-brand-red">HeartCode</span>
            <span className="heart-section-brand-gray">® Complete</span>
          </p>
          <h2 className="heart-section-title">
            Take the Next Step in Digital Resuscitation Training Across Your Organization.
          </h2>
          <p className="heart-section-desc">
            Cognitive online learning plus hands-on skills at a simulation station.
          </p>
          <p className="heart-section-tagline">Any Time Any Where</p>
        </div>
        <div className="heart-section-image-wrap">
          <img
            src={newSectionImage}
            alt="Digital resuscitation training with simulation station"
            className="heart-section-image"
          />
        </div>
      </div>
    </section>
  )
}

export default HeartSection
