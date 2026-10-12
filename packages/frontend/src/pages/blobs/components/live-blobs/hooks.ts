import { type RefObject, useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Whether any of the element is on screen. Animations stop when it is not */
export function useIsOnScreen(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? false),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return onScreen
}

/**
 * Calls `onFrame` once a frame while `running`, with the seconds since the
 * last frame. The first frame after a long pause, as when the tab was hidden,
 * counts as a short one, so nothing jumps ahead.
 */
export function useAnimationFrame(
  onFrame: (dt: number, now: number) => void,
  running: boolean,
) {
  const callback = useRef(onFrame)
  callback.current = onFrame
  useEffect(() => {
    if (!running) return
    let last = performance.now()
    let id = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 1 / 15)
      last = now
      callback.current(dt, now / 1000)
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [running])
}

export interface ElementSize {
  width: number
  height: number
}

/** The content box of the element, 0 × 0 until it is measured */
export function useElementSize(ref: RefObject<Element | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/**
 * Sizes the canvas to `width` × `height` CSS pixels at the screen's density,
 * and returns a context that draws in CSS pixels. Density is capped at 2: past
 * it, a full-card canvas costs more to fill than the eye can tell apart.
 */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null {
  const density = Math.min(window.devicePixelRatio || 1, 2)
  const pixelWidth = Math.max(1, Math.round(width * density))
  const pixelHeight = Math.max(1, Math.round(height * density))
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }
  const context = canvas.getContext('2d')
  context?.setTransform(density, 0, 0, density, 0, 0)
  return context
}

/** The site's colors, read where canvas drawing cannot use CSS variables */
export interface ThemeTokens {
  isDark: boolean
  /** Text and strong ink */
  primary: string
  /** Quiet text */
  secondary: string
  brand: string
  /** The card the belt sits on */
  surface: string
  /** A step off the card */
  surfaceSecondary: string
  divider: string
}

const LIGHT_TOKENS: ThemeTokens = {
  isDark: false,
  primary: '#131215',
  secondary: '#5f6470',
  brand: '#9621bf',
  surface: '#fafafa',
  surfaceSecondary: '#e6e7ec',
  divider: '#ccd0da',
}

/** Follows the theme toggle, which swaps a class on the root element */
export function useThemeTokens(): ThemeTokens {
  const [tokens, setTokens] = useState<ThemeTokens>(LIGHT_TOKENS)
  useEffect(() => {
    const root = document.documentElement
    const read = () => {
      const style = getComputedStyle(root)
      const value = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback
      setTokens({
        isDark: root.classList.contains('dark'),
        primary: value('--primary', LIGHT_TOKENS.primary),
        secondary: value('--secondary', LIGHT_TOKENS.secondary),
        brand: value('--brand', LIGHT_TOKENS.brand),
        surface: value('--surface-primary', LIGHT_TOKENS.surface),
        surfaceSecondary: value(
          '--surface-secondary',
          LIGHT_TOKENS.surfaceSecondary,
        ),
        divider: value('--divider', LIGHT_TOKENS.divider),
      })
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return tokens
}

/**
 * Loads the icons to draw on a canvas, keyed by URL. Each one shows up once it
 * has loaded; until then it is simply left out.
 */
export function useImages(urls: (string | undefined)[]) {
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(
    () => new Map(),
  )
  const key = urls.filter(Boolean).join('|')
  useEffect(() => {
    let cancelled = false
    for (const url of key.split('|').filter(Boolean)) {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (cancelled) return
        setImages((current) => new Map(current).set(url, image))
      }
      image.src = url
    }
    return () => {
      cancelled = true
    }
  }, [key])
  return images
}
