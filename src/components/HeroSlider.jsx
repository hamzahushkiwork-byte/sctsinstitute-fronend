/**
 * HeroSlider Component
 * 
 * Supports both image and video background slides.
 * Fetches slides from API with fallback to static data.
 */

import { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fetchHeroSlides } from '../api/endpoints'
import { toAbsoluteMediaUrl } from '../utils/mediaUrl'
import logo from '../assets/logo-su.jpeg'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import '../styles/hero-slider.css'
import '../styles/page-loader.css'

// Fallback static slides
const fallbackSlides = [
  {
    id: 2,
    type: 'video',
    backgroundVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    label: 'Hands-on Clinical Experience',
    title: 'Medical training!',
    subtitle: 'Interactive workshops led by certified medical instructors.',
    primaryButton: {
      text: 'View Courses →',
      link: '/courses'
    },
    secondaryButton: {
      text: 'Contact our team',
      link: '/contact'
    }
  },
  {
    id: 1,
    type: 'image',
    backgroundImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1920&q=80',
    label: 'Creative solutions for Medical Professionals',
    title: 'We provide unique training courses',
    subtitle: 'Empowering healthcare experts with immersive learning experiences.',
    primaryButton: {
      text: 'Discover SAUDI-CANADIAN TRAINING & SIMULATION CENTER Services →',
      link: '/services'
    },
    secondaryButton: {
      text: 'Get started training',
      link: '/courses-programs'
    }
  },
  {
    id: 3,
    type: 'image',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
    label: 'Trusted by Medical Centers',
    title: 'Accredited training programs',
    subtitle: 'High-quality clinical education tailored to your specialty.',
    primaryButton: {
      text: 'Explore Certifications →',
      link: '/certification'
    },
    secondaryButton: {
      text: 'About SAUDI-CANADIAN TRAINING & SIMULATION CENTER',
      link: '/about'
    }
  }
]

const textVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

function HeroSlider() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [slides, setSlides] = useState(fallbackSlides)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const videoRefs = useRef([])

  // Fetch slides from API on mount
  useEffect(() => {
    async function loadSlides() {
      try {
        setLoading(true)
        const apiSlides = await fetchHeroSlides()

        if (apiSlides && apiSlides.length > 0) {
          // Transform API slides to match component format
          const transformedSlides = apiSlides
            .map((slide, index) => {
              // Resolve media URL based on type
              const sourceMediaUrl = slide.mediaUrl || '';
              const resolvedMediaUrl = sourceMediaUrl ? toAbsoluteMediaUrl(sourceMediaUrl) : '';

              return {
                id: slide._id || slide.id || index,
                type: slide.type || 'image',
                label: slide.label || '',
                title: slide.title || '',
                subtitle: slide.subtitle || '',
                mediaUrl: sourceMediaUrl, // Keep original for reference
                buttonText: slide.buttonText || '',
                buttonLink: slide.buttonLink || '',
                order: slide.order || 0,
                // Map to component format - only set if mediaUrl exists
                backgroundImage: slide.type === 'image' && resolvedMediaUrl ? resolvedMediaUrl : null,
                backgroundVideo: slide.type === 'video' && resolvedMediaUrl ? resolvedMediaUrl : null,
                primaryButton: slide.buttonText && slide.buttonLink ? {
                  text: slide.buttonText,
                  link: slide.buttonLink
                } : null,
                secondaryButton: slide.secondaryButtonText && slide.secondaryButtonLink ? {
                  text: slide.secondaryButtonText,
                  link: slide.secondaryButtonLink
                } : null,
              };
            })
            .filter(slide => slide.title) // Filter out slides without title (keep even if no media for debugging)
            .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order

          if (transformedSlides.length > 0) {
            setSlides(transformedSlides)
          }
        }
        setError(null)
      } catch (err) {
        console.error('Failed to load hero slides from API, using fallback:', err)
        setError(err.message)
        // Keep fallback slides
      } finally {
        setLoading(false)
      }
    }

    loadSlides()
  }, [])

  const handleButtonClick = (link) => {
    navigate(link)
  }

  // Handle video play/pause based on active slide
  useEffect(() => {
    // Use a flag to track if component is mounted
    let isMounted = true

    videoRefs.current.forEach((video, index) => {
      if (video && isMounted) {
        // Check if video is still in the DOM
        if (!document.contains(video)) {
          return
        }

        if (index === activeIndex) {
          // Ensure video is muted for autoplay
          video.muted = true
          // Make sure video is visible
          video.style.opacity = '1'
          video.style.visibility = 'visible'
          video.style.pointerEvents = 'auto'
          // Try to play the video
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => { })
              .catch((error) => {
                // Only log if it's not an AbortError (component unmounting)
                if (isMounted && error.name !== 'AbortError') {
                  console.error(`[HeroSlider] Video ${index} autoplay prevented:`, error)
                }
              })
          }
        } else {
          // Pause and hide inactive videos
          video.pause()
          video.currentTime = 0
          video.style.opacity = '0'
          video.style.visibility = 'hidden'
          video.style.pointerEvents = 'none'
        }
      }
    })

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [activeIndex, slides])

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  // Show loading placeholder only if no fallback slides available
  if (loading && slides.length === 0) {
    return (
      <section className="hero-slider" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <div className="loader-container">
          <div className="loader-logo-wrapper" style={{ width: '80px', height: '80px' }}>
            <div className="loader-circle"></div>
            <img src={logo} alt="Loading" className="loader-logo" />
          </div>
          <div className="loader-progress-bar" style={{ width: '120px' }}>
            <div className="loader-progress-fill"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true
        }}
        loop={slides.length > 1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-slider-swiper"
      >
        {slides.map((slide, index) => {
          // Determine if this slide has video or image
          const isVideo = slide.type === 'video';

          // Resolve media URL - use relative URLs (proxy handles CORS)
          // Use slide.mediaUrl directly, or fallback to pre-processed backgroundImage/backgroundVideo
          let mediaUrl = '';
          if (slide.mediaUrl) {
            // Use relative URL (will go through Vite proxy in dev)
            mediaUrl = toAbsoluteMediaUrl(slide.mediaUrl);
          } else if (isVideo && slide.backgroundVideo) {
            mediaUrl = slide.backgroundVideo;
          } else if (!isVideo && slide.backgroundImage) {
            mediaUrl = slide.backgroundImage;
          }

          // Determine if this slide is currently active
          const isActive = index === activeIndex;

          return (
            <SwiperSlide key={slide.id || index} className="hero-slide">
              <div className="slide-background-container">
                {/* Conditional rendering: Image or Video background */}
                {/* Only render media if slide has mediaUrl */}
                {isVideo && mediaUrl ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el
                    }}
                    className="slide-background slide-bg-video hero-slide-video"
                    src={mediaUrl}
                    crossOrigin="anonymous"
                    autoPlay={isActive}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls={false}
                    style={{
                      opacity: isActive ? 1 : 0,
                      visibility: isActive ? 'visible' : 'hidden',
                      pointerEvents: isActive ? 'auto' : 'none',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    onLoadedMetadata={() => {
                      // Let useEffect handle play to avoid conflicts
                    }}
                    onCanPlay={(e) => {
                      // Only play if this is the active slide and element is still mounted
                      if (index === activeIndex && document.contains(e.target)) {
                        const playPromise = e.target.play()
                        if (playPromise !== undefined) {
                          playPromise.catch(() => {
                            // Ignore AbortError (component unmounting)
                          })
                        }
                      }
                    }}
                    onError={() => { }}
                  />
                ) : (
                  mediaUrl ? (
                    <img
                      key={`img-${slide.id || index}-${mediaUrl}`}
                      className="slide-background slide-bg-image"
                      src={mediaUrl}
                      alt={slide.title || 'Hero slide'}
                      crossOrigin="anonymous"
                      style={{
                        opacity: isActive ? 1 : 0,
                        visibility: isActive ? 'visible' : 'hidden',
                        pointerEvents: isActive ? 'auto' : 'none'
                      }}
                      onError={(e) => {
                        e.target.classList.add('image-error');
                      }}
                      onLoad={() => { }}
                    />
                  ) : (
                    <div className="slide-background slide-bg-image" style={{ backgroundColor: '#1a1a2e' }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        No image
                      </div>
                    </div>
                  )
                )}

                {/* Overlay */}
                <div className="slide-overlay"></div>

                {/* Content */}
                <div className="slide-content">
                  {activeIndex === index && (
                    <motion.div
                      key={`slide-content-${index}-${activeIndex}`}
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                      className="slide-text-container"
                    >
                      {slide.label && (
                        <motion.p
                          variants={textVariants}
                          className="slide-label"
                        >
                          {slide.label}
                        </motion.p>
                      )}
                      <motion.h1
                        variants={textVariants}
                        className="slide-title"
                      >
                        {slide.title}
                      </motion.h1>
                      {slide.subtitle && (
                        <motion.p
                          variants={textVariants}
                          className="slide-subtitle"
                        >
                          {slide.subtitle}
                        </motion.p>
                      )}
                      {(slide.primaryButton || slide.buttonText) && (
                        <motion.div
                          variants={textVariants}
                          className="slide-buttons"
                        >
                          {slide.primaryButton && (
                            <button
                              className="btn-primary"
                              onClick={() => handleButtonClick(slide.primaryButton.link)}
                            >
                              {slide.primaryButton.text}
                            </button>
                          )}
                          {slide.secondaryButton && (
                            <button
                              className="btn-secondary"
                              onClick={() => handleButtonClick(slide.secondaryButton.link)}
                            >
                              {slide.secondaryButton.text}
                            </button>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}

export default HeroSlider
