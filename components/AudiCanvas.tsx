'use client'

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import type { MotionValue } from 'framer-motion'
import { useMotionValueEvent } from 'framer-motion'
import LoadingScreen from './LoadingScreen'
import { getFrameUrl } from '@/data/carData'

interface Props {
  scrollYProgress : MotionValue<number>
  totalFrames     : number
}

export default function AudiCanvas({ scrollYProgress, totalFrames }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const prevFrameRef = useRef<number>(-1)
  const rafRef       = useRef<number | null>(null)

  const [loaded,  setLoaded]  = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // MIN_READY_FRAMES allows the site to start before 100% of images are loaded
  const MIN_READY_FRAMES = 50 

  /**
   * Setup canvas dimensions for devicePixelRatio.
   * Prevents blurry output on Retina and 4K displays.
   */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR at 2 for performance
    const w   = window.innerWidth
    const h   = window.innerHeight
    canvas.width        = w * dpr
    canvas.height       = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium' // 'medium' is often faster than 'high'
      ctx.scale(dpr, dpr)
    }
  }, [])

  /**
   * Draw a single frame with OBJECT-FIT: COVER logic.
   * Vignette moved to CSS for performance.
   */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img    = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const cW = canvas.clientWidth
    const cH = canvas.clientHeight

    // Cover: fill canvas, maintain aspect ratio, crop edges
    const scale = Math.max(cW / img.naturalWidth, cH / img.naturalHeight)
    const x     = (cW - img.naturalWidth  * scale) / 2
    const y     = (cH - img.naturalHeight * scale) / 2

    // Fill with black instead of clearRect since alpha is false
    ctx.fillStyle = '#0D0D0D'
    ctx.fillRect(0, 0, cW, cH)
    
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
  }, [])

  /**
   * Preload strategy:
   * 1. Load first MIN_READY_FRAMES to show the page quickly.
   * 2. Load the rest in the background.
   */
  useEffect(() => {
    setupCanvas()

    let loadedCount = 0
    const images: HTMLImageElement[] = new Array(totalFrames)
    
    const loadImage = (i: number) => {
      if (images[i]) return
      const img = new Image()
      
      const handleLoad = () => {
        // Only decode if we are not already over a reasonable memory limit on mobile
        // For simplicity, we decode all as it's better for scroll smoothness
        img.decode().then(() => {
          loadedCount++
          setLoaded(loadedCount)
          if (loadedCount >= MIN_READY_FRAMES && !isReady) {
            setIsReady(true)
          }
          if (i === 0 && !prevFrameRef.current) {
             drawFrame(0)
          }
        }).catch(() => {
          loadedCount++
          setLoaded(loadedCount)
          if (loadedCount >= MIN_READY_FRAMES && !isReady) {
            setIsReady(true)
          }
        })
      }

      img.onload  = handleLoad
      img.onerror = () => {
        loadedCount++
        setLoaded(loadedCount)
      }
      img.src = getFrameUrl(i)
      images[i] = img
    }

    // Load first batch immediately
    for (let i = 0; i < totalFrames; i++) {
      loadImage(i)
    }

    imagesRef.current = images

    const handleResize = () => { setupCanvas(); drawFrame(Math.max(prevFrameRef.current, 0)) }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [totalFrames, setupCanvas, drawFrame, isReady])

  useLayoutEffect(() => {
    if (!isReady) return
    const frameIndex = Math.min(
      Math.round(scrollYProgress.get() * (totalFrames - 1)),
      totalFrames - 1
    )
    prevFrameRef.current = frameIndex
    drawFrame(frameIndex)
  }, [isReady, drawFrame, scrollYProgress, totalFrames])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isReady) return
    const frameIndex = Math.min(Math.round(progress * (totalFrames - 1)), totalFrames - 1)
    if (frameIndex === prevFrameRef.current) return
    
    // Check if the image is actually loaded before trying to draw it
    const img = imagesRef.current[frameIndex]
    if (!img || !img.complete) return

    prevFrameRef.current = frameIndex
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex))
  })

  return (
    <>
      <LoadingScreen loaded={loaded} total={totalFrames} isVisible={loaded < totalFrames * 0.9} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* CSS-based cinematic vignette for better performance */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)',
            opacity: 0.8
          }} 
        />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'block', 
          width: '100%', 
          height: '100%',
          imageRendering: 'auto'
        }}
      />
    </>
  )
}
