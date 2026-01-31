import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkipLink } from '../../components/shared/SkipLink'
import { EntranceScreen } from './components/EntranceScreen'
import { HallScreen } from './components/HallScreen'
import { Loader } from './components/Loader'
import { WebGLScene, type SceneType, type HallView } from './components/WebGLScene'
import './cinematic.css'

gsap.registerPlugin(ScrollTrigger)

const CONTENT_ID = 'cinematic-content'

export function CinematicExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const entranceRef = useRef<HTMLDivElement | null>(null)
  const hallRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const loaderProgressRef = useRef<HTMLDivElement | null>(null)
  const loaderProgressTextRef = useRef<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentScene, setCurrentScene] = useState<SceneType>('entrance')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [moveToView, setMoveToView] = useState<((view: HallView) => void) | null>(null)

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useLayoutEffect(() => {
    if (!isLoading) {
      return
    }
    if (prefersReducedMotion) {
      setIsLoading(false)
      return
    }
    const ctx = gsap.context(() => {
      const progress = loaderProgressRef.current
      const progressText = loaderProgressTextRef.current
      const loader = loaderRef.current
      if (!progress || !progressText || !loader) {
        return
      }
      const timeline = gsap.timeline({
        onUpdate: () => {
          const value = Math.round(timeline.progress() * 100)
          progressText.textContent = `${value}%`
        },
        onComplete: () => {
          setIsLoading(false)
        },
      })

      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      timeline
        .to(progress, { scaleX: 1, duration: 2.2, ease: 'power2.out' })
        .to(loader, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '+=0.2')
    }, loaderRef)

    return () => ctx.revert()
  }, [isLoading, prefersReducedMotion])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useLayoutEffect(() => {
    if (prefersReducedMotion || isLoading) {
      return
    }
    const ctx = gsap.context(() => {
      const entrance = entranceRef.current
      if (entrance && currentScene === 'entrance') {
        const entranceItems = entrance.querySelectorAll<HTMLElement>('[data-entrance]')
        gsap.fromTo(
          entranceItems,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.1,
          },
        )
      }
    }, rootRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, isLoading, currentScene])

  const handleEnter = useCallback(() => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    
    gsap.to(entranceRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.in',
    })
  }, [isTransitioning])

  const handleTransitionComplete = useCallback(() => {
    setCurrentScene('hall')
    
    requestAnimationFrame(() => {
      if (hallRef.current) {
        gsap.fromTo(
          hallRef.current,
          { autoAlpha: 0, y: 30 },
          { 
            autoAlpha: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            onComplete: () => {
              setIsTransitioning(false)
            }
          }
        )
      } else {
        setIsTransitioning(false)
      }
    })
  }, [])

  const handleCameraControlReady = useCallback((moveToViewFn: (view: HallView) => void) => {
    setMoveToView(() => moveToViewFn)
  }, [])

  return (
    <div ref={rootRef} className="cinematic">
      <WebGLScene 
        currentScene={currentScene}
        isTransitioning={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        onCameraControlReady={handleCameraControlReady}
      />
      <Loader
        ref={loaderRef}
        isActive={isLoading}
        progressRef={loaderProgressRef}
        progressTextRef={loaderProgressTextRef}
      />
      <SkipLink targetId={CONTENT_ID} />
      <main id={CONTENT_ID} className="cinematic__main">
        {currentScene === 'entrance' && (
          <EntranceScreen ref={entranceRef} onEnter={handleEnter} />
        )}
        {currentScene === 'hall' && (
          <HallScreen ref={hallRef} moveToView={moveToView} />
        )}
      </main>
    </div>
  )
}

