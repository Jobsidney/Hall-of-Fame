import { forwardRef } from 'react'
import heroBg from '../../../assets/Hall of Zero Limits - 1_22_2026 11-18-11 AM/HDRI_Entrance_02_opti.jpg'
import marvelLogo from '../../../assets/Hall of Zero Limits - 1_22_2026 11-18-11 AM/marvel-theater.png'

export const HeroSection = forwardRef<HTMLDivElement>(function HeroSection(_, ref) {
  return (
    <section ref={ref} className="cinematic__hero cinematic__hero--entrance">
      <div className="cinematic__hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="cinematic__hero-overlay" aria-hidden="true" />
      <button className="cinematic__access-button" type="button">
        Accessible version
      </button>

      <div className="cinematic__hero-content">
        <div className="cinematic__hero-logos" data-hero>
          <span className="cinematic__logo-badge">Sprite Zero Sugar</span>
          <span className="cinematic__logo-sep" aria-hidden="true">
            x
          </span>
          <img className="cinematic__logo-marvel" src={marvelLogo} alt="Wakanda Forever only in theaters" />
        </div>

        <div className="cinematic__hero-title" data-hero>
          <span className="cinematic__hero-kicker">The Hall of</span>
          <h1 className="cinematic__hero-heading">Zero Limits</h1>
        </div>

        <p className="cinematic__hero-subtitle" data-hero>
          Explore new paths.
          <span>Find your gift.</span>
        </p>

        <button className="cinematic__enter-button" type="button" data-hero>
          Enter
        </button>
      </div>

      <div className="cinematic__hero-footer">
        <img className="cinematic__hero-footer-logo" src={marvelLogo} alt="Wakanda Forever logo" />
        <span className="cinematic__hero-footer-text">Sprite Zero Sugar | © Marvel</span>
      </div>
    </section>
  )
})

