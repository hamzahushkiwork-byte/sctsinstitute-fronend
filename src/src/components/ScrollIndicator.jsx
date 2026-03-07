import { useState, useEffect } from 'react'
import '../styles/scroll-indicator.css'

function ScrollIndicator() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const newProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
        setProgress(newProgress)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div className="scroll-indicator">
      <span className="scroll-indicator-text">SCROLL</span>
      <div className="scroll-indicator-line">
        <div
          className="scroll-indicator-line-fill"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}

export default ScrollIndicator


